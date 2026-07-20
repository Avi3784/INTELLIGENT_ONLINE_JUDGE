const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Problem title is required'],
    },

    description: {
      type: String,
      required: [true, 'Problem description is required'],
    },

    difficulty: {
      type: String,
      enum: ['EASY', 'MEDIUM', 'HARD'],
      required: [true, 'Difficulty is required'],
    },

    tags: {
      type: [String],
      default: [],
    },

    timeLimit: {
      type: Number,
      default: 2000,
    },
    memoryLimit: {
      type: Number,
      default: 256,
    },
    hints: [String],
    methodName: String,
    defaultCode: {
      python: String,
      javascript: String,
      cpp: String,
      java: String
    },
    driverCode: {
      cpp: String,
      java: String
    },
    officialSolution: {
      explanation: String,
      code: {
        python: String,
        javascript: String,
        cpp: String,
        java: String
      }
    },
    sampleTestCases: {
      type: [testCaseSchema],
      default: [],
    },

    // NEVER sent to the client
    hiddenTestCases: {
      type: [testCaseSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Problem', problemSchema);
