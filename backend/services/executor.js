const https = require('https');
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const crypto = require('crypto');

// Piston API — free, public code execution engine
const PISTON_URL = process.env.PISTON_URL || 'https://emkc.org/api/v2/piston';

const PISTON_LANG_MAP = {
  python: { language: 'python', version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  cpp: { language: 'c++', version: '10.2.0' },
  java: { language: 'java', version: '15.0.2' },
};

// Simple HTTP POST helper that works without external dependencies
function httpPost(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const parsed = new URL(url);
    const lib = parsed.protocol === 'https:' ? https : http;

    const req = lib.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch {
          reject(new Error(`Invalid JSON response: ${responseData.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Request timed out')); });
    req.write(data);
    req.end();
  });
}

// Execute a single test case via Piston API
async function executeViaPiston(code, language, input, timeLimit) {
  const langConfig = PISTON_LANG_MAP[language];
  if (!langConfig) throw new Error(`Unsupported language: ${language}`);

  const fileExt = { python: 'py', javascript: 'js', cpp: 'cpp', java: 'java' }[language];
  const filename = language === 'java' ? 'Solution.java' : `solution.${fileExt}`;

  const startTime = Date.now();

  try {
    const result = await httpPost(`${PISTON_URL}/execute`, {
      language: langConfig.language,
      version: langConfig.version,
      files: [{ name: filename, content: code }],
      stdin: input || '',
      run_timeout: timeLimit,
      compile_timeout: 15000,
    });

    const executionTime = Date.now() - startTime;

    // Handle compilation errors
    if (result.compile && result.compile.code !== 0 && result.compile.stderr) {
      return {
        stdout: '',
        stderr: result.compile.stderr,
        code: 1,
        timedOut: false,
        executionTime,
        compilationError: true,
      };
    }

    // Handle run result
    const run = result.run || {};
    const timedOut = run.signal === 'SIGKILL' || (run.stderr && run.stderr.includes('timed out'));

    return {
      stdout: run.stdout || '',
      stderr: run.stderr || '',
      code: run.code ?? 0,
      timedOut,
      executionTime,
    };
  } catch (err) {
    return {
      stdout: '',
      stderr: `Execution service error: ${err.message}`,
      code: 1,
      timedOut: false,
      executionTime: Date.now() - startTime,
    };
  }
}

async function executeCode(code, language, testCases, timeLimit = 2000, methodName = null, driverCode = null) {
  if (!PISTON_LANG_MAP[language]) {
    throw new Error(`Unsupported language: ${language}`);
  }

  let finalCode = code;

  // Wrap with driver code if methodName is provided
  if (methodName) {
    if (language === 'javascript') {
      finalCode = `
${code}
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/);
if (input.length > 0 && input[0] !== '') {
  const parsedInput = input.map(line => JSON.parse(line));
  const sol = new Solution();
  const res = sol.${methodName}(...parsedInput);
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

  // For Java, wrap in class if needed
  if (language === 'java' && !finalCode.includes('class ') && !driverCode) {
    finalCode = `public class Solution {\n${finalCode}\n}`;
  }

  // Run each test case
  const results = [];
  for (const tc of testCases) {
    const formattedInput = (tc.input || '').replace(/\\n/g, '\n');
    const result = await executeViaPiston(finalCode, language, formattedInput, timeLimit);

    if (result.compilationError) {
      // If compilation fails, all test cases fail with the same error
      return testCases.map((t) => ({
        passed: false,
        input: t.input,
        expectedOutput: t.expectedOutput,
        actualOutput: '',
        executionTime: result.executionTime,
        error: `RTE: ${result.stderr || 'Compilation failed'}`,
        isHidden: t.isHidden || false,
      }));
    }

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
}

module.exports = { executeCode };
