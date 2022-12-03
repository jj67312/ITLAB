const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/User')

const GOOGLE_CLIENT_ID = "19799591403-4ro9pj02fkakbmd6mqarq8h1903janrt.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

module.exports = (passport)=>{
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile.emails.values)
        console.log(profile.photos);
        console.log("insidr Passport google config");
    
        User.findOne({email:profile.emails[0].value})
        .then((user)=>{
            if(user){
                console.log("Found user");
                return done(null, user)
            }
            else{
                const newUser = new User({
                    username: profile.displayName,
                    email:profile.emails[0].value,
                    googleId:profile.id,
                    salt: null,
                    hashedPassword: null,
                });
    
                newUser.save(function(err, user){
                    console.log("New user");
                    return done(null,user)
                })
            }
        })
      }
    ));
    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((userId, done) => {
        User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
    });
}

