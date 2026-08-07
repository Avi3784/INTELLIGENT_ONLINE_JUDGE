const fs = require('fs');

let seedFileStr = fs.readFileSync('backend/seed/leetcodeSeed.js', 'utf8');

// The test case inputs have things like `input: "[4,5,6,7,0,1,2]\\n0"`
// This literally creates a string with a backslash and an 'n'. 
// We want to replace `\\n` with `\n` inside the string literals for testcases.
// However, since it's a JS file with `input: "..."`, if we do a regex replace:
seedFileStr = seedFileStr.replace(/(input|expectedOutput):\s*"([^"]*?)\\\\n([^"]*?)"/g, '$1: "$2\\n$3"');
seedFileStr = seedFileStr.replace(/(input|expectedOutput):\s*"([^"]*?)\\\\n([^"]*?)"/g, '$1: "$2\\n$3"');

fs.writeFileSync('backend/seed/leetcodeSeed.js', seedFileStr);
console.log("Fixed newlines in testcases");
