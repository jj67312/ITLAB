const localStrategy = require('passport-local').Strategy
const User = require('../models/User')

module.exports = (passport)=>{
    passport.use(new localStrategy((username, password,done)=>{
        User.findOne({username:username})
        .then((user)=>{
            if(user){
                return done(null, user)
            }
            else{
                return done(null, false)
            }
        })
        .catch((err)=>{
            return done(err, null)
        })
    }))
}