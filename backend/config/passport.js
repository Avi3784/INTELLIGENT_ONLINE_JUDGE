const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/oauth/github/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : `${profile.username}@github.com`;
      
      let user = await User.findOne({ 
        $or: [
          { providerId: profile.id, authProvider: 'github' },
          { email: email }
        ]
      });

      if (user) {
        // If user logged in with email before, but now uses github, link them
        if (!user.providerId) {
          user.providerId = profile.id;
          user.authProvider = 'github';
          user.avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
          await user.save();
        }
        return done(null, user);
      } else {
        // Ensure username is unique
        let username = profile.username || profile.displayName || `github_${profile.id}`;
        let existingUsername = await User.findOne({ username });
        if (existingUsername) {
          username = `${username}_${Date.now()}`;
        }

        user = await User.create({
          username,
          email,
          authProvider: 'github',
          providerId: profile.id,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null
        });
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  }));
}

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/oauth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
      if (!email) return done(new Error("No email found from Google"), null);
      
      let user = await User.findOne({ 
        $or: [
          { providerId: profile.id, authProvider: 'google' },
          { email: email }
        ]
      });

      if (user) {
        if (!user.providerId) {
          user.providerId = profile.id;
          user.authProvider = 'google';
          user.avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : null;
          await user.save();
        }
        return done(null, user);
      } else {
        let username = profile.displayName ? profile.displayName.replace(/\s+/g, '') : `google_${profile.id}`;
        let existingUsername = await User.findOne({ username });
        if (existingUsername) {
          username = `${username}_${Date.now()}`;
        }

        user = await User.create({
          username,
          email,
          authProvider: 'google',
          providerId: profile.id,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null
        });
        return done(null, user);
      }
    } catch (err) {
      return done(err, null);
    }
  }));
}

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
