const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // We NEVER store plain text passwords. Make required false to allow OAuth users.
    passwordHash: {
      type: String,
      required: false,
    },
    
    // OAuth Fields
    authProvider: {
      type: String,
      default: 'local',
      enum: ['local', 'github', 'google']
    },
    providerId: {
      type: String,
      default: null
    },
    avatar: {
      type: String,
      default: null
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },


    solvedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
