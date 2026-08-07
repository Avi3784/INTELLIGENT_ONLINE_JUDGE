const { executeCode } = require('./backend/services/executor');

async function testExecutor() {
  const code = `class Solution:
    def isPalindrome(self, x):
        if x < 0: return False
        temp = x
        rev = 0
        while temp > 0:
            rev = rev * 10 + temp % 10
            temp //= 10
        return rev == x`;
        
  const testCases = [
    { input: '121', expectedOutput: 'true' }
  ];
  
  try {
    console.log("Running Python code...");
    const res = await executeCode(code, 'python', testCases, 2000, 'isPalindrome', null);
    console.log("Python Result:", JSON.stringify(res, null, 2));
    
    const jsCode = `class Solution {
  isPalindrome(x) {
    if (x < 0) return false;
    let temp = x;
    let rev = 0;
    while (temp > 0) {
      rev = rev * 10 + temp % 10;
      temp = Math.floor(temp / 10);
    }
    return rev === x;
  }
}`;
    console.log("\nRunning JS code...");
    const jsRes = await executeCode(jsCode, 'javascript', testCases, 2000, 'isPalindrome', null);
    console.log("JS Result:", JSON.stringify(jsRes, null, 2));

  } catch (err) {
    console.error("Error testing:", err);
  }
}

testExecutor();
