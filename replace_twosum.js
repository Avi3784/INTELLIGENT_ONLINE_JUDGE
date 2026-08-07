const fs = require('fs');

let seedFileStr = fs.readFileSync('backend/seed/leetcodeSeed.js', 'utf8');

const match = seedFileStr.match(/const problems = (\[[\s\S]*?\]);\n\nrequire/);

if (match) {
    const problemsStr = match[1];
    fs.writeFileSync('temp_problems2.js', `module.exports = ${problemsStr};`);
    const problems = require('./temp_problems2.js');
    
    // Find Two Sum and replace it
    const twoSumIndex = problems.findIndex(p => p.title === 'Two Sum');
    if (twoSumIndex !== -1) {
        problems[twoSumIndex] = {
            title: 'Palindrome Number',
            description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
            difficulty: 'EASY',
            tags: ['math'],
            timeLimit: 2000,
            memoryLimit: 256,
            hints: ['Beware of integer overflow when you reverse the integer.'],
            methodName: 'isPalindrome',
            defaultCode: {
              python: 'class Solution:\n    def isPalindrome(self, x):\n        pass',
              javascript: 'class Solution {\n  isPalindrome(x) {\n    \n  }\n}',
              cpp: '#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};',
              java: 'class Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}'
            },
            driverCode: {
              cpp: '',
              java: ''
            },
            officialSolution: {
              explanation: 'Reverse the number by extracting digits from right to left using modulo 10 and multiplying the reversed number by 10. Finally, check if it matches the original number. Negative numbers are never palindromes.',
              code: {
                python: 'class Solution:\n    def isPalindrome(self, x):\n        if x < 0: return False\n        temp = x\n        rev = 0\n        while temp > 0:\n            rev = rev * 10 + temp % 10\n            temp //= 10\n        return rev == x',
                javascript: 'class Solution {\n  isPalindrome(x) {\n    if (x < 0) return false;\n    let temp = x;\n    let rev = 0;\n    while (temp > 0) {\n      rev = rev * 10 + temp % 10;\n      temp = Math.floor(temp / 10);\n    }\n    return rev === x;\n  }\n}',
                cpp: '#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(int x) {\n        if (x < 0) return false;\n        long long temp = x;\n        long long rev = 0;\n        while (temp > 0) {\n            rev = rev * 10 + temp % 10;\n            temp /= 10;\n        }\n        return rev == x;\n    }\n};',
                java: 'class Solution {\n    public boolean isPalindrome(int x) {\n        if (x < 0) return false;\n        long temp = x;\n        long rev = 0;\n        while (temp > 0) {\n            rev = rev * 10 + temp % 10;\n            temp /= 10;\n        }\n        return rev == x;\n    }\n}'
              }
            },
            sampleTestCases: [
              { input: '121', expectedOutput: 'true' }
            ],
            hiddenTestCases: [
              { input: '-121', expectedOutput: 'false' },
              { input: '10', expectedOutput: 'false' }
            ]
        };
        console.log("Replaced Two Sum with Palindrome Number");
    }

    const newProblemsStr = JSON.stringify(problems, null, 2).replace(/"([^"]+)":/g, '$1:');
    
    const newFileStr = seedFileStr.replace(/const problems = \[[\s\S]*?\];\n\nrequire/, `const problems = ${newProblemsStr};\n\nrequire`);
    
    fs.writeFileSync('backend/seed/leetcodeSeed.js', newFileStr);
} else {
    console.log("Failed to match problems array");
}
