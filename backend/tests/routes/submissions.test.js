const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const submissionRoutes = require('../../routes/submissions');
const User = require('../../models/User');
const Problem = require('../../models/Problem');
const Submission = require('../../models/Submission');

// Mock the auth middleware to bypass JWT verification in tests
jest.mock('../../middleware/auth', () => ({
  protect: (req, res, next) => next(),
  adminOnly: (req, res, next) => next(),
}));

// Mock the executor service
jest.mock('../../services/executor', () => ({
  executeCode: jest.fn().mockResolvedValue([
    { passed: true, actualOutput: 'Mock Output', error: null, executionTime: 50, isHidden: false }
  ])
}));

// Mock the queue module to avoid Redis dependency and simulate synchronous worker execution
jest.mock('../../queue', () => {
  const Submission = require('../../models/Submission');
  const User = require('../../models/User');
  const mongoose = require('mongoose');
  const { executeCode } = require('../../services/executor');

  function determineVerdict(results) {
    const hasTLE = results.some((r) => r.error && r.error.includes('TLE'));
    if (hasTLE) return 'TLE';

    const hasRTE = results.some((r) => r.error);
    if (hasRTE) return 'RTE';

    const allPassed = results.every((r) => r.passed);
    return allPassed ? 'AC' : 'WA';
  }

  return {
    submissionQueue: {
      add: jest.fn().mockImplementation(async (event, data) => {
        const results = await executeCode(
          data.code,
          data.language,
          data.allTestCases,
          data.timeLimit,
          data.methodName,
          data.driverCode
        );

        const verdict = determineVerdict(results);
        const totalExecTime = results.reduce((sum, r) => sum + (r.executionTime || 0), 0);
        const passedCount = results.filter((r) => r.passed).length;

        await Submission.findByIdAndUpdate(data.submissionId, {
          verdict,
          testResults: results,
          executionTime: totalExecTime,
          totalTestCases: results.length,
          passedTestCases: passedCount,
        });

        if (verdict === 'AC') {
          await User.findByIdAndUpdate(data.userId, {
            $addToSet: { solvedProblems: new mongoose.Types.ObjectId(data.problemId) },
          });
        }
      }),
    },
    createWorker: jest.fn(),
  };
});

let testUserId;

const app = express();
app.use(express.json());

// Mock auth middleware for testing
app.use((req, res, next) => {
  req.user = { _id: testUserId };
  next();
});
app.use('/api/submissions', submissionRoutes);

describe('Submission Routes', () => {

  let testProblemId;

  beforeEach(async () => {
    const user = await User.create({ username: 'sub_test_user', email: 'sub_test@t.com', passwordHash: 'hash' });
    testUserId = user._id;

    const problem = await Problem.create({
      title: 'Mock Problem',
      description: 'Mock Description',
      difficulty: 'EASY',
      sampleTestCases: [{ input: '1', expectedOutput: '1' }]
    });
    testProblemId = problem._id;
  });

  it('should submit code and return AC when tests pass', async () => {
    const res = await request(app)
      .post('/api/submissions')
      .send({
        problemId: testProblemId,
        language: 'javascript',
        code: 'console.log("Mock Output");'
      });

    // The route returns the newly created submission (PENDING) with queue processing async
    expect(res.statusCode).toEqual(201);
    expect(res.body.verdict).toBe('PENDING');

    // After queue processing (mocked), the submission should be updated with AC
    const updatedSubmission = await Submission.findById(res.body._id);
    expect(updatedSubmission).toBeTruthy();
    expect(updatedSubmission.verdict).toBe('AC');
    expect(updatedSubmission.passedTestCases).toBe(1);

    // Verify it updated the user's solvedProblems
    const user = await User.findById(testUserId);
    expect(user.solvedProblems.some(id => id.toString() === testProblemId.toString())).toBe(true);
  });
});
