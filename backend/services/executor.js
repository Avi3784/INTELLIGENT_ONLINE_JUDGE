const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const isWindows = process.platform === 'win32';
const useDocker = process.env.USE_DOCKER === 'true';

const NATIVE_LANG_CONFIG = {
  python: {
    ext: '.py',
    compile: null,
    run: (dir, file) => [process.platform === 'win32' ? 'python' : 'python3', [file]],
  },
  javascript: {
    ext: '.js',
    compile: null,
    run: (dir, file) => ['node', [file]],
  },
  cpp: {
    ext: '.cpp',
    compile: (dir, file) => {
      const outExt = isWindows ? '.exe' : '';
      return ['g++', [file, '-o', path.join(dir, `solution${outExt}`)]];
    },
    run: (dir) => {
      const outExt = isWindows ? '.exe' : '';
      return [path.join(dir, `solution${outExt}`), []];
    },
  },
  java: {
    ext: '.java',
    compile: (dir, file) => ['javac', [file]],
    run: (dir) => ['java', ['-cp', dir, 'Solution']],
  },
};

const DOCKER_LANG_CONFIG = {
  python: {
    ext: '.py',
    compile: null,
    run: (dir, file) => ['docker', ['run', '--rm', '-i', '--init', '-v', `${dir}:/app`, '-w', '/app', '--network', 'none', '--memory', '256m', '--cpus', '1', 'python:3.9-slim', 'python', path.basename(file)]],
  },
  javascript: {
    ext: '.js',
    compile: null,
    run: (dir, file) => ['docker', ['run', '--rm', '-i', '--init', '-v', `${dir}:/app`, '-w', '/app', '--network', 'none', '--memory', '256m', '--cpus', '1', 'node:18-alpine', 'node', path.basename(file)]],
  },
  cpp: {
    ext: '.cpp',
    compile: (dir, file) => ['docker', ['run', '--rm', '-i', '-v', `${dir}:/app`, '-w', '/app', 'gcc:12', 'g++', path.basename(file), '-o', 'solution']],
    run: (dir) => ['docker', ['run', '--rm', '-i', '--init', '-v', `${dir}:/app`, '-w', '/app', '--network', 'none', '--memory', '256m', '--cpus', '1', 'gcc:12', './solution']],
  },
  java: {
    ext: '.java',
    compile: (dir, file) => ['docker', ['run', '--rm', '-i', '-v', `${dir}:/app`, '-w', '/app', 'openjdk:17-jdk-alpine', 'javac', path.basename(file)]],
    run: (dir) => ['docker', ['run', '--rm', '-i', '--init', '-v', `${dir}:/app`, '-w', '/app', '--network', 'none', '--memory', '256m', '--cpus', '1', 'openjdk:17-jdk-alpine', 'java', 'Solution']],
  },
};

const LANG_CONFIG = useDocker ? DOCKER_LANG_CONFIG : NATIVE_LANG_CONFIG;

function runProcess(cmd, args, input, timeLimit) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let stdout = '';
    let stderr = '';
    let killed = false;

    const proc = spawn(cmd, args, { stdio: ['pipe', 'pipe', 'pipe'] });

    const timer = setTimeout(() => {
      killed = true;
      proc.kill('SIGKILL');
    }, timeLimit);

    proc.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    if (input !== null && input !== undefined) {
      proc.stdin.write(input);
    }
    proc.stdin.end();

    proc.on('close', (code) => {
      clearTimeout(timer);
      const executionTime = Date.now() - startTime;

      if (killed) {
        resolve({ stdout, stderr, code, timedOut: true, executionTime });
      } else {
        resolve({ stdout, stderr, code, timedOut: false, executionTime });
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      const executionTime = Date.now() - startTime;
      const errorMessage = err.code === 'ENOENT'
        ? `Command '${cmd}' not found. Please ensure the ${cmd} runtime/compiler is installed and added to PATH.`
        : err.message;
      resolve({ stdout: '', stderr: errorMessage, code: 1, timedOut: false, executionTime });
    });
  });
}

async function compileCode(dir, language, filepath) {
  const config = LANG_CONFIG[language];
  if (!config.compile) return null;

  const [cmd, args] = config.compile(dir, filepath);
  const result = await runProcess(cmd, args, null, 30000);

  if (result.code !== 0) {
    return { error: result.stderr || 'Compilation failed' };
  }
  return null;
}

async function executeCode(code, language, testCases, timeLimit = 2000, methodName = null, driverCode = null) {
  const config = LANG_CONFIG[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const tmpDir = path.join(os.tmpdir(), `judge-${crypto.randomUUID()}`);
  await fs.mkdir(tmpDir, { recursive: true });

  try {
    let finalCode = code;

    if (methodName) {
      if (language === 'javascript') {
        finalCode = `
${code}
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/);
if (input.length > 0 && input[0] !== '') {
  const parsedInput = input.map(line => JSON.parse(line));
  const res = ${methodName}(...parsedInput);
  console.log(JSON.stringify(res));
}
`;
      } else if (language === 'python') {
        finalCode = `
import sys
import json
${code}

if __name__ == '__main__':
    input_data = sys.stdin.read().strip().splitlines()
    if input_data and input_data[0] != '':
        parsed_input = [json.loads(line) for line in input_data]
        sol = Solution()
        res = getattr(sol, '${methodName}')(*parsed_input)
        print(json.dumps(res, separators=(',', ':')).replace(' ', ''))
`;
      } else if ((language === 'cpp' || language === 'java') && driverCode && driverCode[language]) {
        finalCode = `
${code}
${driverCode[language]}
`;
      }
    }

    // For Java, filename must be Solution.java
    let filename;
    if (language === 'java') {
      filename = 'Solution.java';
      // Wrap code in a class if it doesn't contain one and there's no custom driver wrapping it
      if (!finalCode.includes('class ') && !driverCode) {
        finalCode = `public class Solution {\n${finalCode}\n}`;
      }
    } else {
      filename = `solution${config.ext}`;
    }

    const filepath = path.join(tmpDir, filename);
    await fs.writeFile(filepath, finalCode);

    // Compile if needed
    const compileError = await compileCode(tmpDir, language, filepath);
    if (compileError) {
      return testCases.map((tc) => ({
        passed: false,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: '',
        executionTime: 0,
        error: `RTE: ${compileError.error}`,
        isHidden: tc.isHidden || false,
      }));
    }

    // Run each test case
    const results = [];
    for (const tc of testCases) {
      const [cmd, args] = config.run(tmpDir, filepath);
      const formattedInput = (tc.input || '').replace(/\\n/g, '\n');
      const result = await runProcess(cmd, args, formattedInput, timeLimit);

      if (result.timedOut) {
        results.push({
          passed: false,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: result.stdout.trim(),
          executionTime: result.executionTime,
          error: 'TLE: Time limit exceeded',
          isHidden: tc.isHidden || false,
        });
        continue;
      }

      if (result.code !== 0) {
        results.push({
          passed: false,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: result.stdout.trim(),
          executionTime: result.executionTime,
          error: `RTE: ${result.stderr || 'Runtime error'}`,
          isHidden: tc.isHidden || false,
        });
        continue;
      }

      const actualOutput = result.stdout.trim();
      const expectedOutput = (tc.expectedOutput || '').trim();
      const passed = actualOutput === expectedOutput;

      results.push({
        passed,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput,
        executionTime: result.executionTime,
        error: null,
        isHidden: tc.isHidden || false,
      });
    }



    return results;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

module.exports = { executeCode };
