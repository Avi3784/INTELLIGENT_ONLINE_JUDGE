const { executeCode } = require('./backend/services/executor');
const fs = require('fs');

async function verifyAllSolutions() {
  console.log("Loading problems...");
  let seedFileStr = fs.readFileSync('backend/seed/leetcodeSeed.js', 'utf8');
  const match = seedFileStr.match(/const problems = (\[[\s\S]*?\]);\n\nrequire/);
  fs.writeFileSync('temp_verify.js', `module.exports = ${match[1]};`);
  const problems = require('./temp_verify.js');
  
  console.log(`Found ${problems.length} problems. Starting fast verification...`);
  
  let failed = [];
  const tasks = [];

  for (const problem of problems) {
    const testCases = [...(problem.sampleTestCases || []), ...(problem.hiddenTestCases || [])];
    if (testCases.length === 0) continue;
    const officialCode = problem.officialSolution?.code;
    if (!officialCode) continue;

    const languages = ['python', 'javascript', 'cpp', 'java'];
    
    for (const lang of languages) {
      const code = officialCode[lang];
      if (!code) continue;
      
      tasks.push(async () => {
        try {
          const res = await executeCode(code, lang, testCases, 2000, problem.methodName, problem.driverCode);
          let allPassed = true;
          let failDetails = null;
          for (const tcRes of res) {
            if (!tcRes.passed) {
              allPassed = false;
              failDetails = tcRes;
              break;
            }
          }
          if (allPassed) {
            console.log(`[PASSED] ${problem.title} - ${lang}`);
          } else {
            console.error(`[FAILED] ${problem.title} - ${lang}: ` + (failDetails.error || "Wrong Output"));
            failed.push({ problem: problem.title, lang, error: failDetails.error });
          }
        } catch (err) {
          console.error(`[ERROR] ${problem.title} - ${lang}: ${err.message}`);
          failed.push({ problem: problem.title, lang, error: err.message });
        }
      });
    }
  }

  // Run in chunks of 2
  for (let i = 0; i < tasks.length; i += 2) {
    const chunk = tasks.slice(i, i + 2);
    await Promise.all(chunk.map(fn => fn()));
  }

  console.log(`\n=== Verification Complete ===`);
  if (failed.length > 0) {
    console.log(`Failed count: ${failed.length}`);
    console.log(JSON.stringify(failed, null, 2));
    process.exit(1);
  } else {
    console.log(`ALL TESTS PASSED PERFECTLY!`);
    process.exit(0);
  }
}

verifyAllSolutions();
