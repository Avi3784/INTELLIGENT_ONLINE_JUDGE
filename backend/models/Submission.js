const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
      index: true,
    },

    language: {
      type: String,
      enum: ['python', 'javascript', 'cpp', 'java'],
      required: [true, 'Language is required'],
    },

    code: {
      type: String,
      required: [true, 'Code is required'],
    },

    // PENDING, AC (Accepted), WA (Wrong Answer), TLE, MLE, RTE
    verdict: {
      type: String,
      enum: ['PENDING', 'AC', 'WA', 'TLE', 'MLE', 'RTE'],
      default: 'PENDING',
    },

    executionTime: {
      type: Number,
    },

    memoryUsed: {
      type: Number,
    },

    testResults: [{
      passed: { type: Boolean, required: true },
      input: String,
      expectedOutput: String,
      actualOutput: String,
      executionTime: Number,
      error: String,
      isHidden: { type: Boolean, default: false },
    }],

    totalTestCases: { type: Number },
    passedTestCases: { type: Number },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Submission', submissionSchema);
