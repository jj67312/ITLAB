const User = require('../models/User');
const validPassword = require('../utils').validPassword;
const localStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
  passport.use(
    new localStrategy((username, password, done) => {
      console.log('Hello passport');

      User.findOne({ username: username })
        .then((user) => {
          if (!user) {
            console.log('Didnt find user');
            return done(null, false);
          }
          const isValid = validPassword(
            password,
            user.hashedPassword,
            user.salt
          );
          if (isValid) {
            console.log('valid pass');
            return done(null, user);
          } else {
            console.log('invalid pass');
            return done(null, false);
          }
        })
        .catch((err) => {
          return done(err, null);
        });
    })
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
