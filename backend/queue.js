const { Queue, Worker } = require('bullmq');
const { executeCode } = require('./services/executor');
const Submission = require('./models/Submission');
const User = require('./models/User');
const mongoose = require('mongoose');

const connection = {
  host: process.env.REDIS_HOST || (process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : '127.0.0.1'),
  port: process.env.REDIS_PORT || (process.env.REDIS_URL ? new URL(process.env.REDIS_URL).port : 6379),
  lazyConnect: true,
  enableReadyCheck: false,
  maxRetriesPerRequest: 1,
  retryStrategy: () => null,
};

let submissionQueueInstance = null;

function getSubmissionQueue() {
  if (!submissionQueueInstance) {
    submissionQueueInstance = new Queue('submissions', { connection });
  }
  return submissionQueueInstance;
}

const submissionQueue = {
  add: (...args) => getSubmissionQueue().add(...args),
};

function determineVerdict(results) {
  const hasTLE = results.some((r) => r.error && r.error.includes('TLE'));
  if (hasTLE) return 'TLE';

  const hasRTE = results.some((r) => r.error);
  if (hasRTE) return 'RTE';

  const allPassed = results.every((r) => r.passed);
  return allPassed ? 'AC' : 'WA';
}

function createWorker() {
  const worker = new Worker('submissions', async (job) => {
    const { submissionId, code, language, allTestCases, timeLimit, methodName, driverCode, userId, problemId } = job.data;
    
    try {
      const results = await executeCode(code, language, allTestCases, timeLimit, methodName, driverCode);
      const verdict = determineVerdict(results);
      const totalExecTime = results.reduce((sum, r) => sum + (r.executionTime || 0), 0);
      const passedCount = results.filter((r) => r.passed).length;

      await Submission.findByIdAndUpdate(submissionId, {
        verdict,
        testResults: results,
        executionTime: totalExecTime,
        totalTestCases: results.length,
        passedTestCases: passedCount,
      });

      if (verdict === 'AC') {
        await User.findByIdAndUpdate(userId, {
          $addToSet: { solvedProblems: new mongoose.Types.ObjectId(problemId) },
        });
      }
    } catch (err) {
      console.error('Job error', err);
      await Submission.findByIdAndUpdate(submissionId, { verdict: 'RTE' });
    }
  }, { connection, concurrency: 5 });

  worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err);
  });

  return worker;
}

module.exports = { submissionQueue, createWorker };
