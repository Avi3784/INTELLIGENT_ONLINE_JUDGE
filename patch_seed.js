const fs = require('fs');

const signatures = {
  'Two Sum': { ret: 'vector<int>', args: ['vector<int>', 'int'] },
  'Valid Parentheses': { ret: 'bool', args: ['string'] },
  'Best Time to Buy and Sell Stock': { ret: 'int', args: ['vector<int>'] },
  'Contains Duplicate': { ret: 'bool', args: ['vector<int>'] },
  'Product of Array Except Self': { ret: 'vector<int>', args: ['vector<int>'] },
  'Maximum Subarray': { ret: 'int', args: ['vector<int>'] },
  'Missing Number': { ret: 'int', args: ['vector<int>'] },
  'Valid Anagram': { ret: 'bool', args: ['string', 'string'] },
  'Container With Most Water': { ret: 'int', args: ['vector<int>'] },
  'Find Minimum in Rotated Sorted Array': { ret: 'int', args: ['vector<int>'] },
  'Search in Rotated Sorted Array': { ret: 'int', args: ['vector<int>', 'int'] },
  'Climbing Stairs': { ret: 'int', args: ['int'] },
  'Merge Intervals': { ret: 'vector<vector<int>>', args: ['vector<vector<int>>'] },
  'Longest Substring Without Repeating Characters': { ret: 'int', args: ['string'] },
  'Fibonacci Number': { ret: 'int', args: ['int'] }
};

const javaSignatures = {
  'Two Sum': { ret: 'int[]', args: ['int[]', 'int'] },
  'Valid Parentheses': { ret: 'boolean', args: ['String'] },
  'Best Time to Buy and Sell Stock': { ret: 'int', args: ['int[]'] },
  'Contains Duplicate': { ret: 'boolean', args: ['int[]'] },
  'Product of Array Except Self': { ret: 'int[]', args: ['int[]'] },
  'Maximum Subarray': { ret: 'int', args: ['int[]'] },
  'Missing Number': { ret: 'int', args: ['int[]'] },
  'Valid Anagram': { ret: 'boolean', args: ['String', 'String'] },
  'Container With Most Water': { ret: 'int', args: ['int[]'] },
  'Find Minimum in Rotated Sorted Array': { ret: 'int', args: ['int[]'] },
  'Search in Rotated Sorted Array': { ret: 'int', args: ['int[]', 'int'] },
  'Climbing Stairs': { ret: 'int', args: ['int'] },
  'Merge Intervals': { ret: 'int[][]', args: ['int[][]'] },
  'Longest Substring Without Repeating Characters': { ret: 'int', args: ['String'] },
  'Fibonacci Number': { ret: 'int', args: ['int'] }
};

function getCppParser(type, index) {
    if (type === 'int') {
        return `int arg${index}; cin >> arg${index};`;
    }
    if (type === 'string') {
        return `string arg${index}; string line${index}; getline(cin >> ws, line${index}); if(line${index}.size()>=2 && line${index}[0]=='"' && line${index}.back()=='"') arg${index} = line${index}.substr(1, line${index}.size()-2); else arg${index} = line${index};`;
    }
    if (type === 'vector<int>') {
        return `vector<int> arg${index}; string s${index}; getline(cin >> ws, s${index}); string temp${index} = ""; for(char c : s${index}) { if(c == '[' || c == ']') continue; if(c == ',') { if(temp${index}!="") { arg${index}.push_back(stoi(temp${index})); temp${index}=""; } } else temp${index} += c; } if(temp${index}!="") arg${index}.push_back(stoi(temp${index}));`;
    }
    if (type === 'vector<vector<int>>') {
        return `vector<vector<int>> arg${index}; string s${index}; getline(cin >> ws, s${index}); vector<int> curr${index}; string temp${index} = ""; bool in_array${index} = false; for(int i = 1; i < s${index}.size()-1; i++) { char c = s${index}[i]; if (c == '[') { in_array${index} = true; } else if (c == ']') { if(temp${index}!="") { curr${index}.push_back(stoi(temp${index})); temp${index}=""; } arg${index}.push_back(curr${index}); curr${index}.clear(); in_array${index} = false; } else if (c == ',') { if(in_array${index} && temp${index}!="") { curr${index}.push_back(stoi(temp${index})); temp${index}=""; } } else { temp${index} += c; } }`;
    }
    return '';
}

