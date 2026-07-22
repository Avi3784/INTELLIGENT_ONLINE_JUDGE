const express = require('express');
const Problem = require('../models/Problem');
const { protect, adminOnly } = require('../middleware/auth');
const redis = require('../config/redis');

const router = express.Router();

// GET /api/problems — paginated, optionally filtered by difficulty
router.get('/', async (req, res) => {
  try {
    const { difficulty, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (difficulty) {
      filter.difficulty = difficulty.toUpperCase();
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20)); // Cap at 100

    const cacheKey = `problems:page:${pageNum}:limit:${limitNum}:diff:${difficulty || 'all'}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const total = await Problem.countDocuments(filter);

    const problems = await Problem.find(filter)
      .select('-hiddenTestCases')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      problems,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalProblems: total,
    });
  } catch (error) {
    console.error('List problems error:', error.message);
    res.status(500).json({ message: 'Server error fetching problems' });
  }
});

// GET /api/problems/:id
router.get('/:id', async (req, res) => {
  try {
    // Exclude hiddenTestCases so users can't cheat
    const problem = await Problem.findById(req.params.id).select('-hiddenTestCases');

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json(problem);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Problem not found (invalid ID)' });
    }
    console.error('Get problem error:', error.message);
    res.status(500).json({ message: 'Server error fetching problem' });
  }
});

// POST /api/problems (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      timeLimit,
      memoryLimit,
      sampleTestCases,
      hiddenTestCases,
    } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: 'Title, description, and difficulty are required' });
    }

    const problem = await Problem.create({
      title,
      description,
      difficulty: difficulty.toUpperCase(),
      tags: tags || [],
      timeLimit: timeLimit || 2000,
      memoryLimit: memoryLimit || 256,
      sampleTestCases: sampleTestCases || [],
      hiddenTestCases: hiddenTestCases || [],
    });

    res.status(201).json(problem);
  } catch (error) {
    console.error('Create problem error:', error.message);
    res.status(500).json({ message: 'Server error creating problem' });
  }
});

// PUT /api/problems/:id (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const updatableFields = [
      'title',
      'description',
      'difficulty',
      'tags',
      'timeLimit',
      'memoryLimit',
      'sampleTestCases',
      'hiddenTestCases',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        problem[field] = field === 'difficulty'
          ? req.body[field].toUpperCase()
          : req.body[field];
      }
    });

    const updatedProblem = await problem.save();
    res.json(updatedProblem);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Problem not found (invalid ID)' });
    }
    console.error('Update problem error:', error.message);
    res.status(500).json({ message: 'Server error updating problem' });
  }
});

// DELETE /api/problems/:id (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    await problem.deleteOne();
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Problem not found (invalid ID)' });
    }
    console.error('Delete problem error:', error.message);
    res.status(500).json({ message: 'Server error deleting problem' });
  }
});

module.exports = router;
