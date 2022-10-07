const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  description: String,
  time: {
    type: Date,
    default: () => Date.now(),
  },
  likeCount: Number,
  dislikeCount: Number,
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
