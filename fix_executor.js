const fs = require('fs');
let data = fs.readFileSync('backend/services/executor.js', 'utf8');
data = data.replace(/\\\\`/g, '`').replace(/\\\\\$/g, '$');
fs.writeFileSync('backend/services/executor.js', data);
console.log("Replaced escaped backticks and dollars.");
