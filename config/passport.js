const User = require('../models/User');
const validPassword = require('../utils').validPassword;
const localStrategy = require('passport-local').Strategy;

module.exports = (passport) => {
  passport.use(
    new localStrategy((username, password, done) => {
      User.findOne({ username: username })
        .then((user) => {
          if (!user) {
            return done(null, false , { message: 'Username not found'});
          }
          const isValid = validPassword(
            password,
            user.hashedPassword,
            user.salt
          );
          if (isValid) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Incorrect Password' });
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
