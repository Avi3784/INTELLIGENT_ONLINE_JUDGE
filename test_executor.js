const { executeCode } = require('./backend/services/executor');

async function runTest() {
  try {
    const res = await executeCode('print(input())', 'python', [{input: 'hello', expectedOutput: 'hello'}], 2000, null, null);
    console.log("Result:", res);
  } catch(e) {
    console.error(e);
  }
}
runTest();
