const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  description: String,
  time: {
    type: Date,
    default: () => Date.now(),
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  likeCount: {
    type: Number,
    default: 0,
  },
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
