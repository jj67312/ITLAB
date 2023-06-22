const User = require('../models/User');
const postModel = require('../models/Post');
const commentModel = require('../models/Comment');

module.exports.renderHomePage = (req, res) => {
  res.render('landing.ejs');
}

module.exports.renderLoginPage = (req, res) => {
  res.render('login.ejs', { message: req.flash('error') });
};

module.exports.renderRegisterPage = (req, res) => {
  res.render('register.ejs', { message: req.flash('error_msg') });
};

module.exports.getUserProfile = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  const allPosts = await postModel.find();
  const allComments = await commentModel.find();

  let userPosts = [];
  let userComments = [];

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

  res.render('profile.ejs', { userComments, userPosts, user });
};
