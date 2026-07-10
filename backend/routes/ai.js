const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// POST /feedback — Get AI feedback on submitted code
router.post('/feedback', protect, async (req, res) => {
  try {
    const { code, language, problemTitle, problemDescription, verdict } = req.body;

    if (!code || !language || !problemTitle || !problemDescription) {
      return res.status(400).json({ message: 'code, language, problemTitle, and problemDescription are required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ message: 'AI feedback is not configured. Add GEMINI_API_KEY to .env' });
    }

    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert code reviewer for a competitive programming platform.

Problem: ${problemTitle}
Description: ${problemDescription}

Language: ${language}
Verdict: ${verdict || 'N/A'}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide:
1. Code Review: Identify bugs, logic errors, or edge cases
2. Optimization: Suggest improvements for time/space complexity
3. Complexity Analysis: State the time and space complexity
4. Tips: Give 2-3 actionable tips to improve

Keep your response concise and helpful. Use markdown formatting.`;

    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    res.json({ feedback });
  } catch (err) {
    console.error('AI feedback error:', err);
    res.status(500).json({ message: 'Failed to generate AI feedback' });
  }
});

module.exports = router;
