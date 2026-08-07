const { executeCode } = require('./backend/services/executor');

async function testExecutor() {
  const testCases = [
    { input: '121', expectedOutput: 'true' }
  ];
  
  try {
    const cppCode = `#include <iostream>
using namespace std;

class Solution {
public:
    bool isPalindrome(int x) {
        if (x < 0) return false;
        long long temp = x;
        long long rev = 0;
        while (temp > 0) {
            rev = rev * 10 + temp % 10;
            temp /= 10;
        }
        return rev == x;
    }
};`;

    const cppDriverCode = {
        cpp: `
int main() {
    Solution sol;
    int arg0; cin >> arg0;
    auto res = sol.isPalindrome(arg0);
    cout << (res ? "true" : "false") << endl;
    return 0;
}
`
    };

    console.log("Running C++ code...");
    const cppRes = await executeCode(cppCode, 'cpp', testCases, 2000, 'isPalindrome', cppDriverCode);
    console.log("C++ Result:", JSON.stringify(cppRes, null, 2));

    const javaCode = `class Solution {
    public boolean isPalindrome(int x) {
        if (x < 0) return false;
        long temp = x;
        long rev = 0;
        while (temp > 0) {
            rev = rev * 10 + temp % 10;
            temp /= 10;
        }
        return rev == x;
    }
}`;

    const javaDriverCode = {
        java: `class Main {
    public static void main(String[] args) {
        java.util.Scanner scanner = new java.util.Scanner(System.in);
        Solution sol = new Solution();
        int arg0 = Integer.parseInt(scanner.nextLine().trim());
        boolean res = sol.isPalindrome(arg0);
        System.out.println(res);
    }
}`
    };

    console.log("\nRunning Java code...");
    const javaRes = await executeCode(javaCode, 'java', testCases, 2000, 'isPalindrome', javaDriverCode);
    console.log("Java Result:", JSON.stringify(javaRes, null, 2));

  } catch (err) {
    console.error("Error testing:", err);
  }
}

testExecutor();
