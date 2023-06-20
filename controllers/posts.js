const User = require('../models/User');
const commentModel = require('../models/Comment');
const postModel = require('../models/Post');

module.exports.getAllPosts = async (req, res) => {
  const allPosts = await postModel.find({}).populate('author');
  const userId = req.user._id;
  const user = await User.findById(userId);

  // const allPosts = await postModel.find();
  const allComments = await commentModel.find();

  let userPosts = [];
  let userComments = [];

  // user.likedPosts
  allPosts.map((post) => {
    for (let likedPost of user.likedPosts) {
      if (post._id.equals(likedPost._id)) {
        post.isLikedByUser = true;
      } else {
        post.isLikedByUser = false;
      }
    }

    for (let dislikedPost of user.dislikedPosts) {
      if (post._id.equals(dislikedPost._id)) {
        post.isDisLikedByUser = true;
      } else {
        post.isDisLikedByUser = false;
      }
    }
  });

  // user.dislikedPosts

  for (let post of allPosts) {
    if (post.author.equals(user._id)) {
      userPosts.push(post);
    }
  }

  for (let comment of allComments) {
    if (comment.author.equals(user._id)) {
      userComments.push(comment);
    }
  }

  for (let comment of userComments) {
    comment.populate('postId');
  }
  res.render('forums.ejs', { allPosts, userPosts, userComments });
};

module.exports.renderNewForm = async (req, res) => {
  res.render('newForum.ejs');
};

module.exports.likePost = async (req, res) => {
  const { postId } = req.params;
  const currPost = await postModel.findById(postId);
  const userId = req.user._id;
  const user = await User.findById(userId);

  // remove from dislikedPost
  user.dislikedPosts.map((dislikedPost) => {
    if (dislikedPost._id.equals(currPost._id)) {
      currPost.dislikeCount -= 1;
      // remove currPost from dislikedPosts
      user.dislikedPosts = user.dislikedPosts.filter(
        (item) => !item.equals(currPost._id)
      );
    }
  });

  currPost.likeCount += 1;
  user.likedPosts.push(postId);

  await currPost.save();
  await user.save();

  res.redirect('/forums');
};

module.exports.dislikePost = async (req, res) => {
  const { postId } = req.params;
  const currPost = await postModel.findById(postId);
  const userId = req.user._id;
  const user = await User.findById(userId);

  // remove from likedPost
  user.likedPosts.map((likedPost) => {
    if (likedPost._id.equals(currPost._id)) {
      currPost.likeCount -= 1;
      // remove currPost from dislikedPosts
      user.likedPosts = user.likedPosts.filter(
        (item) => !item.equals(currPost._id)
      );
    }
  });

  currPost.dislikeCount += 1;
  user.dislikedPosts.push(postId);

  await currPost.save();
  await user.save();

  res.redirect('/forums');
};

module.exports.getSinglePost = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  const post = await postModel
    .findById(req.params.id)
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
      },
    })
    .populate('author');

  post.comments.map((comment) => {
    for (let likedComment of user.likedComments) {
      if (comment._id.equals(likedComment._id)) {
        comment.isLikedByUser = true;
      } else {
        comment.isLikedByUser = false;
      }
    }

    for (let dislikedComment of user.dislikedComments) {
      if (comment._id.equals(dislikedComment._id)) {
        comment.isDisLikedByUser = true;
      } else {
        comment.isDisLikedByUser = false;
      }
    }
  });

  res.render('comments.ejs', { post });
};

module.exports.createPost = async (req, res) => {
  const newPost = req.body;
  const currUserId = req.user._id;
  const user = await User.findById(currUserId);
  const post = await postModel.create(newPost);
  post.author = currUserId;
  user.userPosts.push(post._id);
  await user.save();
  await post.save();
  res.redirect('/forums');
};

module.exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  await postModel
    .findById(postId)
    .then((data) => {
      postModel.deleteOne(data);
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).send('Failed to delete');
    });

  res.redirect('/forums');
};

module.exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  // old post
  const post = await postModel.findById(postId);
  // edited post
  const newPost = req.body;
  // update title and description
  post.title = newPost.title;
  post.description = newPost.description;
  await post.save();
  res.json(post);
};
