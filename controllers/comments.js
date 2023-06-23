const commentModel = require('../models/Comment');
const User = require('../models/User');
const postModel = require('../models/Post');

module.exports.createComment = async (req, res) => {
  const postID = req.params.id;
  const comment = req.body;
  const userId = req.user._id;
  const user = await User.findById(userId);
  const currPost = await postModel.findById(postID);
  const newComment = await commentModel.create(comment);

  currPost.comments.push(newComment._id);
  newComment.author = req.user._id;
  newComment.postId = currPost._id;
  user.userComments.push(newComment._id);

  await newComment.save();
  await currPost.save();
  await user.save();
  
  res.redirect(`/forums/${postID}`);
};

module.exports.deleteComment = async (req, res) => {
  const { id, commentID } = req.params;
  const currPost = await postModel.findByIdAndUpdate(id, {
    $pull: { comments: commentID },
  });
  const currComment = await commentModel.findByIdAndDelete(commentID);

  res.send({ currPost, currComment });
};

module.exports.likeComment = async (req, res) => {
  const { commentId } = req.params;
  const currComment = await commentModel.findById(commentId);
  const userId = req.user._id;
  const user = await User.findById(userId);

  // remove the likedComment if it exists in the dislikeComments array of the user
  // let prevLen = user.dislikedComments.length;
  // user.dislikedComments.pull(currComment._id);
  // if (user.dislikedComments.length < prevLen) currComment.dislikeCount--;

  currComment.likeCount += 1;
  user.likedComments.push(commentId);

  await currComment.save();
  await user.save();

  res.redirect(`/forums/${currComment.postId}`);
};

module.exports.dislikeComment = async (req, res) => {
  const { commentId } = req.params;
  const currComment = await commentModel.findById(commentId);
  const userId = req.user._id;
  const user = await User.findById(userId);

  // remove from dislikedPost
  // let prevLen = user.likedComments.length;
  // user.likedComments.pull(currComment._id);
  // if (user.likedComments.length < prevLen) currComment.likeCount--;
  
  currComment.likeCount -= 1;
  user.likedComments.pull(currComment._id);
  //user.dislikedComments.push(commentId);

  await currComment.save();
  await user.save();

  res.redirect(`/forums/${currComment.postId}`);
};
