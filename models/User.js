const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  googleId: String,
  salt: String,
  hashedPassword: String,
});

module.exports = mongoose.model('UserSchema', UserSchema);
