const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.urlencoded({ extended: true }));

main()
  .catch((err) => console.log(err))
  .then(() => {
    console.log('Connection to DB successful');
  });
async function main() {
  await mongoose.connect('mongodb://localhost:27017/itlab');
}

const postModel = require('./models/Post');

// get all posts
app.get('/post', async (req, res) => {
  const allPosts = await postModel.find({});
  res.send(allPosts);
});

// get specified post
app.get('/post/:id', async (req, res) => {
  const post = await postModel.findById(req.params.id).populate('comments');
  res.send(post);
});

// create new post
app.post('/', async (req, res) => {
  const newPost = req.body;
  const post = await postModel.create(newPost);
  await post.save();
  res.send(newPost);
});

// for deleting post:
app.delete('/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await postModel.findById(postId);
  await postModel.deleteOne(post);
  res.send(post);
});

// update post:
app.put('/:id', async (req, res) => {
  const postId = req.params.id;
  // old post
  const post = await postModel.findById(postId);
  console.log('OLD POST');
  console.log(post);
  // edited post
  const newPost = req.body;
  console.log('NEW POST');
  console.log(newPost);
  // update title and description
  post.title = newPost.title;
  post.description = newPost.description;
  await post.save();
  res.send(post);
});

// Comments -------------------

const commentModel = require('./models/Comment');

// make a new comment
app.post('/:id/comment', async (req, res) => {
  // find the post under which the comments are made
  const postID = req.params.id;
  // get the comment from the form
  const comment = req.body;
  // find the post from the db
  const currPost = await postModel.findById(postID);
  // make new comment and enter into the db
  const newComment = await commentModel.create(comment);
  // push the comment into the selected post
  currPost.comments.push(newComment._id);
  await currPost.save();
  res.send(currPost);
});

// delete a comment:
app.delete('/:id/comment/:commentID', async (req, res) => {
  const { id, commentID } = req.params;
  const currPost = await postModel.findByIdAndUpdate(id, {
    $pull: { comments: commentID },
  });
  const currComment = await commentModel.findByIdAndDelete(commentID);

  res.send({ currPost, currComment });
});

app.listen(3000, (req, res) => {
  console.log('ITLAB');
});
