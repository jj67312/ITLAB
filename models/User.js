const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  salt: String,
  hashedPassword: String,
});

module.exports = mongoose.Model('UserSchema', UserSchema);
