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
  add: (...args) => {
    if (!process.env.REDIS_URL) {
      return Promise.reject(new Error('No REDIS_URL provided. Fallback to inline execution.'));
    }
    // Add default job options with retry logic
    const jobName = args[0];
    const jobData = args[1];
    const jobOpts = {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: 100,
      removeOnFail: 50,
      ...(args[2] || {}),
    };
    return getSubmissionQueue().add(jobName, jobData, jobOpts);
  },
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
      // Re-throw so BullMQ can handle retries
      throw err;
    }
  }, { connection, concurrency: 5 });

  // When a job permanently fails after all retry attempts, mark submission as error
  worker.on('failed', async (job, err) => {
    console.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, err);
    try {
      if (job.data && job.data.submissionId) {
        await Submission.findByIdAndUpdate(job.data.submissionId, {
          verdict: 'RTE',
          testResults: [{ passed: false, error: 'Execution failed after retries: ' + err.message }],
        });
      }
    } catch (updateErr) {
      console.error('Failed to update submission after job failure:', updateErr);
    }
  });

  // Handle stalled jobs (container crash / worker disconnect mid-execution)
  worker.on('stalled', (jobId) => {
    console.warn(`Job ${jobId} stalled — will be retried automatically by BullMQ`);
  });

  return worker;
}

module.exports = { submissionQueue, createWorker };

