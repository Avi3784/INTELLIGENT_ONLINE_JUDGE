const https = require('https');
const http = require('http');

// Paiza.IO API - Free, public code execution engine
const PAIZA_LANG_MAP = {
  python: 'python3',
  javascript: 'javascript',
  cpp: 'cpp',
  java: 'java'
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
      path: parsed.pathname + parsed.search,
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
        } catch (e) {
          resolve({ message: responseData });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

// Simple HTTP GET helper
function httpGet(urlStr) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: 'GET'
    }, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(responseData));
        } catch (e) {
          resolve({ message: responseData });
        }
      });
    });
    req.on('error', (e) => reject(e));
    req.end();
  });
}

/**
 * Execute code using Paiza.IO API
 */
async function executeCode(code, language, testCases, timeLimit = 2000, methodName = null, driverCode = null) {
  if (!PAIZA_LANG_MAP[language]) {
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

  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    
    try {
      const createRes = await httpPost('https://api.paiza.io/runners/create', {
        source_code: finalCode,
        language: PAIZA_LANG_MAP[language],
        input: testCase.input,
        api_key: 'guest'
      });

      if (createRes.error) {
        throw new Error(createRes.error);
      }

      let status = 'running';
      let details;
      const startTime = Date.now();

      while (status !== 'completed') {
        if (Date.now() - startTime > timeLimit + 10000) {
          throw new Error('Execution timeout');
        }
        await new Promise(r => setTimeout(r, 1000));
        details = await httpGet(`https://api.paiza.io/runners/get_details?id=${createRes.id}&api_key=guest`);
        status = details.status;
      }

      if (details.build_result === 'failure') {
        results.push({
          passed: false,
          error: "Compilation Error:\\n" + (details.build_stderr || 'Unknown build error'),
          testCase: testCase
        });
        continue;
      }

      if (details.result !== 'success' || details.stderr) {
        results.push({
          passed: false,
          error: "Runtime Error:\\n" + (details.stderr || details.result),
          testCase: testCase
        });
        continue;
      }

      const actualOutput = details.stdout ? details.stdout.trim() : '';
      const expectedOutput = testCase.expectedOutput.trim();

      results.push({
        passed: actualOutput === expectedOutput,
        actualOutput,
        expectedOutput,
        testCase: testCase
      });
      
    } catch (error) {
      console.error("Paiza API Error for test case " + i + ":", error);
      results.push({
        passed: false,
        error: "Execution Error: " + error.message,
        testCase: testCase
      });
    }
  }

  return results;
}

module.exports = {
  executeCode
};
