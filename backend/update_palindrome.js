const mongoose = require('mongoose');
const Problem = require('./models/Problem');
require('dotenv').config();

async function updatePalindrome() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/oj';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const newDescription = `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.

**Example 1:**
**Input:** x = 121
**Output:** true
**Explanation:** 121 reads as 121 from left to right and from right to left.

**Example 2:**
**Input:** x = -121
**Output:** false
**Explanation:** From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.

**Example 3:**
**Input:** x = 10
**Output:** false
**Explanation:** Reads 01 from right to left. Therefore it is not a palindrome.

**Constraints:**
- \`-2^31 <= x <= 2^31 - 1\``;

    await Problem.updateOne(
      { title: 'Palindrome Number' },
      { $set: { description: newDescription } }
    );
    console.log("Successfully updated Palindrome Number description with bold text");

  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

updatePalindrome();
