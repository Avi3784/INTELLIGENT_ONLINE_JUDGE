const fs = require('fs');

let seedFileStr = fs.readFileSync('backend/seed/leetcodeSeed.js', 'utf8');

// Fix Valid Parentheses Python
seedFileStr = seedFileStr.replace(
  'mapping = {): "\\(", }: "\\{", ]: "\\["}',
  'mapping = {")": "(", "}": "{", "]": "["}'
);

// Fix Valid Parentheses JavaScript
seedFileStr = seedFileStr.replace(
  'const map = { ): "\\(", }: "\\{", ]: "\\[" };',
  'const map = { ")": "(", "}": "{", "]": "[" };'
);

fs.writeFileSync('backend/seed/leetcodeSeed.js', seedFileStr);
console.log("Fixed Valid Parentheses syntax in leetcodeSeed.js");
