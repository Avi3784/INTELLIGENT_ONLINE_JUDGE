const { executeCode } = require('./backend/services/executor');
const fs = require('fs');

async function verifyAllSolutions() {
  console.log("Loading problems...");
  // Temporarily write the export line to read the JS file
  let seedFileStr = fs.readFileSync('backend/seed/leetcodeSeed.js', 'utf8');
  const match = seedFileStr.match(/const problems = (\[[\s\S]*?\]);\n\nrequire/);
  if (!match) {
    console.error("Could not parse leetcodeSeed.js");
    return;
  }
  
  fs.writeFileSync('temp_verify.js', `module.exports = ${match[1]};`);
  const problems = require('./temp_verify.js');
  
  console.log(`Found ${problems.length} problems. Starting verification...`);
  
  let totalTests = 0;
  let passedTests = 0;
  let failed = [];

  for (const problem of problems) {
    console.log(`\nVerifying Problem: ${problem.title}`);
    const testCases = [...(problem.sampleTestCases || []), ...(problem.hiddenTestCases || [])];
    
    if (testCases.length === 0) {
      console.log(`Skipping - no test cases`);
      continue;
    }

    const officialCode = problem.officialSolution?.code;
    if (!officialCode) {
      console.log(`Skipping - no official solution`);
      continue;
    }

    const languages = ['python', 'javascript', 'cpp', 'java'];
    
    for (const lang of languages) {
      const code = officialCode[lang];
      if (!code) {
        console.log(`Missing official code for ${lang} - Skipping`);
        continue;
      }
      
      try {
        const res = await executeCode(code, lang, testCases, 2000, problem.methodName, problem.driverCode);
        let allPassed = true;
        let failDetails = null;

        for (const tcRes of res) {
          totalTests++;
          if (tcRes.passed) {
            passedTests++;
          } else {
            allPassed = false;
            failDetails = tcRes;
          }
        }

        if (allPassed) {
          console.log(`  [PASSED] ${lang}`);
        } else {
          console.error(`  [FAILED] ${lang}`);
          console.error("    Error/Details: " + (failDetails.error || "Expected " + failDetails.expectedOutput + " but got " + failDetails.actualOutput));
          failed.push({ problem: problem.title, lang, details: failDetails });
        }
        
      } catch (err) {
        console.error(`  [ERROR] ${lang}: ${err.message}`);
        failed.push({ problem: problem.title, lang, error: err.message });
      }
    }
  }

  console.log(`\n=== Verification Complete ===`);
  console.log(`Total tests run: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  if (failed.length > 0) {
    console.log(`Failed: ${failed.length}`);
    console.log(JSON.stringify(failed, null, 2));
  } else {
    console.log(`ALL TESTS PASSED PERFECTLY!`);
  }
}

verifyAllSolutions();
