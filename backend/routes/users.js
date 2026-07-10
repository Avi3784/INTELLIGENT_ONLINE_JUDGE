const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');

// Strip hidden test case details from results
function stripHiddenDetails(testResults) {
  if (!testResults) return testResults;
  return testResults.map((r) => {
    if (r.isHidden) {
      return { passed: r.passed, executionTime: r.executionTime, isHidden: true };
    }
    return r;
  });
}

// GET /profile — Get current user's profile with stats
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');

    const totalSubmissions = await Submission.countDocuments({ userId: user._id });

    // Get solved problems with difficulty info
    const solvedProblems = await Problem.find({
      _id: { $in: user.solvedProblems || [] },
    }).select('difficulty');

    const difficultyBreakdown = { easy: 0, medium: 0, hard: 0 };
    solvedProblems.forEach((p) => {
      const key = p.difficulty.toLowerCase();
      if (difficultyBreakdown[key] !== undefined) {
        difficultyBreakdown[key]++;
      }
    });

    // Recent submissions
    const recentSubmissions = await Submission.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('problemId', 'title difficulty');

    const cleanedSubmissions = recentSubmissions.map((s) => {
      const obj = s.toObject();
      obj.testResults = stripHiddenDetails(obj.testResults);
      return obj;
    });

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        solvedCount: solvedProblems.length,
        totalSubmissions,
        difficultyBreakdown,
        recentSubmissions: cleanedSubmissions,
      },
    });
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;
