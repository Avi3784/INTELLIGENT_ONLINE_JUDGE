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
1. Code Review: Identify bugs, logic errors, or edge cases. Use precise software engineering terminology.
2. Optimization: Suggest improvements for time/space complexity using Big O notation strictly.
3. Complexity Analysis: State the time and space complexity with rigorous academic justification.
4. Professional Tips: Give 2-3 actionable tips based on industry best practices (e.g., Clean Code, SOLID principles, design patterns).

Strict Guidelines:
- Do NOT use layman explanations or simple metaphors. 
- Use professional, rigorous academic and software engineering terminology.
- Keep the response concise, highly technical, and strictly focused on the algorithm and code quality.
- Use markdown formatting.`;

    const result = await model.generateContent(prompt);
    const feedback = result.response.text();

    res.json({ feedback });
  } catch (err) {
    console.error('AI feedback error:', err);
    
    // Check if it's a rate limit or quota error from Gemini
    if (err.status === 429 || (err.message && err.message.includes('429'))) {
      return res.status(429).json({ message: 'Google Gemini API Quota Exceeded. You have hit the rate limit for your API key. Please wait a moment or check your billing plan.' });
    }
    
    res.status(500).json({ message: err.message || 'Failed to generate AI feedback' });
  }
});

module.exports = router;
