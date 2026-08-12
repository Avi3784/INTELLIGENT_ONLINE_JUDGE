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

Provide exactly 3 progressive hints in a strict JSON array format.
Hint 1: A subtle nudge pointing out a potential flaw, inefficiency, or edge case.
Hint 2: A deeper hint suggesting a specific data structure, logic correction, or complexity target.
Hint 3: A clear structural or pseudo-code hint (but NOT the actual code).

Strict Guidelines:
- DO NOT WRITE OR REVEAL THE CORRECT CODE SOLUTION.
- The output MUST be a valid JSON array of 3 strings.
- Do not include markdown formatting like \`\`\`json. Just output the raw JSON array.
- Example format: ["hint 1", "hint 2", "hint 3"]`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
    });
    
    let feedbackStr = chatCompletion.choices[0]?.message?.content || "[]";
    
    // Strip markdown code blocks if the model still includes them
    feedbackStr = feedbackStr.replace(/^```json/im, '').replace(/^```/im, '').replace(/```$/im, '').trim();
    
    let feedback = [];
    try {
      feedback = JSON.parse(feedbackStr);
      if (!Array.isArray(feedback)) throw new Error("Not an array");
    } catch (e) {
      // Fallback if parsing fails
      feedback = ["Could not parse AI response into hints. Raw output:", feedbackStr];
    }

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
      model: 'llama-3.3-70b-versatile',
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "";

    res.json({ response: responseText });
  } catch (err) {
    console.error('AI chat error:', err);
    res.status(500).json({ message: err.message || 'Failed to generate AI chat response' });
  }
});

module.exports = router;