function getCppPrinter(type) {
    if (type === 'int') return `cout << res << endl;`;
    if (type === 'bool') return `cout << (res ? "true" : "false") << endl;`;
    if (type === 'string') return `cout << '"' << res << '"' << endl;`;
    if (type === 'vector<int>') return `cout << "["; for(int i=0; i<res.size(); i++) { cout << res[i] << (i==res.size()-1 ? "" : ","); } cout << "]" << endl;`;
    if (type === 'vector<vector<int>>') return `cout << "["; for(int i=0; i<res.size(); i++) { cout << "["; for(int j=0; j<res[i].size(); j++) { cout << res[i][j] << (j==res[i].size()-1 ? "" : ","); } cout << "]" << (i==res.size()-1 ? "" : ","); } cout << "]" << endl;`;
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
    if (type === 'String') return `String arg${index} = scanner.nextLine().trim(); if(arg${index}.startsWith("\\"")) arg${index} = arg${index}.substring(1, arg${index}.length()-1);`;
    if (type === 'int[]') return `String s${index} = scanner.nextLine().trim(); if(s${index}.startsWith("[")) s${index} = s${index}.substring(1, s${index}.length()-1); String[] parts${index} = s${index}.split(","); int[] arg${index} = new int[s${index}.isEmpty() ? 0 : parts${index}.length]; if(!s${index}.isEmpty()) { for(int i=0; i<parts${index}.length; i++) arg${index}[i] = Integer.parseInt(parts${index}[i].trim()); }`;
    if (type === 'int[][]') return `String s${index} = scanner.nextLine().trim(); if(s${index}.startsWith("[")) s${index} = s${index}.substring(1, s${index}.length()-1); List<int[]> list${index} = new ArrayList<>(); int i${index} = 0; while(i${index} < s${index}.length()) { if(s${index}.charAt(i${index}) == '[') { int j = i${index}+1; while(s${index}.charAt(j) != ']') j++; String inner = s${index}.substring(i${index}+1, j); String[] parts = inner.split(","); int[] arr = new int[inner.isEmpty() ? 0 : parts.length]; if(!inner.isEmpty()) { for(int k=0; k<parts.length; k++) arr[k] = Integer.parseInt(parts[k].trim()); } list${index}.add(arr); i${index} = j+1; } else { i${index}++; } } int[][] arg${index} = list${index}.toArray(new int[0][]);`;
    return '';
}

function getJavaPrinter(type) {
    if (type === 'int' || type === 'boolean') return `System.out.println(res);`;
    if (type === 'String') return `System.out.println("\\"" + res + "\\"");`;
    if (type === 'int[]') return `System.out.print("["); for(int i=0; i<res.length; i++) { System.out.print(res[i] + (i==res.length-1 ? "" : ",")); } System.out.println("]");`;
    if (type === 'int[][]') return `System.out.print("["); for(int i=0; i<res.length; i++) { System.out.print("["); for(int j=0; j<res[i].length; j++) { System.out.print(res[i][j] + (j==res[i].length-1 ? "" : ",")); } System.out.print("]" + (i==res.length-1 ? "" : ",")); } System.out.println("]");`;
    return '';
}

function generateJavaDriver(methodName, sig) {
    if(!sig) return '';
    let code = `\nclass Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        Solution sol = new Solution();\n`;
    for (let i = 0; i < sig.args.length; i++) code += `        ${getJavaParser(sig.args[i], i)}\n`;
    const callArgs = sig.args.map((_, i) => `arg${i}`).join(', ');
    code += `        ${sig.ret} res = sol.${methodName}(${callArgs});\n`;
    code += `        ${getJavaPrinter(sig.ret)}\n    }\n}\n`;
    return code;
}

let seedFileStr = fs.readFileSync('backend/seed/leetcodeSeed.js', 'utf8');

// Match everything between `const problems = [` and `];\n\nrequire`
const match = seedFileStr.match(/const problems = (\[[\s\S]*?\]);\n\nrequire/);

if (match) {
    const problemsStr = match[1];
    let problems;
    // We can't eval easily if it's strict JSON, but it's JS literal. 
    // We'll write a temporary file to export it.
    fs.writeFileSync('temp_problems.js', `module.exports = ${problemsStr};`);
    problems = require('./temp_problems.js');
    
    for (const p of problems) {
        if (signatures[p.title]) {
            p.driverCode.cpp = generateCppDriver(p.methodName, signatures[p.title]);
            p.driverCode.java = generateJavaDriver(p.methodName, javaSignatures[p.title]);
        }
    }
    
    // Stringify but it adds quotes to keys. To keep it clean:
    const newProblemsStr = JSON.stringify(problems, null, 2).replace(/"([^"]+)":/g, '$1:');
    
    const newFileStr = seedFileStr.replace(/const problems = \[[\s\S]*?\];\n\nrequire/, `const problems = ${newProblemsStr};\n\nrequire`);
    
    fs.writeFileSync('backend/seed/leetcodeSeed.js', newFileStr);
    console.log("Successfully patched leetcodeSeed.js");
} else {
    console.log("Failed to match problems array");
}
