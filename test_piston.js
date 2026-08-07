const https = require('https');
function httpPost(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const parsed = new URL(url);
    const req = https.request({
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
      res.on('end', () => resolve(JSON.parse(responseData)));
    });
    req.write(data);
    req.end();
  });
}
async function test() {
  const code = `
class Solution {
  twoSum(nums, target) {
    const numMap = new Map();
    for (let i = 0; i < nums.length; i++) {
      const diff = target - nums[i];
      if (numMap.has(diff)) return [numMap.get(diff), i];
      numMap.set(nums[i], i);
    }
    return [];
  }
}
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\r?\\n/);
if (input.length > 0 && input[0] !== '') {
  const parsedInput = input.map(line => JSON.parse(line));
  const sol = new Solution();
  const res = sol.twoSum(...parsedInput);
  console.log(JSON.stringify(res));
}
  `;
  const res = await httpPost('https://emkc.org/api/v2/piston/execute', {
    language: 'javascript', version: '18.15.0', files: [{content: code}], stdin: '[2,7,11,15]\n9'
  });
  console.log(res);
}
test();
