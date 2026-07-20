const { executeCode } = require('../services/executor');

async function runTests() {
  console.log('🧪 Starting Compiler Stress & Integration Tests...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // TEST 1: Normal Execution (Python)
    console.log('--- Test 1: Normal Python Execution ---');
    const pyCode = 'print(int(input()) * 2)';
    const pyTestCases = [{ input: '5', expectedOutput: '10' }];
    const pyResult = await executeCode(pyCode, 'python', pyTestCases);
    assert(pyResult[0].passed === true, 'Python code executes correctly');

    // TEST 2: Time Limit Exceeded (JavaScript)
    console.log('\n--- Test 2: TLE handling (JS) ---');
    const jsCode = 'while(true) {}';
    const jsTestCases = [{ input: '1', expectedOutput: '1' }];
    const jsResult = await executeCode(jsCode, 'javascript', jsTestCases, 500); // 500ms limit
    assert(
      jsResult[0].passed === false && jsResult[0].error.includes('TLE'),
      'Infinite loop killed and TLE returned'
    );

    // TEST 3: Runtime Error (Python)
    console.log('\n--- Test 3: Runtime Error handling (Python) ---');
    const rteCode = 'print(1 / 0)';
    const rteResult = await executeCode(rteCode, 'python', pyTestCases);
    assert(
      rteResult[0].passed === false && rteResult[0].error.includes('ZeroDivisionError'),
      'RTE caught successfully'
    );

    // TEST 4: Compile Error (C++)
    console.log('\n--- Test 4: Compilation Error (C++) ---');
    const cppCode = '#include <iostream>\nint main() { cout << "Hello"; }'; // missing std::
    const cppResult = await executeCode(cppCode, 'cpp', pyTestCases);
    assert(
      cppResult[0].passed === false && cppResult[0].error.includes('error:'),
      'C++ Compilation error caught'
    );

    console.log('\n=======================================');
    console.log(`Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log('=======================================');

  } catch (error) {
    console.error('Test script crashed:', error);
  }
}

runTests();
