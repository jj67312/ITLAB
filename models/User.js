const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  googleId: String,
  salt: String,
  hashedPassword: String,
  userPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  userComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  likedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

  // dislikedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  // dislikedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

module.exports = mongoose.model('User', UserSchema);
