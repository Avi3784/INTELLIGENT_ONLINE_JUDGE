const fs = require('fs');
let s = fs.readFileSync('backend/seed/leetcodeSeed.js', 'utf8');
s = s.replace(/(input|expectedOutput):\s*"([^"]*?)\\n([^"]*?)"/g, '$1: "$2\\\\n$3"');
s = s.replace(/(input|expectedOutput):\s*"([^"]*?)\\n([^"]*?)"/g, '$1: "$2\\\\n$3"');
fs.writeFileSync('backend/seed/leetcodeSeed.js', s);
console.log('Fixed newlines');
