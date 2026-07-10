const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const { executeCode } = require('../services/executor');

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

function determineVerdict(results) {
  const hasTLE = results.some((r) => r.error && r.error.includes('TLE'));
  if (hasTLE) return 'TLE';

  const hasRTE = results.some((r) => r.error);
  if (hasRTE) return 'RTE';

  const allPassed = results.every((r) => r.passed);
  return allPassed ? 'AC' : 'WA';
}

// POST / — Submit solution (full judge with hidden tests)
router.post('/', protect, async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({ message: 'problemId, language, and code are required' });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Combine sample and hidden test cases
    const allTestCases = [
      ...problem.sampleTestCases.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: false,
      })),
      ...problem.hiddenTestCases.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: true,
      })),
    ];

    // Create pending submission
    const submission = await Submission.create({
      userId: req.user._id,
      problemId,
      language,
      code,
      verdict: 'PENDING',
    });

    // Execute code
    const results = await executeCode(code, language, allTestCases, problem.timeLimit);
    const verdict = determineVerdict(results);
    const totalExecTime = results.reduce((sum, r) => sum + (r.executionTime || 0), 0);
    const passedCount = results.filter((r) => r.passed).length;

    // Update submission
    submission.verdict = verdict;
    submission.testResults = results;
    submission.executionTime = totalExecTime;
    submission.totalTestCases = results.length;
    submission.passedTestCases = passedCount;
    await submission.save();

    // If AC, add to solved problems
    if (verdict === 'AC') {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { solvedProblems: problemId },
      });
    }

    // Return with hidden details stripped
    const responseObj = submission.toObject();
    responseObj.testResults = stripHiddenDetails(responseObj.testResults);

    res.status(201).json(responseObj);
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// POST /run — Run against sample tests only
router.post('/run', protect, async (req, res) => {
  try {
    const { problemId, language, code } = req.body;

    if (!problemId || !language || !code) {
      return res.status(400).json({ message: 'problemId, language, and code are required' });
    }

    const problem = await Problem.findById(problemId).select('-hiddenTestCases');
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const sampleTests = problem.sampleTestCases.map((tc) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      isHidden: false,
    }));

    const results = await executeCode(code, language, sampleTests, problem.timeLimit);
    const verdict = determineVerdict(results);

    res.json({ results, verdict });
  } catch (err) {
    console.error('Run error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// GET / — Get user's submissions
router.get('/', protect, async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.problemId) {
      filter.problemId = req.query.problemId;
    }

    const submissions = await Submission.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('problemId', 'title difficulty');

    const cleaned = submissions.map((s) => {
      const obj = s.toObject();
      obj.testResults = stripHiddenDetails(obj.testResults);
      return obj;
    });

    res.json(cleaned);
  } catch (err) {
    console.error('Get submissions error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// GET /:id — Get specific submission
router.get('/:id', protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const obj = submission.toObject();
    obj.testResults = stripHiddenDetails(obj.testResults);

    res.json(obj);
  } catch (err) {
    console.error('Get submission error:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

module.exports = router;
