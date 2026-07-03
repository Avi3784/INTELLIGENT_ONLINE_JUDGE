const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load .env from the backend root (one level up from /seed)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Problem = require('../models/Problem');

const problems = [
  {
    title: 'Two Sum',
    description: `## Two Sum

Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.

### Example
\`\`\`
Input:  nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`

### Constraints
- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- Only one valid answer exists.`,
    difficulty: 'EASY',
    tags: ['arrays', 'hash-map'],
    timeLimit: 2000,
    memoryLimit: 256,
    sampleTestCases: [
      { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]' },
      { input: '[3,2,4]\n6', expectedOutput: '[1,2]' },
    ],
    hiddenTestCases: [
      { input: '[1,5,3,7]\n8', expectedOutput: '[1,2]' },
      { input: '[-1,-2,-3,-4,-5]\n-8', expectedOutput: '[2,4]' },
      { input: '[0,4,3,0]\n0', expectedOutput: '[0,3]' },
    ],
  },

  {
    title: 'Reverse String',
    description: `## Reverse String

Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array **in-place** with O(1) extra memory.

### Example
\`\`\`
Input:  s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
\`\`\`

### Constraints
- 1 ≤ s.length ≤ 10⁵
- \`s[i]\` is a printable ASCII character.`,
    difficulty: 'EASY',
    tags: ['strings', 'two-pointers'],
    timeLimit: 1000,
    memoryLimit: 128,
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
    description: `## FizzBuzz

Given an integer \`n\`, return a string array \`answer\` (1-indexed) where:

- \`answer[i] == "FizzBuzz"\` if \`i\` is divisible by 3 **and** 5.
- \`answer[i] == "Fizz"\` if \`i\` is divisible by 3.
- \`answer[i] == "Buzz"\` if \`i\` is divisible by 5.
- \`answer[i] == i\` (as a string) if none of the above conditions are true.

### Example
\`\`\`
Input:  n = 15
Output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
\`\`\`

### Constraints
- 1 ≤ n ≤ 10⁴`,
    difficulty: 'EASY',
    tags: ['math', 'simulation'],
    timeLimit: 1000,
    memoryLimit: 128,
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
    description: `## Valid Palindrome

A phrase is a **palindrome** if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.

### Example
\`\`\`
Input:  s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.
\`\`\`

### Constraints
- 1 ≤ s.length ≤ 2 × 10⁵
- \`s\` consists only of printable ASCII characters.`,
    difficulty: 'EASY',
    tags: ['strings', 'two-pointers'],
    timeLimit: 1000,
    memoryLimit: 128,
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
    description: `## Maximum Subarray

Given an integer array \`nums\`, find the subarray with the largest sum, and return its **sum**.

A **subarray** is a contiguous non-empty sequence of elements within an array.

### Example
\`\`\`
Input:  nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum = 6.
\`\`\`

### Constraints
- 1 ≤ nums.length ≤ 10⁵
- -10⁴ ≤ nums[i] ≤ 10⁴

### Follow-up
If you have figured out the O(n) solution (Kadane's algorithm), try coding it with the divide-and-conquer approach, which is more subtle.`,
    difficulty: 'MEDIUM',
    tags: ['arrays', 'dynamic-programming', 'divide-and-conquer'],
    timeLimit: 2000,
    memoryLimit: 256,
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
