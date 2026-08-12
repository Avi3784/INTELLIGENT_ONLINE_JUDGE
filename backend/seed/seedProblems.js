const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from the backend root (one level up from /seed)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Problem = require('../models/Problem');

const problems = [

  {
    title: 'Find Closest Number to Zero',
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
    difficulty: 'EASY',
    tags: ['arrays'],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Keep track of the closest number seen so far.",
      "If you find a number with the same absolute value as the current closest, update it if the new number is larger."
    ],
    sampleTestCases: [
      { input: '[-4,-2,1,4,8]', expectedOutput: '1' }
    ],
    hiddenTestCases: [
      { input: '[2,-1,1]', expectedOutput: '1' }
    ],
  },

  {
    title: 'Reverse String',
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array **in-place** with O(1) extra memory.

Example 1:

Input:  s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]

Constraints:
- 1 ≤ s.length ≤ 10⁵
- \`s[i]\` is a printable ASCII character.`,
    difficulty: 'EASY',
    tags: ['strings', 'two-pointers'],
    timeLimit: 1000,
    memoryLimit: 128,
    hints: [
      "The entire logic for reversing a string is based on using the opposite directional two-pointer approach!",
      "Have two pointers, one at the start of the string, and one at the end.",
      "Swap the elements at the pointers and move them towards the center."
    ],
    sampleTestCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]' },
    ],
    hiddenTestCases: [
      { input: '["a"]', expectedOutput: '["a"]' },
      { input: '["A","B"]', expectedOutput: '["B","A"]' },
      { input: '["a","b","c","d","e","f","g"]', expectedOutput: '["g","f","e","d","c","b","a"]' },
    ],
  },

  {
    title: 'FizzBuzz',
    description: `Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:

- \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 **and** 5.
- \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
- \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
- \`answer[i] == i\` (as a string) if none of the above conditions are true.

Example 1:

Input:  n = 15
Output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]

Constraints:
- 1 ≤ n ≤ 10⁴`,
    difficulty: 'EASY',
    tags: ['math', 'simulation'],
    timeLimit: 1000,
    memoryLimit: 128,
    hints: [
      "Try to write conditions for the most specific case first.",
      "Use the modulo operator `%` to check for divisibility.",
      "If a number is divisible by 15, it is divisible by both 3 and 5."
    ],
    sampleTestCases: [
      { input: '3', expectedOutput: '["1","2","Fizz"]' },
      { input: '5', expectedOutput: '["1","2","Fizz","4","Buzz"]' },
    ],
    hiddenTestCases: [
      { input: '1', expectedOutput: '["1"]' },
      { input: '15', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
      { input: '30', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz","16","17","Fizz","19","Buzz","Fizz","22","23","Fizz","Buzz","26","Fizz","28","29","FizzBuzz"]' },
    ],
  },

  {
    title: 'Palindrome Check',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.

Example 1:

Input:  s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.

Constraints:
- 1 ≤ s.length ≤ 2 × 10⁵
- \`s\` consists only of printable ASCII characters.`,
    difficulty: 'EASY',
    tags: ['strings', 'two-pointers'],
    timeLimit: 1000,
    memoryLimit: 128,
    hints: [
      "It helps to clean up the string first by removing non-alphanumeric characters and converting it to lowercase.",
      "You can use two pointers, one starting from the left and one from the right, to check if characters match.",
      "Alternatively, you can reverse the cleaned string and check if it equals the original cleaned string."
    ],
    sampleTestCases: [
      { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true' },
      { input: 'race a car', expectedOutput: 'false' },
    ],
    hiddenTestCases: [
      { input: ' ', expectedOutput: 'true' },
      { input: 'a', expectedOutput: 'true' },
      { input: 'ab', expectedOutput: 'false' },
      { input: '0P', expectedOutput: 'false' },
      { input: 'Was it a car or a cat I saw?', expectedOutput: 'true' },
    ],
  },

  {
    title: 'Maximum Subarray Sum',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its **sum**.

A **subarray** is a contiguous non-empty sequence of elements within an array.

Example 1:

Input:  nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum = 6.

Constraints:
- 1 ≤ nums.length ≤ 10⁵
- -10⁴ ≤ nums[i] ≤ 10⁴

Follow-up:
If you have figured out the O(n) solution (Kadane's algorithm), try coding it with the divide-and-conquer approach, which is more subtle.`,
    difficulty: 'MEDIUM',
    tags: ['arrays', 'dynamic-programming', 'divide-and-conquer'],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Think about Kadane's Algorithm.",
      "You only need to keep track of the current subarray sum and the maximum subarray sum seen so far.",
      "If the current subarray sum becomes negative, it's better to start a new subarray from the next element."
    ],
    sampleTestCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
    ],
    hiddenTestCases: [
      { input: '[5,4,-1,7,8]', expectedOutput: '23' },
      { input: '[-1]', expectedOutput: '-1' },
      { input: '[-2,-1]', expectedOutput: '-1' },
      { input: '[1,2,3,4,5]', expectedOutput: '15' },
      { input: '[-1,0,-2]', expectedOutput: '0' },
    ],
  },
  
  {
    title: 'Valid Parentheses',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:

Input: s = "()[]{}"
Output: true

Constraints:
- 1 ≤ s.length ≤ 10⁴
- \`s\` consists of parentheses only \`'()[]{}'\`.`,
    difficulty: 'EASY',
    tags: ['stack', 'strings'],
    timeLimit: 1000,
    memoryLimit: 128,
    hints: [
      "Use a stack data structure to keep track of the opening brackets.",
      "When you encounter a closing bracket, check if the top of the stack has the corresponding opening bracket.",
      "At the end, if the stack is empty, it means all brackets were matched properly."
    ],
    sampleTestCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
    ],
    hiddenTestCases: [
      { input: '"([)]"', expectedOutput: 'false' },
      { input: '"{[]}"', expectedOutput: 'true' },
      { input: '"]"', expectedOutput: 'false' },
      { input: '"["', expectedOutput: 'false' },
    ],
  },
  
  {
    title: 'Merge Intervals',
    description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

Example 1:

Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].

Constraints:
- 1 ≤ intervals.length ≤ 10⁴
- intervals[i].length == 2
- 0 ≤ starti ≤ endi ≤ 10⁴`,
    difficulty: 'MEDIUM',
    tags: ['arrays', 'sorting'],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "First, sort the intervals based on the start time.",
      "Iterate through the sorted intervals and try to merge them one by one.",
      "An interval \`[a, b]\` can be merged with \`[c, d]\` if \`c <= b\`."
    ],
    sampleTestCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' },
    ],
    hiddenTestCases: [
      { input: '[[1,4],[0,4]]', expectedOutput: '[[0,4]]' },
      { input: '[[1,4],[2,3]]', expectedOutput: '[[1,4]]' },
      { input: '[[1,10],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,10],[15,18]]' },
    ],
  },
  
  {
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    description: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."

Example 1:

Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
Output: 6
Explanation: The LCA of nodes 2 and 8 is 6.

Constraints:
- The number of nodes in the tree is in the range [2, 10⁵].
- -10⁹ ≤ Node.val ≤ 10⁹
- All Node.val are unique.
- p != q
- p and q will exist in the BST.`,
    difficulty: 'MEDIUM',
    tags: ['trees', 'binary-search-tree', 'depth-first-search'],
    timeLimit: 1500,
    memoryLimit: 128,
    hints: [
      "Utilize the property of a BST: left descendants are smaller, right descendants are larger.",
      "If both nodes are smaller than the current node, their LCA must be in the left subtree.",
      "If both nodes are larger, their LCA is in the right subtree. Otherwise, the current node is the LCA."
    ],
    sampleTestCases: [
      { input: '[6,2,8,0,4,7,9,null,null,3,5]\n2\n8', expectedOutput: '6' },
      { input: '[6,2,8,0,4,7,9,null,null,3,5]\n2\n4', expectedOutput: '2' },
    ],
    hiddenTestCases: [
      { input: '[2,1]\n2\n1', expectedOutput: '2' },
      { input: '[3,1,4,null,2]\n2\n4', expectedOutput: '3' },
    ],
  },
  
  {
    title: 'Climbing Stairs',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Example 1:

Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps

Constraints:
- 1 ≤ n ≤ 45`,
    difficulty: 'EASY',
    tags: ['math', 'dynamic-programming', 'memoization'],
    timeLimit: 1000,
    memoryLimit: 128,
    hints: [
      "To reach step \`n\`, you could have jumped from step \`n-1\` or step \`n-2\`.",
      "This means the number of ways to reach step \`n\` is the sum of ways to reach \`n-1\` and \`n-2\`.",
      "This forms a Fibonacci sequence. You can use dynamic programming to compute the answer."
    ],
    sampleTestCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
    ],
    hiddenTestCases: [
      { input: '1', expectedOutput: '1' },
      { input: '4', expectedOutput: '5' },
      { input: '45', expectedOutput: '1836311903' },
    ],
  },
  
  {
    title: 'Coin Change',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.

Example 1:

Input: coins = [1,2,5], amount = 11
Output: 3
Explanation: 11 = 5 + 5 + 1

Constraints:
- 1 ≤ coins.length ≤ 12
- 1 ≤ coins[i] ≤ 2³¹ - 1
- 0 ≤ amount ≤ 10⁴`,
    difficulty: 'MEDIUM',
    tags: ['dynamic-programming', 'breadth-first-search'],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "This is a classic dynamic programming problem.",
      "Let \`dp[i]\` be the minimum number of coins needed to make amount \`i\`.",
      "\`dp[i] = min(dp[i], dp[i - coin] + 1)\` for all available coins."
    ],
    sampleTestCases: [
      { input: '[1,2,5]\n11', expectedOutput: '3' },
      { input: '[2]\n3', expectedOutput: '-1' },
      { input: '[1]\n0', expectedOutput: '0' },
    ],
    hiddenTestCases: [
      { input: '[186,419,83,408]\n6249', expectedOutput: '20' },
      { input: '[1,2147483647]\n2', expectedOutput: '2' },
    ],
  },
  
  {
    title: 'Longest Substring Without Repeating Characters',
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.

Example 1:

Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Constraints:
- 0 ≤ s.length ≤ 5 * 10⁴
- \`s\` consists of English letters, digits, symbols and spaces.`,
    difficulty: 'MEDIUM',
    tags: ['hash-table', 'strings', 'sliding-window'],
    timeLimit: 1500,
    memoryLimit: 128,
    hints: [
      "Use a sliding window approach with two pointers.",
      "Use a hash set to keep track of the characters in the current window.",
      "If you see a repeating character, shrink the window from the left until the character is removed."
    ],
    sampleTestCases: [
      { input: '"abcabcbb"', expectedOutput: '3' },
      { input: '"bbbbb"', expectedOutput: '1' },
      { input: '"pwwkew"', expectedOutput: '3' },
    ],
    hiddenTestCases: [
      { input: '""', expectedOutput: '0' },
      { input: '" "', expectedOutput: '1' },
      { input: '"au"', expectedOutput: '2' },
      { input: '"dvdf"', expectedOutput: '3' },
    ],
  },
  
  {
    title: 'Word Break',
    description: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.

Example 1:

Input: s = "leetcode", wordDict = ["leet","code"]
Output: true
Explanation: Return true because "leetcode" can be segmented as "leet code".

Constraints:
- 1 ≤ s.length ≤ 300
- 1 ≤ wordDict.length ≤ 1000
- 1 ≤ wordDict[i].length ≤ 20
- \`s\` and \`wordDict[i]\` consist of only lowercase English letters.
- All the strings of \`wordDict\` are unique.`,
    difficulty: 'MEDIUM',
    tags: ['hash-table', 'strings', 'dynamic-programming', 'trie', 'memoization'],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "Dynamic programming can be used here. Let \`dp[i]\` be true if the substring up to index \`i\` can be broken into valid words.",
      "For each index \`i\`, check all possible previous indices \`j\`.",
      "If \`dp[j]\` is true and the substring from \`j\` to \`i\` is in the dictionary, then \`dp[i]\` is true."
    ],
    sampleTestCases: [
      { input: '"leetcode"\n["leet","code"]', expectedOutput: 'true' },
      { input: '"applepenapple"\n["apple","pen"]', expectedOutput: 'true' },
      { input: '"catsandog"\n["cats","dog","sand","and","cat"]', expectedOutput: 'false' },
    ],
    hiddenTestCases: [
      { input: '"a"\n["a"]', expectedOutput: 'true' },
      { input: '"a"\n["b"]', expectedOutput: 'false' },
      { input: '"aaaaaaa"\n["aaaa","aaa"]', expectedOutput: 'true' },
    ],
  },
  
  {
    title: 'Number of Islands',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

Example 1:

Input: grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
Output: 1

Constraints:
- m == grid.length
- n == grid[i].length
- 1 ≤ m, n ≤ 300
- \`grid[i][j]\` is '0' or '1'.`,
    difficulty: 'MEDIUM',
    tags: ['arrays', 'depth-first-search', 'breadth-first-search', 'union-find', 'matrix'],
    timeLimit: 2500,
    memoryLimit: 256,
    hints: [
      "You can use Depth First Search (DFS) or Breadth First Search (BFS) to traverse the grid.",
      "Whenever you find a '1', it means you found a new island. Increment your island count.",
      "Then, run DFS/BFS starting from that '1' to mark all connected '1's as visited (e.g., change them to '0')."
    ],
    sampleTestCases: [
      { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1' },
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3' },
    ],
    hiddenTestCases: [
      { input: '[["1"]]', expectedOutput: '1' },
      { input: '[["0"]]', expectedOutput: '0' },
      { input: '[["1","0","1","1","0","1","1"]]', expectedOutput: '3' },
    ],
  },
  
  {
    title: 'LRU Cache',
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the \`LRUCache\` class:
- \`LRUCache(int capacity)\` Initialize the LRU cache with positive size capacity.
- \`int get(int key)\` Return the value of the key if the key exists, otherwise return -1.
- \`void put(int key, int value)\` Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity from this operation, evict the least recently used key.

The functions \`get\` and \`put\` must each run in O(1) average time complexity.

Example 1:

Input
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
Output
[null, null, null, 1, null, -1, null, -1, 3, 4]

Constraints:
- 1 ≤ capacity ≤ 3000
- 0 ≤ key ≤ 10⁴
- 0 ≤ value ≤ 10⁵
- At most 2 * 10⁵ calls will be made to \`get\` and \`put\`.`,
    difficulty: 'MEDIUM',
    tags: ['hash-table', 'linked-list', 'design', 'doubly-linked-list'],
    timeLimit: 3000,
    memoryLimit: 512,
    hints: [
      "You need O(1) time complexity for get and put operations.",
      "A hash map combined with a doubly linked list works perfectly for this.",
      "The hash map stores the keys and pointers to the linked list nodes. The linked list maintains the order of usage."
    ],
    sampleTestCases: [
      { input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', expectedOutput: '[null,null,null,1,null,-1,null,-1,3,4]' },
    ],
    hiddenTestCases: [
      { input: '["LRUCache","put","get","put","get","get"]\n[[1],[2,1],[2],[3,2],[2],[3]]', expectedOutput: '[null,null,1,null,-1,2]' },
    ],
  },
  
  {
    title: 'Trapping Rain Water',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.

Example 1:

Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]
Output: 6
Explanation: The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.

Constraints:
- \`n == height.length\`
- 1 ≤ n ≤ 2 * 10⁴
- 0 ≤ height[i] ≤ 10⁵`,
    difficulty: 'HARD',
    tags: ['arrays', 'two-pointers', 'dynamic-programming', 'stack', 'monotonic-stack'],
    timeLimit: 2000,
    memoryLimit: 256,
    hints: [
      "The amount of water trapped above a bar is determined by the minimum of the highest bars to its left and right, minus its own height.",
      "You can precompute the left max and right max for each bar in O(N) time.",
      "Alternatively, you can use a two-pointer approach to optimize space to O(1)."
    ],
    sampleTestCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
      { input: '[4,2,0,3,2,5]', expectedOutput: '9' },
    ],
    hiddenTestCases: [
      { input: '[0]', expectedOutput: '0' },
      { input: '[2,0,2]', expectedOutput: '2' },
      { input: '[3,0,0,2,0,4]', expectedOutput: '10' },
    ],
  }
];

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // WARNING: deletes all existing problems
    console.log('🗑️  Clearing existing problems...');
    await Problem.deleteMany({});
    console.log('✅ Existing problems removed');

    console.log('📝 Inserting seed problems...');
    const inserted = await Problem.insertMany(problems);
    console.log(`✅ Successfully inserted ${inserted.length} problems:`);

    inserted.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title} [${p.difficulty}]`);
    });

    await mongoose.disconnect();
    console.log('\n🎉 Seeding complete! Database disconnected.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
