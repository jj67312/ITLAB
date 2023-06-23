const User = require('../models/User');
const commentModel = require('../models/Comment');
const postModel = require('../models/Post');
const axios = require('axios');

module.exports.getAllPosts = async (req, res) => {
  const allPosts = await postModel.find({}).populate('author');
  const userId = req.user._id;
  const user = await User.findById(userId);
  const allComments = await commentModel.find();

  let userPosts = [];
  let userComments = [];

  /*
    Have an allPosts array with each post populated
      have to mark each of these posts on two parameters: isLikedByUser and isDisLikedByUser

      a post is isLikedByUser if: it exists in the user.likedPosts array of object ids
      a post is isDisLikedByUser if it exists in the user.dislikedPosts array of object ids
  */

  for (let post of allPosts) {
    const postIsLiked = user.likedPosts.some((likedPost) =>
      likedPost.equals(post._id)
    );

    if (postIsLiked) {
      post.isLikedByUser = true;
    } else {
      post.isLikedByUser = false;
    }
    
    await post.save();
  }

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

  currPost.likeCount -= 1;
  user.likedPosts.pull(currPost._id);

  await currPost.save();
  await user.save();

  res.redirect('/forums');
};

module.exports.getSinglePost = async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  const postId = req.params.id;
  const post = await postModel
    .findById(postId)
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
      },
    })
    .populate('author');

  for (let comment of post.comments) {
    const isCommentLiked = user.likedComments.some((likedComment) =>
      likedComment.equals(comment._id)
    );
    if (isCommentLiked) {
      comment.isLikedByUser = true;
    } else {
      comment.isLikedByUser = false;
    }
    await comment.save();
  }

  const api_key = `b6648609e6dc43d8b134e6300e80c212`;
  var url = `https://newsapi.org/v2/top-headlines?language=en&category=technology&apiKey=b6648609e6dc43d8b134e6300e80c212`;

  const getData = async () => {
    const options = {
      method: 'GET',
      url: `https://newsapi.org/v2/top-headlines?language=en&category=technology&apiKey=b6648609e6dc43d8b134e6300e80c212`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const result = await axios(options);
      return result.data.articles;
    } catch (e) {
      console.log(e);
    }
  };

  const newsData = await getData();
  res.render('comments.ejs', { post, newsData });
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
