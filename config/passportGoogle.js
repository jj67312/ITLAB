const GoogleStrategy = require('passport-google-oauth20').Strategy;

const dotenv = require('dotenv');
const User = require('../models/User');
dotenv.config();

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET} = require('../configuration');

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/google/callback',
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value }).then((user) => {
          if (user) {
            return done(null, user);
          } else {
            const newUser = new User({
              username: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              salt: null,
              hashedPassword: null,
            });

            newUser.save();
            return done(null, user);
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((userId, done) => {
    User.findById(userId)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });
};
