const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Groq = require('groq-sdk');

// POST /feedback — Get AI feedback on submitted code
router.post('/feedback', protect, async (req, res) => {
  try {
    const { code, language, problemTitle, problemDescription, verdict } = req.body;

    if (!code || !language || !problemTitle || !problemDescription) {
      return res.status(400).json({ message: 'code, language, problemTitle, and problemDescription are required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({ message: 'AI feedback is not configured. Add GROQ_API_KEY to .env' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
- You must use easy, simple, formal, and professional language. No informal words needed. DO NOT use the word 'layman'.
- Use professional, rigorous academic and software engineering terminology.
- Keep the response concise, highly technical, and strictly focused on the algorithm and code quality.
- Use markdown formatting.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-70b-8192',
    });
    
    const feedback = chatCompletion.choices[0]?.message?.content || "";

    res.json({ feedback });
  } catch (err) {
    console.error('AI feedback error:', err);
    
    res.status(500).json({ message: err.message || 'Failed to generate AI feedback' });
  }
});

// POST /chat - Chat with AI assistant
router.post('/chat', protect, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(400).json({ message: 'AI chat is not configured. Add GROQ_API_KEY to .env' });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const systemMessage = {
      role: 'system',
      content: 'You are an AI assistant for a competitive programming platform. You ONLY answer questions related to Data Structures, Algorithms, code explanations, and programming logic. Use easy, simple, formal, and professional language. Explain code step-by-step. If the user asks about anything unrelated, politely decline.'
    };

    const apiMessages = [systemMessage, ...messages];

    const chatCompletion = await groq.chat.completions.create({
      messages: apiMessages,
      model: 'llama3-70b-8192',
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    res.json({ response: responseText });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ message: err.message || 'Failed to generate AI chat response' });
  }
});

module.exports = router;
