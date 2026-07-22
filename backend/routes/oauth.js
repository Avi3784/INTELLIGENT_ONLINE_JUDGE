const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// GITHUB
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', { session: false }, (err, user, info) => {
    if (err) {
      console.error('GitHub OAuth error:', err);
      return res.redirect(`http://localhost:5173/login?error=${encodeURIComponent(err.message)}`);
    }
    if (!user) {
      console.error('GitHub OAuth: No user returned', info);
      return res.redirect('http://localhost:5173/login?error=github_failed');
    }
    const token = generateToken(user);
    res.redirect(`http://localhost:5173/oauth-callback?token=${token}`);
  })(req, res, next);
});

// GOOGLE
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.redirect(`http://localhost:5173/login?error=${encodeURIComponent(err.message)}`);
    }
    if (!user) {
      console.error('Google OAuth: No user returned', info);
      return res.redirect('http://localhost:5173/login?error=google_failed');
    }
    const token = generateToken(user);
    res.redirect(`http://localhost:5173/oauth-callback?token=${token}`);
  })(req, res, next);
});

module.exports = router;
