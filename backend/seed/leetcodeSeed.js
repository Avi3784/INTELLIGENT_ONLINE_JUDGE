const mongoose = require('mongoose');

const Problem = mongoose.models.Problem || mongoose.model('Problem', new mongoose.Schema({}, { strict: false }));

const problems = [

  {
    title: "Find Closest Number to Zero",
    description: `Given an integer array nums of size n, return the number with the value closest to 0 in nums. If there are multiple answers, return the number with the largest value.

Example 1:

Input: nums = [-4,-2,1,4,8]
Output: 1
Explanation:
The distance from -4 to 0 is |-4| = 4.
The distance from -2 to 0 is |-2| = 2.
The distance from 1 to 0 is |1| = 1.
The distance from 4 to 0 is |4| = 4.
The distance from 8 to 0 is |8| = 8.
Thus, the closest number to 0 in the array is 1.

Example 2:

Input: nums = [2,-1,1]
Output: 1
Explanation: 1 and -1 are both the closest numbers to 0, so 1 being larger is returned.

Constraints:

1 <= n <= 1000
-105 <= nums[i] <= 105`,
    difficulty: "EASY",
    tags: ["arrays"],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Keep track of the closest number seen so far.",
      "If you find a number with the same absolute value as the current closest, update it if the new number is larger."
    ],
    methodName: "findClosestNumber",
    defaultCode: {
      python: "class Solution:\n    def findClosestNumber(self, nums):\n        pass",
      javascript: "class Solution {\n  findClosestNumber(nums) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findClosestNumber(vector<int>& nums) {\n        \n    }\n};",
      java: "class Solution {\n    public int findClosestNumber(int[] nums) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    // ... Driver code for vector ... \n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        // ... Driver code for array ...\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Iterate through the array and find the closest to 0. If abs(x) == abs(closest), pick the max.",
      code: {
        python: "class Solution:\n    def findClosestNumber(self, nums):\n        ans = nums[0]\n        for x in nums:\n            if abs(x) < abs(ans):\n                ans = x\n            elif abs(x) == abs(ans) and x > ans:\n                ans = x\n        return ans"
      }
    },
    sampleTestCases: [
      {
        input: "[-4,-2,1,4,8]",
        expectedOutput: "1"
      }
    ],
    hiddenTestCases: [
      {
        input: "[2,-1,1]",
        expectedOutput: "1"
      }
    ]
  },

  {
    title: "Palindrome Number",
    description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
    difficulty: "EASY",
    tags: [
      "math"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Beware of integer overflow when you reverse the integer."
    ],
    methodName: "isPalindrome",
    defaultCode: {
      python: "class Solution:\n    def isPalindrome(self, x):\n        pass",
      javascript: "class Solution {\n  isPalindrome(x) {\n    \n  }\n}",
      cpp: "#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(int x) {\n        \n    }\n};",
      java: "class Solution {\n    public boolean isPalindrome(int x) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    int arg0; cin >> arg0;\n    auto res = sol.isPalindrome(arg0);\n    cout << (res ? \"true\" : \"false\") << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        int arg0 = Integer.parseInt(scanner.nextLine().trim());\n        boolean res = sol.isPalindrome(arg0);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Reverse the number by extracting digits from right to left using modulo 10 and multiplying the reversed number by 10. Finally, check if it matches the original number. Negative numbers are never palindromes.",
      code: {
        python: "class Solution:\n    def isPalindrome(self, x):\n        if x < 0: return False\n        temp = x\n        rev = 0\n        while temp > 0:\n            rev = rev * 10 + temp % 10\n            temp //= 10\n        return rev == x",
        javascript: "class Solution {\n  isPalindrome(x) {\n    if (x < 0) return false;\n    let temp = x;\n    let rev = 0;\n    while (temp > 0) {\n      rev = rev * 10 + temp % 10;\n      temp = Math.floor(temp / 10);\n    }\n    return rev === x;\n  }\n}",
        cpp: "#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(int x) {\n        if (x < 0) return false;\n        long long temp = x;\n        long long rev = 0;\n        while (temp > 0) {\n            rev = rev * 10 + temp % 10;\n            temp /= 10;\n        }\n        return rev == x;\n    }\n};",
        java: "class Solution {\n    public boolean isPalindrome(int x) {\n        if (x < 0) return false;\n        long temp = x;\n        long rev = 0;\n        while (temp > 0) {\n            rev = rev * 10 + temp % 10;\n            temp /= 10;\n        }\n        return rev == x;\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "121",
        expectedOutput: "true"
      }
    ],
    hiddenTestCases: [
      {
        input: "-121",
        expectedOutput: "false"
      },
      {
        input: "10",
        expectedOutput: "false"
      }
    ]
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters \"(\", \")\", \"{\", \"}\", \"[\" and \"]\", determine if the input string is valid.",
    difficulty: "EASY",
    tags: [
      "strings",
      "stack"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Use a stack to keep track of open parentheses."
    ],
    methodName: "isValid",
    defaultCode: {
      python: "class Solution:\n    def isValid(self, s):\n        pass",
      javascript: "class Solution {\n  isValid(s) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};",
      java: "import java.util.*;\n\nclass Solution {\n    public boolean isValid(String s) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    string arg0; string line0; getline(cin >> ws, line0); if(line0.size()>=2 && line0[0]=='\"' && line0.back()=='\"') arg0 = line0.substr(1, line0.size()-2); else arg0 = line0;\n    auto res = sol.isValid(arg0);\n    cout << (res ? \"true\" : \"false\") << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        String arg0 = scanner.nextLine().trim(); if(arg0.startsWith(\"\\\"\")) arg0 = arg0.substring(1, arg0.length()-1);\n        boolean res = sol.isValid(arg0);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Use a stack to keep track of opening brackets. When you see a closing bracket, check if it matches the top of the stack.",
      code: {
        python: "class Solution:\n    def isValid(self, s):\n        stack = []\n        mapping = {\")\": \"(\", \"}\": \"{\", \"]\": \"[\"}\n        for char in s:\n            if char in mapping:\n                top_element = stack.pop() if stack else \"#\"\n                if mapping[char] != top_element:\n                    return False\n            else:\n                stack.append(char)\n        return not stack",
        javascript: "class Solution {\n  isValid(s) {\n    const stack = [];\n    const map = { \")\": \"(\", \"}\": \"{\", \"]\": \"[\" };\n    for (let char of s) {\n      if (map[char]) {\n        const top = stack.length ? stack.pop() : \"#\";\n        if (map[char] !== top) return false;\n      } else {\n        stack.push(char);\n      }\n    }\n    return stack.length === 0;\n  }\n}",
        cpp: "#include <iostream>\n#include <string>\n#include <stack>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        unordered_map<char, char> m = {{ ')', '(' }, { '}', '{' }, { ']', '[' }};\n        for (char c : s) {\n            if (m.count(c)) {\n                if (st.empty() || st.top() != m[c]) return false;\n                st.pop();\n            } else {\n                st.push(c);\n            }\n        }\n        return st.empty();\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public boolean isValid(String s) {\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '{') stack.push('}');\n            else if (c == '[') stack.push(']');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "\"()\"",
        expectedOutput: "true"
      }
    ],
    hiddenTestCases: [
      {
        input: "\"()[]{}\"",
        expectedOutput: "true"
      },
      {
        input: "\"(]\"",
        expectedOutput: "false"
      }
    ]
  },
  {
    title: "Best Time to Buy and Sell Stock",
    description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    difficulty: "EASY",
    tags: [
      "arrays",
      "dynamic programming"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Keep track of the minimum price seen so far."
    ],
    methodName: "maxProfit",
    defaultCode: {
      python: "class Solution:\n    def maxProfit(self, prices):\n        pass",
      javascript: "class Solution {\n  maxProfit(prices) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        \n    }\n};",
      java: "import java.util.*;\n\nclass Solution {\n    public int maxProfit(int[] prices) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    vector<int> arg0; string s0; getline(cin >> ws, s0); string temp0 = \"\"; for(char c : s0) { if(c == '[' || c == ']') continue; if(c == ',') { if(temp0!=\"\") { arg0.push_back(stoi(temp0)); temp0=\"\"; } } else temp0 += c; } if(temp0!=\"\") arg0.push_back(stoi(temp0));\n    auto res = sol.maxProfit(arg0);\n    cout << res << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        String s0 = scanner.nextLine().trim(); if(s0.startsWith(\"[\")) s0 = s0.substring(1, s0.length()-1); String[] parts0 = s0.split(\",\"); int[] arg0 = new int[s0.isEmpty() ? 0 : parts0.length]; if(!s0.isEmpty()) { for(int i=0; i<parts0.length; i++) arg0[i] = Integer.parseInt(parts0[i].trim()); }\n        int res = sol.maxProfit(arg0);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Keep track of the lowest price seen so far and the maximum profit you can get if you sell at the current price.",
      code: {
        python: "class Solution:\n    def maxProfit(self, prices):\n        min_price = float('inf')\n        max_profit = 0\n        for price in prices:\n            if price < min_price:\n                min_price = price\n            elif price - min_price > max_profit:\n                max_profit = price - min_price\n        return max_profit",
        javascript: "class Solution {\n  maxProfit(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (let i = 0; i < prices.length; i++) {\n      if (prices[i] < minPrice) minPrice = prices[i];\n      else if (prices[i] - minPrice > maxProfit) maxProfit = prices[i] - minPrice;\n    }\n    return maxProfit;\n  }\n}",
        cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minPrice = prices[0];\n        int maxProfit = 0;\n        for (int i = 1; i < prices.size(); i++) {\n            maxProfit = max(maxProfit, prices[i] - minPrice);\n            minPrice = min(minPrice, prices[i]);\n        }\n        return maxProfit;\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int maxProfit(int[] prices) {\n        int minPrice = Integer.MAX_VALUE;\n        int maxProfit = 0;\n        for (int price : prices) {\n            if (price < minPrice) minPrice = price;\n            else if (price - minPrice > maxProfit) maxProfit = price - minPrice;\n        }\n        return maxProfit;\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "[7,1,5,3,6,4]",
        expectedOutput: "5"
      }
    ],
    hiddenTestCases: [
      {
        input: "[7,6,4,3,1]",
        expectedOutput: "0"
      }
    ]
  },
  {
    title: "Contains Duplicate",
    description: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    difficulty: "EASY",
    tags: [
      "arrays",
      "hash table"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Use a set to keep track of seen elements."
    ],
    methodName: "containsDuplicate",
    defaultCode: {
      python: "class Solution:\n    def containsDuplicate(self, nums):\n        pass",
      javascript: "class Solution {\n  containsDuplicate(nums) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        \n    }\n};",
      java: "import java.util.*;\n\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    vector<int> arg0; string s0; getline(cin >> ws, s0); string temp0 = \"\"; for(char c : s0) { if(c == '[' || c == ']') continue; if(c == ',') { if(temp0!=\"\") { arg0.push_back(stoi(temp0)); temp0=\"\"; } } else temp0 += c; } if(temp0!=\"\") arg0.push_back(stoi(temp0));\n    auto res = sol.containsDuplicate(arg0);\n    cout << (res ? \"true\" : \"false\") << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        String s0 = scanner.nextLine().trim(); if(s0.startsWith(\"[\")) s0 = s0.substring(1, s0.length()-1); String[] parts0 = s0.split(\",\"); int[] arg0 = new int[s0.isEmpty() ? 0 : parts0.length]; if(!s0.isEmpty()) { for(int i=0; i<parts0.length; i++) arg0[i] = Integer.parseInt(parts0[i].trim()); }\n        boolean res = sol.containsDuplicate(arg0);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Use a hash set to store seen numbers. If a number is already in the set, a duplicate exists.",
      code: {
        python: "class Solution:\n    def containsDuplicate(self, nums):\n        return len(nums) != len(set(nums))",
        javascript: "class Solution {\n  containsDuplicate(nums) {\n    return new Set(nums).size !== nums.length;\n  }\n}",
        cpp: "#include <iostream>\n#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen(nums.begin(), nums.end());\n        return seen.size() != nums.size();\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        Set<Integer> seen = new HashSet<>();\n        for (int num : nums) {\n            if (!seen.add(num)) return true;\n        }\n        return false;\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "[1,2,3,1]",
        expectedOutput: "true"
      }
    ],
    hiddenTestCases: [
      {
        input: "[1,2,3,4]",
        expectedOutput: "false"
      }
    ]
  },
  {
    title: "Product of Array Except Self",
    description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
    difficulty: "MEDIUM",
    tags: [
      "arrays",
      "prefix sum"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Calculate left products and right products."
    ],
    methodName: "productExceptSelf",
    defaultCode: {
      python: "class Solution:\n    def productExceptSelf(self, nums):\n        pass",
      javascript: "class Solution {\n  productExceptSelf(nums) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        \n    }\n};",
      java: "import java.util.*;\n\nclass Solution {\n    public int[] productExceptSelf(int[] nums) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    vector<int> arg0; string s0; getline(cin >> ws, s0); string temp0 = \"\"; for(char c : s0) { if(c == '[' || c == ']') continue; if(c == ',') { if(temp0!=\"\") { arg0.push_back(stoi(temp0)); temp0=\"\"; } } else temp0 += c; } if(temp0!=\"\") arg0.push_back(stoi(temp0));\n    auto res = sol.productExceptSelf(arg0);\n    cout << \"[\"; for(int i=0; i<res.size(); i++) { cout << res[i] << (i==res.size()-1 ? \"\" : \",\"); } cout << \"]\" << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        String s0 = scanner.nextLine().trim(); if(s0.startsWith(\"[\")) s0 = s0.substring(1, s0.length()-1); String[] parts0 = s0.split(\",\"); int[] arg0 = new int[s0.isEmpty() ? 0 : parts0.length]; if(!s0.isEmpty()) { for(int i=0; i<parts0.length; i++) arg0[i] = Integer.parseInt(parts0[i].trim()); }\n        int[] res = sol.productExceptSelf(arg0);\n        System.out.print(\"[\"); for(int i=0; i<res.length; i++) { System.out.print(res[i] + (i==res.length-1 ? \"\" : \",\")); } System.out.println(\"]\");\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Calculate the product of all numbers to the left of each index, then multiply by the product of all numbers to the right of each index.",
      code: {
        python: "class Solution:\n    def productExceptSelf(self, nums):\n        res = [1] * len(nums)\n        prefix = 1\n        for i in range(len(nums)):\n            res[i] = prefix\n            prefix *= nums[i]\n        postfix = 1\n        for i in range(len(nums) - 1, -1, -1):\n            res[i] *= postfix\n            postfix *= nums[i]\n        return res",
        javascript: "class Solution {\n  productExceptSelf(nums) {\n    const res = new Array(nums.length).fill(1);\n    let prefix = 1;\n    for (let i = 0; i < nums.length; i++) {\n      res[i] = prefix;\n      prefix *= nums[i];\n    }\n    let postfix = 1;\n    for (let i = nums.length - 1; i >= 0; i--) {\n      res[i] *= postfix;\n      postfix *= nums[i];\n    }\n    return res;\n  }\n}",
        cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        int n = nums.size();\n        vector<int> res(n, 1);\n        int prefix = 1;\n        for (int i = 0; i < n; i++) {\n            res[i] = prefix;\n            prefix *= nums[i];\n        }\n        int postfix = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            res[i] *= postfix;\n            postfix *= nums[i];\n        }\n        return res;\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] res = new int[n];\n        res[0] = 1;\n        for (int i = 1; i < n; i++) {\n            res[i] = res[i - 1] * nums[i - 1];\n        }\n        int postfix = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            res[i] *= postfix;\n            postfix *= nums[i];\n        }\n        return res;\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "[1,2,3,4]",
        expectedOutput: "[24,12,8,6]"
      }
    ],
    hiddenTestCases: [
      {
        input: "[-1,1,0,-3,3]",
        expectedOutput: "[0,0,9,0,0]"
      }
    ]
  },
  {
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the subarray which has the largest sum and return its sum.",
    difficulty: "MEDIUM",
    tags: [
      "arrays",
      "dynamic programming"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Kadane's algorithm is optimal here."
    ],
    methodName: "maxSubArray",
    defaultCode: {
      python: "class Solution:\n    def maxSubArray(self, nums):\n        pass",
      javascript: "class Solution {\n  maxSubArray(nums) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        \n    }\n};",
      java: "import java.util.*;\n\nclass Solution {\n    public int maxSubArray(int[] nums) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    vector<int> arg0; string s0; getline(cin >> ws, s0); string temp0 = \"\"; for(char c : s0) { if(c == '[' || c == ']') continue; if(c == ',') { if(temp0!=\"\") { arg0.push_back(stoi(temp0)); temp0=\"\"; } } else temp0 += c; } if(temp0!=\"\") arg0.push_back(stoi(temp0));\n    auto res = sol.maxSubArray(arg0);\n    cout << res << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        String s0 = scanner.nextLine().trim(); if(s0.startsWith(\"[\")) s0 = s0.substring(1, s0.length()-1); String[] parts0 = s0.split(\",\"); int[] arg0 = new int[s0.isEmpty() ? 0 : parts0.length]; if(!s0.isEmpty()) { for(int i=0; i<parts0.length; i++) arg0[i] = Integer.parseInt(parts0[i].trim()); }\n        int res = sol.maxSubArray(arg0);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Keep a running sum of the current sequence. If the sum drops below zero, reset it to zero. Track the largest sum seen.",
      code: {
        python: "class Solution:\n    def maxSubArray(self, nums):\n        max_sum = nums[0]\n        current_sum = 0\n        for n in nums:\n            if current_sum < 0:\n                current_sum = 0\n            current_sum += n\n            max_sum = max(max_sum, current_sum)\n        return max_sum",
        javascript: "class Solution {\n  maxSubArray(nums) {\n    let maxSum = nums[0];\n    let currentSum = 0;\n    for (let n of nums) {\n      if (currentSum < 0) currentSum = 0;\n      currentSum += n;\n      maxSum = Math.max(maxSum, currentSum);\n    }\n    return maxSum;\n  }\n}",
        cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int maxSum = nums[0];\n        int currentSum = 0;\n        for (int n : nums) {\n            if (currentSum < 0) currentSum = 0;\n            currentSum += n;\n            maxSum = max(maxSum, currentSum);\n        }\n        return maxSum;\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int maxSubArray(int[] nums) {\n        int maxSum = nums[0];\n        int currentSum = 0;\n        for (int n : nums) {\n            if (currentSum < 0) currentSum = 0;\n            currentSum += n;\n            maxSum = Math.max(maxSum, currentSum);\n        }\n        return maxSum;\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "[-2,1,-3,4,-1,2,1,-5,4]",
        expectedOutput: "6"
      }
    ],
    hiddenTestCases: [
      {
        input: "[1]",
        expectedOutput: "1"
      },
      {
        input: "[5,4,-1,7,8]",
        expectedOutput: "23"
      }
    ]
  },
  {
    title: "Missing Number",
    description: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
    difficulty: "EASY",
    tags: [
      "arrays",
      "math",
      "bit manipulation"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Use the formula for sum of first n numbers."
    ],
    methodName: "missingNumber",
    defaultCode: {
      python: "class Solution:\n    def missingNumber(self, nums):\n        pass",
      javascript: "class Solution {\n  missingNumber(nums) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        \n    }\n};",
      java: "import java.util.*;\n\nclass Solution {\n    public int missingNumber(int[] nums) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    vector<int> arg0; string s0; getline(cin >> ws, s0); string temp0 = \"\"; for(char c : s0) { if(c == '[' || c == ']') continue; if(c == ',') { if(temp0!=\"\") { arg0.push_back(stoi(temp0)); temp0=\"\"; } } else temp0 += c; } if(temp0!=\"\") arg0.push_back(stoi(temp0));\n    auto res = sol.missingNumber(arg0);\n    cout << res << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        String s0 = scanner.nextLine().trim(); if(s0.startsWith(\"[\")) s0 = s0.substring(1, s0.length()-1); String[] parts0 = s0.split(\",\"); int[] arg0 = new int[s0.isEmpty() ? 0 : parts0.length]; if(!s0.isEmpty()) { for(int i=0; i<parts0.length; i++) arg0[i] = Integer.parseInt(parts0[i].trim()); }\n        int res = sol.missingNumber(arg0);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Calculate the expected sum of numbers from 0 to n. The missing number is the expected sum minus the actual sum of the array.",
      code: {
        python: "class Solution:\n    def missingNumber(self, nums):\n        n = len(nums)\n        expected_sum = n * (n + 1) // 2\n        actual_sum = sum(nums)\n        return expected_sum - actual_sum",
        javascript: "class Solution {\n  missingNumber(nums) {\n    const n = nums.length;\n    const expectedSum = (n * (n + 1)) / 2;\n    const actualSum = nums.reduce((a, b) => a + b, 0);\n    return expectedSum - actualSum;\n  }\n}",
        cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int missingNumber(vector<int>& nums) {\n        int n = nums.size();\n        int expectedSum = n * (n + 1) / 2;\n        int actualSum = 0;\n        for (int num : nums) actualSum += num;\n        return expectedSum - actualSum;\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int missingNumber(int[] nums) {\n        int n = nums.length;\n        int expectedSum = n * (n + 1) / 2;\n        int actualSum = 0;\n        for (int num : nums) actualSum += num;\n        return expectedSum - actualSum;\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "[3,0,1]",
        expectedOutput: "2"
      }
    ],
    hiddenTestCases: [
      {
        input: "[0,1]",
        expectedOutput: "2"
      },
      {
        input: "[9,6,4,2,3,5,7,0,1]",
        expectedOutput: "8"
      }
    ]
  },
  {
    title: "Valid Anagram",
    description: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    difficulty: "EASY",
    tags: [
      "strings",
      "hash table",
      "sorting"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Count the frequency of each character."
    ],
    methodName: "isAnagram",
    defaultCode: {
      python: "class Solution:\n    def isAnagram(self, s, t):\n        pass",
      javascript: "class Solution {\n  isAnagram(s, t) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        \n    }\n};",
      java: "import java.util.*;\n\nclass Solution {\n    public boolean isAnagram(String s, String t) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    string arg0; string line0; getline(cin >> ws, line0); if(line0.size()>=2 && line0[0]=='\"' && line0.back()=='\"') arg0 = line0.substr(1, line0.size()-2); else arg0 = line0;\n    string arg1; string line1; getline(cin >> ws, line1); if(line1.size()>=2 && line1[0]=='\"' && line1.back()=='\"') arg1 = line1.substr(1, line1.size()-2); else arg1 = line1;\n    auto res = sol.isAnagram(arg0, arg1);\n    cout << (res ? \"true\" : \"false\") << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        String arg0 = scanner.nextLine().trim(); if(arg0.startsWith(\"\\\"\")) arg0 = arg0.substring(1, arg0.length()-1);\n        String arg1 = scanner.nextLine().trim(); if(arg1.startsWith(\"\\\"\")) arg1 = arg1.substring(1, arg1.length()-1);\n        boolean res = sol.isAnagram(arg0, arg1);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Count how many times each character appears in both strings. If the counts match exactly, they are anagrams.",
      code: {
        python: "class Solution:\n    def isAnagram(self, s, t):\n        if len(s) != len(t): return False\n        counts = {}\n        for char in s:\n            counts[char] = counts.get(char, 0) + 1\n        for char in t:\n            if counts.get(char, 0) == 0: return False\n            counts[char] -= 1\n        return True",
        javascript: "class Solution {\n  isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const counts = {};\n    for (let char of s) {\n      counts[char] = (counts[char] || 0) + 1;\n    }\n    for (let char of t) {\n      if (!counts[char]) return false;\n      counts[char]--;\n    }\n    return true;\n  }\n}",
        cpp: "#include <iostream>\n#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if (s.length() != t.length()) return false;\n        vector<int> counts(26, 0);\n        for (int i = 0; i < s.length(); i++) {\n            counts[s[i] - 'a']++;\n            counts[t[i] - 'a']--;\n        }\n        for (int count : counts) {\n            if (count != 0) return false;\n        }\n        return true;\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] counts = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            counts[s.charAt(i) - 'a']++;\n            counts[t.charAt(i) - 'a']--;\n        }\n        for (int count : counts) {\n            if (count != 0) return false;\n        }\n        return true;\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: `"anagram"\n"nagaram"`,
        expectedOutput: "true"
      }
    ],
    hiddenTestCases: [
      {
        input: `"rat"\n"car"`,
        expectedOutput: "false"
      }
    ]
  },
  {
    title: "Container With Most Water",
    description: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    difficulty: "MEDIUM",
    tags: [
      "arrays",
      "two pointers"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Use two pointers, starting from both ends, moving the pointer at the shorter line inward."
    ],
    methodName: "maxArea",
    defaultCode: {
      python: "class Solution:\n    def maxArea(self, height):\n        pass",
      javascript: "class Solution {\n  maxArea(height) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};",
      java: "import java.util.*;\n\nclass Solution {\n    public int maxArea(int[] height) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    vector<int> arg0; string s0; getline(cin >> ws, s0); string temp0 = \"\"; for(char c : s0) { if(c == '[' || c == ']') continue; if(c == ',') { if(temp0!=\"\") { arg0.push_back(stoi(temp0)); temp0=\"\"; } } else temp0 += c; } if(temp0!=\"\") arg0.push_back(stoi(temp0));\n    auto res = sol.maxArea(arg0);\n    cout << res << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        String s0 = scanner.nextLine().trim(); if(s0.startsWith(\"[\")) s0 = s0.substring(1, s0.length()-1); String[] parts0 = s0.split(\",\"); int[] arg0 = new int[s0.isEmpty() ? 0 : parts0.length]; if(!s0.isEmpty()) { for(int i=0; i<parts0.length; i++) arg0[i] = Integer.parseInt(parts0[i].trim()); }\n        int res = sol.maxArea(arg0);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Use two pointers starting at both ends. Calculate the area, then move the pointer that points to the shorter line inward to find a potentially taller line.",
      code: {
        python: "class Solution:\n    def maxArea(self, height):\n        left, right = 0, len(height) - 1\n        max_area = 0\n        while left < right:\n            area = (right - left) * min(height[left], height[right])\n            max_area = max(max_area, area)\n            if height[left] < height[right]:\n                left += 1\n            else:\n                right -= 1\n        return max_area",
        javascript: "class Solution {\n  maxArea(height) {\n    let left = 0, right = height.length - 1;\n    let maxArea = 0;\n    while (left < right) {\n      const area = (right - left) * Math.min(height[left], height[right]);\n      maxArea = Math.max(maxArea, area);\n      if (height[left] < height[right]) left++;\n      else right--;\n    }\n    return maxArea;\n  }\n}",
        cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int left = 0, right = height.size() - 1;\n        int maxArea = 0;\n        while (left < right) {\n            int currentArea = (right - left) * min(height[left], height[right]);\n            maxArea = max(maxArea, currentArea);\n            if (height[left] < height[right]) left++;\n            else right--;\n        }\n        return maxArea;\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int maxArea(int[] height) {\n        int left = 0, right = height.length - 1;\n        int maxArea = 0;\n        while (left < right) {\n            int currentArea = (right - left) * Math.min(height[left], height[right]);\n            maxArea = Math.max(maxArea, currentArea);\n            if (height[left] < height[right]) left++;\n            else right--;\n        }\n        return maxArea;\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "[1,8,6,2,5,4,8,3,7]",
        expectedOutput: "49"
      }
    ],
    hiddenTestCases: [
      {
        input: "[1,1]",
        expectedOutput: "1"
      }
    ]
  },
  {
    title: "Find Minimum in Rotated Sorted Array",
    description: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array.",
    difficulty: "MEDIUM",
    tags: [
      "arrays",
      "binary search"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Use binary search to find the inflection point."
    ],
    methodName: "findMin",
    defaultCode: {
      python: "class Solution:\n    def findMin(self, nums):\n        pass",
      javascript: "class Solution {\n  findMin(nums) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        \n    }\n};",
      java: "import java.util.*;\n\nclass Solution {\n    public int findMin(int[] nums) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    vector<int> arg0; string s0; getline(cin >> ws, s0); string temp0 = \"\"; for(char c : s0) { if(c == '[' || c == ']') continue; if(c == ',') { if(temp0!=\"\") { arg0.push_back(stoi(temp0)); temp0=\"\"; } } else temp0 += c; } if(temp0!=\"\") arg0.push_back(stoi(temp0));\n    auto res = sol.findMin(arg0);\n    cout << res << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        String s0 = scanner.nextLine().trim(); if(s0.startsWith(\"[\")) s0 = s0.substring(1, s0.length()-1); String[] parts0 = s0.split(\",\"); int[] arg0 = new int[s0.isEmpty() ? 0 : parts0.length]; if(!s0.isEmpty()) { for(int i=0; i<parts0.length; i++) arg0[i] = Integer.parseInt(parts0[i].trim()); }\n        int res = sol.findMin(arg0);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Use binary search. If the middle element is greater than the rightmost element, the minimum is to the right. Otherwise, it is to the left or is the middle element.",
      code: {
        python: "class Solution:\n    def findMin(self, nums):\n        left, right = 0, len(nums) - 1\n        while left < right:\n            mid = (left + right) // 2\n            if nums[mid] > nums[right]:\n                left = mid + 1\n            else:\n                right = mid\n        return nums[left]",
        javascript: "class Solution {\n  findMin(nums) {\n    let left = 0, right = nums.length - 1;\n    while (left < right) {\n      const mid = Math.floor((left + right) / 2);\n      if (nums[mid] > nums[right]) left = mid + 1;\n      else right = mid;\n    }\n    return nums[left];\n  }\n}",
        cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        int left = 0, right = nums.size() - 1;\n        while (left < right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] > nums[right]) left = mid + 1;\n            else right = mid;\n        }\n        return nums[left];\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int findMin(int[] nums) {\n        int left = 0, right = nums.length - 1;\n        while (left < right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] > nums[right]) left = mid + 1;\n            else right = mid;\n        }\n        return nums[left];\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "[3,4,5,1,2]",
        expectedOutput: "1"
      }
    ],
    hiddenTestCases: [
      {
        input: "[4,5,6,7,0,1,2]",
        expectedOutput: "0"
      },
      {
        input: "[11,13,15,17]",
        expectedOutput: "11"
      }
    ]
  },
  {
    title: "Search in Rotated Sorted Array",
    description: "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index. Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
    difficulty: "MEDIUM",
    tags: [
      "arrays",
      "binary search"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Find the sorted half and binary search within."
    ],
    methodName: "search",
    defaultCode: {
      python: "class Solution:\n    def search(self, nums, target):\n        pass",
      javascript: "class Solution {\n  search(nums, target) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};",
      java: "import java.util.*;\n\nclass Solution {\n    public int search(int[] nums, int target) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    vector<int> arg0; string s0; getline(cin >> ws, s0); string temp0 = \"\"; for(char c : s0) { if(c == '[' || c == ']') continue; if(c == ',') { if(temp0!=\"\") { arg0.push_back(stoi(temp0)); temp0=\"\"; } } else temp0 += c; } if(temp0!=\"\") arg0.push_back(stoi(temp0));\n    int arg1; cin >> arg1;\n    auto res = sol.search(arg0, arg1);\n    cout << res << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        String s0 = scanner.nextLine().trim(); if(s0.startsWith(\"[\")) s0 = s0.substring(1, s0.length()-1); String[] parts0 = s0.split(\",\"); int[] arg0 = new int[s0.isEmpty() ? 0 : parts0.length]; if(!s0.isEmpty()) { for(int i=0; i<parts0.length; i++) arg0[i] = Integer.parseInt(parts0[i].trim()); }\n        int arg1 = Integer.parseInt(scanner.nextLine().trim());\n        int res = sol.search(arg0, arg1);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Use binary search. Check which half of the array is normally sorted, then see if the target falls within that sorted half to decide which way to narrow the search.",
      code: {
        python: "class Solution:\n    def search(self, nums, target):\n        left, right = 0, len(nums) - 1\n        while left <= right:\n            mid = (left + right) // 2\n            if nums[mid] == target: return mid\n            if nums[left] <= nums[mid]:\n                if nums[left] <= target < nums[mid]:\n                    right = mid - 1\n                else:\n                    left = mid + 1\n            else:\n                if nums[mid] < target <= nums[right]:\n                    left = mid + 1\n                else:\n                    right = mid - 1\n        return -1",
        javascript: "class Solution {\n  search(nums, target) {\n    let left = 0, right = nums.length - 1;\n    while (left <= right) {\n      const mid = Math.floor((left + right) / 2);\n      if (nums[mid] === target) return mid;\n      if (nums[left] <= nums[mid]) {\n        if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n        else left = mid + 1;\n      } else {\n        if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n        else right = mid - 1;\n      }\n    }\n    return -1;\n  }\n}",
        cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int left = 0, right = nums.size() - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[left] <= nums[mid]) {\n                if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n                else left = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n                else right = mid - 1;\n            }\n        }\n        return -1;\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int search(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[left] <= nums[mid]) {\n                if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n                else left = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n                else right = mid - 1;\n            }\n        }\n        return -1;\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: `[4,5,6,7,0,1,2]\n0`,
        expectedOutput: "4"
      }
    ],
    hiddenTestCases: [
      {
        input: `[4,5,6,7,0,1,2]\n3`,
        expectedOutput: "-1"
      },
      {
        input: `[1]\n0`,
        expectedOutput: "-1"
      }
    ]
  },
  {
    title: "Climbing Stairs",
    description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "EASY",
    tags: [
      "dynamic programming",
      "math"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "To reach step n, you can arrive from step n-1 or n-2."
    ],
    methodName: "climbStairs",
    defaultCode: {
      python: "class Solution:\n    def climbStairs(self, n):\n        pass",
      javascript: "class Solution {\n  climbStairs(n) {\n    \n  }\n}",
      cpp: "#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    int climbStairs(int n) {\n        \n    }\n};",
      java: "class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    int arg0; cin >> arg0;\n    auto res = sol.climbStairs(arg0);\n    cout << res << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        int arg0 = Integer.parseInt(scanner.nextLine().trim());\n        int res = sol.climbStairs(arg0);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "The number of ways to reach any step is the sum of the ways to reach the two previous steps. Keep track of the last two totals to calculate the next one.",
      code: {
        python: "class Solution:\n    def climbStairs(self, n):\n        one, two = 1, 1\n        for i in range(n - 1):\n            temp = one\n            one = one + two\n            two = temp\n        return one",
        javascript: "class Solution {\n  climbStairs(n) {\n    let one = 1, two = 1;\n    for (let i = 0; i < n - 1; i++) {\n      let temp = one;\n      one = one + two;\n      two = temp;\n    }\n    return one;\n  }\n}",
        cpp: "#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    int climbStairs(int n) {\n        int one = 1, two = 1;\n        for (int i = 0; i < n - 1; i++) {\n            int temp = one;\n            one = one + two;\n            two = temp;\n        }\n        return one;\n    }\n};",
        java: "class Solution {\n    public int climbStairs(int n) {\n        int one = 1, two = 1;\n        for (int i = 0; i < n - 1; i++) {\n            int temp = one;\n            one = one + two;\n            two = temp;\n        }\n        return one;\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "2",
        expectedOutput: "2"
      }
    ],
    hiddenTestCases: [
      {
        input: "3",
        expectedOutput: "3"
      },
      {
        input: "4",
        expectedOutput: "5"
      }
    ]
  },
  {
    title: "Merge Intervals",
    description: "Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    difficulty: "MEDIUM",
    tags: [
      "arrays",
      "sorting"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Sort the intervals by their start time."
    ],
    methodName: "merge",
    defaultCode: {
      python: "class Solution:\n    def merge(self, intervals):\n        pass",
      javascript: "class Solution {\n  merge(intervals) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};",
      java: "import java.util.*;\n\nclass Solution {\n    public int[][] merge(int[][] intervals) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    vector<vector<int>> arg0; string s0; getline(cin >> ws, s0); vector<int> curr0; string temp0 = \"\"; bool in_array0 = false; for(int i = 1; i < s0.size()-1; i++) { char c = s0[i]; if (c == '[') { in_array0 = true; } else if (c == ']') { if(temp0!=\"\") { curr0.push_back(stoi(temp0)); temp0=\"\"; } arg0.push_back(curr0); curr0.clear(); in_array0 = false; } else if (c == ',') { if(in_array0 && temp0!=\"\") { curr0.push_back(stoi(temp0)); temp0=\"\"; } } else { temp0 += c; } }\n    auto res = sol.merge(arg0);\n    cout << \"[\"; for(int i=0; i<res.size(); i++) { cout << \"[\"; for(int j=0; j<res[i].size(); j++) { cout << res[i][j] << (j==res[i].size()-1 ? \"\" : \",\"); } cout << \"]\" << (i==res.size()-1 ? \"\" : \",\"); } cout << \"]\" << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        String s0 = scanner.nextLine().trim(); if(s0.startsWith(\"[\")) s0 = s0.substring(1, s0.length()-1); java.util.List<int[]> list0 = new java.util.ArrayList<>(); int i0 = 0; while(i0 < s0.length()) { if(s0.charAt(i0) == '[') { int j = i0+1; while(s0.charAt(j) != ']') j++; String inner = s0.substring(i0+1, j); String[] parts = inner.split(\",\"); int[] arr = new int[inner.isEmpty() ? 0 : parts.length]; if(!inner.isEmpty()) { for(int k=0; k<parts.length; k++) arr[k] = Integer.parseInt(parts[k].trim()); } list0.add(arr); i0 = j+1; } else { i0++; } } int[][] arg0 = list0.toArray(new int[0][]);\n        int[][] res = sol.merge(arg0);\n        System.out.print(\"[\"); for(int i=0; i<res.length; i++) { System.out.print(\"[\"); for(int j=0; j<res[i].length; j++) { System.out.print(res[i][j] + (j==res[i].length-1 ? \"\" : \",\")); } System.out.print(\"]\" + (i==res.length-1 ? \"\" : \",\")); } System.out.println(\"]\");\n    }\n}\n"
    },
    officialSolution: {
      explanation: "First, sort the intervals based on their start values. Then, go through them one by one and combine overlapping intervals by extending the end time.",
      code: {
        python: "class Solution:\n    def merge(self, intervals):\n        intervals.sort(key=lambda i: i[0])\n        output = [intervals[0]]\n        for start, end in intervals[1:]:\n            last_end = output[-1][1]\n            if start <= last_end:\n                output[-1][1] = max(last_end, end)\n            else:\n                output.append([start, end])\n        return output",
        javascript: "class Solution {\n  merge(intervals) {\n    intervals.sort((a, b) => a[0] - b[0]);\n    const output = [intervals[0]];\n    for (let i = 1; i < intervals.length; i++) {\n      const lastEnd = output[output.length - 1][1];\n      if (intervals[i][0] <= lastEnd) {\n        output[output.length - 1][1] = Math.max(lastEnd, intervals[i][1]);\n      } else {\n        output.push(intervals[i]);\n      }\n    }\n    return output;\n  }\n}",
        cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> output;\n        output.push_back(intervals[0]);\n        for (int i = 1; i < intervals.size(); i++) {\n            if (intervals[i][0] <= output.back()[1]) {\n                output.back()[1] = max(output.back()[1], intervals[i][1]);\n            } else {\n                output.push_back(intervals[i]);\n            }\n        }\n        return output;\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> output = new ArrayList<>();\n        output.add(intervals[0]);\n        for (int i = 1; i < intervals.length; i++) {\n            int[] last = output.get(output.size() - 1);\n            if (intervals[i][0] <= last[1]) {\n                last[1] = Math.max(last[1], intervals[i][1]);\n            } else {\n                output.add(intervals[i]);\n            }\n        }\n        return output.toArray(new int[output.size()][]);\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "[[1,3],[2,6],[8,10],[15,18]]",
        expectedOutput: "[[1,6],[8,10],[15,18]]"
      }
    ],
    hiddenTestCases: [
      {
        input: "[[1,4],[4,5]]",
        expectedOutput: "[[1,5]]"
      }
    ]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "MEDIUM",
    tags: [
      "strings",
      "hash table",
      "sliding window"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Use a sliding window with a hash set."
    ],
    methodName: "lengthOfLongestSubstring",
    defaultCode: {
      python: "class Solution:\n    def lengthOfLongestSubstring(self, s):\n        pass",
      javascript: "class Solution {\n  lengthOfLongestSubstring(s) {\n    \n  }\n}",
      cpp: "#include <iostream>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};",
      java: "import java.util.*;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    string arg0; string line0; getline(cin >> ws, line0); if(line0.size()>=2 && line0[0]=='\"' && line0.back()=='\"') arg0 = line0.substr(1, line0.size()-2); else arg0 = line0;\n    auto res = sol.lengthOfLongestSubstring(arg0);\n    cout << res << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        String arg0 = scanner.nextLine().trim(); if(arg0.startsWith(\"\\\"\")) arg0 = arg0.substring(1, arg0.length()-1);\n        int res = sol.lengthOfLongestSubstring(arg0);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Use a sliding window. Expand the right side to add characters to a set. If a duplicate is found, shrink the left side until the duplicate is removed.",
      code: {
        python: "class Solution:\n    def lengthOfLongestSubstring(self, s):\n        char_set = set()\n        left = 0\n        res = 0\n        for right in range(len(s)):\n            while s[right] in char_set:\n                char_set.remove(s[left])\n                left += 1\n            char_set.add(s[right])\n            res = max(res, right - left + 1)\n        return res",
        javascript: "class Solution {\n  lengthOfLongestSubstring(s) {\n    const charSet = new Set();\n    let left = 0;\n    let res = 0;\n    for (let right = 0; right < s.length; right++) {\n      while (charSet.has(s[right])) {\n        charSet.delete(s[left]);\n        left++;\n      }\n      charSet.add(s[right]);\n      res = Math.max(res, right - left + 1);\n    }\n    return res;\n  }\n}",
        cpp: "#include <iostream>\n#include <string>\n#include <unordered_set>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_set<char> charSet;\n        int left = 0, res = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (charSet.count(s[right])) {\n                charSet.erase(s[left]);\n                left++;\n            }\n            charSet.insert(s[right]);\n            res = max(res, right - left + 1);\n        }\n        return res;\n    }\n};",
        java: "import java.util.*;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Set<Character> charSet = new HashSet<>();\n        int left = 0, res = 0;\n        for (int right = 0; right < s.length(); right++) {\n            while (charSet.contains(s.charAt(right))) {\n                charSet.remove(s.charAt(left));\n                left++;\n            }\n            charSet.add(s.charAt(right));\n            res = Math.max(res, right - left + 1);\n        }\n        return res;\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "\"abcabcbb\"",
        expectedOutput: "3"
      }
    ],
    hiddenTestCases: [
      {
        input: "\"bbbbb\"",
        expectedOutput: "1"
      },
      {
        input: "\"pwwkew\"",
        expectedOutput: "3"
      }
    ]
  },
  {
    title: "Fibonacci Number",
    description: "The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
    difficulty: "EASY",
    tags: [
      "math",
      "dynamic programming"
    ],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Use memoization or bottom-up dynamic programming."
    ],
    methodName: "fib",
    defaultCode: {
      python: "class Solution:\n    def fib(self, n):\n        pass",
      javascript: "class Solution {\n  fib(n) {\n    \n  }\n}",
      cpp: "#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    int fib(int n) {\n        \n    }\n};",
      java: "class Solution {\n    public int fib(int n) {\n        \n    }\n}"
    },
    driverCode: {
      cpp: "\nint main() {\n    Solution sol;\n    int arg0; cin >> arg0;\n    auto res = sol.fib(arg0);\n    cout << res << endl;\n    return 0;\n}\n",
      java: "\nclass Main {\n    public static void main(String[] args) {\n        java.util.Scanner scanner = new java.util.Scanner(System.in);\n        Solution sol = new Solution();\n        int arg0 = Integer.parseInt(scanner.nextLine().trim());\n        int res = sol.fib(arg0);\n        System.out.println(res);\n    }\n}\n"
    },
    officialSolution: {
      explanation: "Keep track of the two previous values and repeatedly add them together to calculate the next Fibonacci number in the sequence.",
      code: {
        python: "class Solution:\n    def fib(self, n):\n        if n <= 1: return n\n        a, b = 0, 1\n        for _ in range(2, n + 1):\n            a, b = b, a + b\n        return b",
        javascript: "class Solution {\n  fib(n) {\n    if (n <= 1) return n;\n    let a = 0, b = 1;\n    for (let i = 2; i <= n; i++) {\n      let next = a + b;\n      a = b;\n      b = next;\n    }\n    return b;\n  }\n}",
        cpp: "#include <iostream>\nusing namespace std;\n\nclass Solution {\npublic:\n    int fib(int n) {\n        if (n <= 1) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int next = a + b;\n            a = b;\n            b = next;\n        }\n        return b;\n    }\n};",
        java: "class Solution {\n    public int fib(int n) {\n        if (n <= 1) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int next = a + b;\n            a = b;\n            b = next;\n        }\n        return b;\n    }\n}"
      }
    },
    sampleTestCases: [
      {
        input: "2",
        expectedOutput: "1"
      }
    ],
    hiddenTestCases: [
      {
        input: "3",
        expectedOutput: "2"
      },
      {
        input: "4",
        expectedOutput: "3"
      }
    ]
  }
];

require('dotenv').config({ path: '../.env' }); // Load .env from parent directory

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await Problem.deleteMany({});
    console.log('Cleared existing problems');
    await Problem.insertMany(problems);
    console.log('Inserted 15 new problems successfully');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Connection error', err);
  });
