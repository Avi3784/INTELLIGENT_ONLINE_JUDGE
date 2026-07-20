const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
    upvotes: {
      type: [mongoose.Schema.Types.ObjectId], // Array of user IDs who upvoted
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Solution', solutionSchema);
