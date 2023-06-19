const commentModel = require('../models/Comment');
const User = require('../models/User');

module.exports.createComment = async (req, res) => {
  const postID = req.params.id;
  const comment = req.body;
  const currPost = await postModel.findById(postID);
  const newComment = await commentModel.create(comment);

  currPost.comments.push(newComment._id);
  newComment.author = req.user._id;
  newComment.postId = currPost._id;

  await newComment.save();
  await currPost.save();
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

  // remove from dislikedPost
  user.dislikedComments.map((dislikedComment) => {
    if (dislikedComment._id.equals(currComment._id)) {
      currComment.dislikeCount -= 1;
      // remove currComment from dislikedComments
      user.dislikedComments = user.dislikedComments.filter(
        (item) => !item.equals(currComment._id)
      );
    }
  });

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
  user.likedComments.map((likedComment) => {
    if (likedComment._id.equals(currComment._id)) {
      currComment.likeCount -= 1;
      user.likedComments = user.likedComments.filter(
        (item) => !item.equals(currComment._id)
      );
    }
  });

  currComment.dislikeCount += 1;
  user.dislikedComments.push(commentId);

  await currComment.save();
  await user.save();

  res.redirect(`/forums/${currComment.postId}`);
};
