const https = require('https');
const http = require('http');

function httpPost(urlStr, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const url = new URL(urlStr);
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
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
      res.on('end', () => resolve(JSON.parse(responseData)));
    });
    req.end();
  });
}

async function test() {
  const code = `
print(input())
  `;
  try {
      const createRes = await httpPost('https://api.paiza.io/runners/create', {
        source_code: code,
        language: 'python3',
        input: 'hello from paiza',
        api_key: 'guest'
      });
      console.log('Create:', createRes);
      
      let status = 'running';
      let details;
      while (status !== 'completed') {
          await new Promise(r => setTimeout(r, 1000));
          details = await httpGet(`https://api.paiza.io/runners/get_details?id=${createRes.id}&api_key=guest`);
          status = details.status;
      }
      console.log('Result:', details);
  } catch(e) { console.error(e); }
}
test();
