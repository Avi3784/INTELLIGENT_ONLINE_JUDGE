const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const LANG_CONFIG = {
  python: {
    ext: '.py',
    compile: null,
    run: (dir, file) => ['python', [file]],
  },
  javascript: {
    ext: '.js',
    compile: null,
    run: (dir, file) => ['node', [file]],
  },
  cpp: {
    ext: '.cpp',
    compile: (dir, file) => ['g++', [file, '-o', path.join(dir, 'solution')]],
    run: (dir) => [path.join(dir, 'solution'), []],
  },
  java: {
    ext: '.java',
    compile: (dir, file) => ['javac', [file]],
    run: (dir) => ['java', ['-cp', dir, 'Solution']],
  },
};

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
      resolve({ stdout: '', stderr: err.message, code: 1, timedOut: false, executionTime });
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

async function executeCode(code, language, testCases, timeLimit = 2000) {
  const config = LANG_CONFIG[language];
  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const tmpDir = path.join(os.tmpdir(), `judge-${crypto.randomUUID()}`);
  await fs.mkdir(tmpDir, { recursive: true });

  try {
    // For Java, filename must be Solution.java
    let filename;
    if (language === 'java') {
      filename = 'Solution.java';
      // Wrap code in a class if it doesn't contain one
      if (!code.includes('class ')) {
        code = `public class Solution {\n${code}\n}`;
      }
    } else {
      filename = `solution${config.ext}`;
    }

    const filepath = path.join(tmpDir, filename);
    await fs.writeFile(filepath, code);

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
      const result = await runProcess(cmd, args, tc.input || '', timeLimit);

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

    // Try python3 fallback if python failed on all test cases
    if (language === 'python' && results.length > 0 && results.every((r) => r.error && r.error.includes('RTE'))) {
      const fallbackResults = [];
      let fallbackWorked = false;

      for (const tc of testCases) {
        const result = await runProcess('python3', [filepath], tc.input || '', timeLimit);

        if (result.timedOut) {
          fallbackResults.push({
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

        if (result.code !== 0 && result.stderr && result.stderr.includes('not found')) {
          break; // python3 not available, stick with original results
        }

        fallbackWorked = true;

        if (result.code !== 0) {
          fallbackResults.push({
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

        fallbackResults.push({
          passed,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput,
          executionTime: result.executionTime,
          error: null,
          isHidden: tc.isHidden || false,
        });
      }

      if (fallbackWorked && fallbackResults.length === testCases.length) {
        return fallbackResults;
      }
    }

    return results;
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

module.exports = { executeCode };
