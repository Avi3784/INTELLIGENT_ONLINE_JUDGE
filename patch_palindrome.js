const fs = require('fs');

const signatures = {
  'Palindrome Number': { ret: 'bool', args: ['int'] }
};

const javaSignatures = {
  'Palindrome Number': { ret: 'boolean', args: ['int'] }
};

function getCppParser(type, index) {
    if (type === 'int') {
        return `int arg${index}; cin >> arg${index};`;
    }
    return '';
}

function getCppPrinter(type) {
    if (type === 'bool') return `cout << (res ? "true" : "false") << endl;`;
    return '';
}

function generateCppDriver(methodName, sig) {
    if(!sig) return '';
    let code = `\nint main() {\n    Solution sol;\n`;
    for (let i = 0; i < sig.args.length; i++) code += `    ${getCppParser(sig.args[i], i)}\n`;
    const callArgs = sig.args.map((_, i) => `arg${i}`).join(', ');
    code += `    auto res = sol.${methodName}(${callArgs});\n`;
    code += `    ${getCppPrinter(sig.ret)}\n    return 0;\n}\n`;
    return code;
}

function getJavaParser(type, index) {
    if (type === 'int') return `int arg${index} = Integer.parseInt(scanner.nextLine().trim());`;
    return '';
}

function getJavaPrinter(type) {
    if (type === 'boolean') return `System.out.println(res);`;
    return '';
}

function generateJavaDriver(methodName, sig) {
    if(!sig) return '';
    let code = `\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n`;
    for (let i = 0; i < sig.args.length; i++) code += `        ${getJavaParser(sig.args[i], i)}\n`;
    const callArgs = sig.args.map((_, i) => `arg${i}`).join(', ');
    code += `        ${sig.ret} res = sol.${methodName}(${callArgs});\n`;
    code += `        ${getJavaPrinter(sig.ret)}\n    }\n}\n`;
    return code;
}

let seedFileStr = fs.readFileSync('backend/seed/leetcodeSeed.js', 'utf8');

const match = seedFileStr.match(/const problems = (\[[\s\S]*?\]);\n\nrequire/);
if (match) {
    const problemsStr = match[1];
    fs.writeFileSync('temp_problems_patch.js', `module.exports = ${problemsStr};`);
    const problems = require('./temp_problems_patch.js');
    
    for (const p of problems) {
        if (signatures[p.title]) {
            p.driverCode.cpp = generateCppDriver(p.methodName, signatures[p.title]);
            p.driverCode.java = generateJavaDriver(p.methodName, javaSignatures[p.title]);
        }
    }
    
    const newProblemsStr = JSON.stringify(problems, null, 2).replace(/"([^"]+)":/g, '$1:');
    const newFileStr = seedFileStr.replace(/const problems = \[[\s\S]*?\];\n\nrequire/, `const problems = ${newProblemsStr};\n\nrequire`);
    fs.writeFileSync('backend/seed/leetcodeSeed.js', newFileStr);
    console.log("Successfully patched Palindrome Number driver");
}
