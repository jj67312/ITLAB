const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  commentBody: String,
  likeCount: {
    type: Number,
    default: 0,
  },
  // dislikeCount: {
  //   type: Number,
  //   default: 0,
  // },
});

module.exports = mongoose.model('Comment', commentSchema);
