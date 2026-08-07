const { executeCode } = require('./backend/services/executor');

async function testExecutor() {
  const code = `class Solution:
    def twoSum(self, nums, target):
        return [0, 1]`;
        
  const testCases = [
    { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' }
  ];
  
  try {
    console.log("Running Python code...");
    const res = await executeCode(code, 'python', testCases, 2000, 'twoSum', null);
    console.log("Python Result:", JSON.stringify(res, null, 2));
    
  } catch (err) {
    console.error("Error testing:", err);
  }
}

testExecutor();
