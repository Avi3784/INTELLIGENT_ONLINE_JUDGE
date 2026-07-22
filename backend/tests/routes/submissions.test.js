const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const submissionRoutes = require('../../routes/submissions');
const User = require('../../models/User');
const Problem = require('../../models/Problem');
const Submission = require('../../models/Submission');

// Mock the executor service
jest.mock('../../services/executor', () => ({
  executeCode: jest.fn().mockResolvedValue([
    { passed: true, actualOutput: 'Mock Output' }
  ])
}));

const app = express();
app.use(express.json());

// Mock auth middleware for testing
app.use((req, res, next) => {
  req.user = { _id: new mongoose.Types.ObjectId() };
  next();
});
app.use('/api/submissions', submissionRoutes);

describe('Submission Routes', () => {

  let testProblemId;
  let testUserId;

  beforeAll(async () => {
    const user = await User.create({ username: 'tester', email: 't@t.com', passwordHash: 'hash' });
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
    // Override the mocked req.user in the route with our real user ID
    app.request.user = { _id: testUserId };

    const res = await request(app)
      .post('/api/submissions')
      .send({
        problemId: testProblemId,
        language: 'javascript',
        code: 'console.log("Mock Output");'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.verdict).toBe('AC');
    expect(res.body.data.passedTestCases).toBe(1);
    
    // Verify it updated the user's solvedProblems
    const user = await User.findById(testUserId);
    expect(user.solvedProblems).toContainEqual(testProblemId);
  });
});
