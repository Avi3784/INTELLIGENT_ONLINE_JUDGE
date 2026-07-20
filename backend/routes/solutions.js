const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Solution = require('../models/Solution');
const Problem = require('../models/Problem');

// GET /api/solutions/problem/:problemId - Get all solutions for a problem
router.get('/problem/:problemId', protect, async (req, res) => {
  try {
    const { problemId } = req.params;
    
    // Sort by upvotes descending, then by newest
    const solutions = await Solution.find({ problemId })
      .populate('userId', 'username email')
      .sort({ 'upvotes.length': -1, createdAt: -1 })
      .limit(50);
      
    res.status(200).json({
      success: true,
      count: solutions.length,
      data: solutions,
    });
  } catch (error) {
    console.error('Error fetching solutions:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// POST /api/solutions - Submit a new solution to the community
router.post('/', protect, async (req, res) => {
  try {
    const { problemId, code, language, explanation } = req.body;
    
    if (!problemId || !code || !language) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const solution = await Solution.create({
      userId: req.user._id,
      problemId,
      code,
      language,
      explanation
    });

    res.status(201).json({
      success: true,
      data: solution
    });
  } catch (error) {
    console.error('Error creating solution:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// PUT /api/solutions/:id/upvote - Upvote/Downvote a solution
router.put('/:id/upvote', protect, async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ success: false, error: 'Solution not found' });
    }

    const userId = req.user._id;
    const hasUpvoted = solution.upvotes.includes(userId);

    if (hasUpvoted) {
      // Remove upvote
      solution.upvotes = solution.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
      // Add upvote
      solution.upvotes.push(userId);
    }

    await solution.save();

    res.status(200).json({
      success: true,
      data: solution
    });
  } catch (error) {
    console.error('Error upvoting solution:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = router;
