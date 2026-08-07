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
print("Hello wandbox")
  `;
  const res = await httpPost('https://wandbox.org/api/compile.json', {
    compiler: 'cpython-3.10.6',
    code: code
  });
  console.log(res);
}
test();
