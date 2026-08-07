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

function getCppParser(type, index) {
    if (type === 'int') {
        return `int arg${index}; cin >> arg${index};`;
    }
    if (type === 'string') {
        return `string arg${index};\n    string line; getline(cin >> ws, line);\n    // Remove quotes\n    if(line.size()>=2 && line[0]=='"' && line.back()=='"') arg${index} = line.substr(1, line.size()-2);\n    else arg${index} = line;`;
    }
    if (type === 'vector<int>') {
        return `vector<int> arg${index};
    string s${index}; getline(cin >> ws, s${index});
    string temp${index} = "";
    for(char c : s${index}) {
        if(c == '[' || c == ']') continue;
        if(c == ',') { if(temp${index}!="") { arg${index}.push_back(stoi(temp${index})); temp${index}=""; } }
        else temp${index} += c;
    }
    if(temp${index}!="") arg${index}.push_back(stoi(temp${index}));`;
    }
    if (type === 'vector<vector<int>>') {
        return `vector<vector<int>> arg${index};
    string s${index}; getline(cin >> ws, s${index});
    // Simplified parser for [[1,3],[2,6]]
    vector<int> curr${index};
    string temp${index} = "";
    bool in_array = false;
    for(int i = 1; i < s${index}.size()-1; i++) {
        char c = s${index}[i];
        if (c == '[') { in_array = true; }
        else if (c == ']') {
            if(temp${index}!="") { curr${index}.push_back(stoi(temp${index})); temp${index}=""; }
            arg${index}.push_back(curr${index});
            curr${index}.clear();
            in_array = false;
        }
        else if (c == ',') {
            if(in_array && temp${index}!="") { curr${index}.push_back(stoi(temp${index})); temp${index}=""; }
        } else { temp${index} += c; }
    }`;
    }
    return '';
}

function getCppPrinter(type) {
    if (type === 'int' || type === 'bool') {
        return `if (typeid(res) == typeid(bool)) cout << (res ? "true" : "false") << endl; else cout << res << endl;`;
    }
    if (type === 'string') {
        return `cout << '"' << res << '"' << endl;`;
    }
    if (type === 'vector<int>') {
        return `cout << "[";
    for(int i=0; i<res.size(); i++) {
        cout << res[i] << (i==res.size()-1 ? "" : ",");
    }
    cout << "]" << endl;`;
    }
    if (type === 'vector<vector<int>>') {
        return `cout << "[";
    for(int i=0; i<res.size(); i++) {
        cout << "[";
        for(int j=0; j<res[i].size(); j++) {
            cout << res[i][j] << (j==res[i].size()-1 ? "" : ",");
        }
        cout << "]" << (i==res.size()-1 ? "" : ",");
    }
    cout << "]" << endl;`;
    }
}

function generateCppDriver(methodName, sig) {
    let code = `\nint main() {\n    Solution sol;\n`;
    for (let i = 0; i < sig.args.length; i++) {
        code += `    ${getCppParser(sig.args[i], i)}\n`;
    }
    const callArgs = sig.args.map((_, i) => `arg${i}`).join(', ');
    code += `    auto res = sol.${methodName}(${callArgs});\n`;
    code += `    ${getCppPrinter(sig.ret)}\n`;
    code += `    return 0;\n}\n`;
    return code;
}

// Just output to a file for now to check
const data = JSON.stringify(Object.keys(signatures).map(k => ({ title: k, driver: generateCppDriver('method', signatures[k]) })), null, 2);
fs.writeFileSync('drivers.json', data);
console.log("Done");
