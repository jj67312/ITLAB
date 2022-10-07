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

app.get('/post/:id', async (req, res)=>{
  const post = await postModel.findById(req.params.id)
  
})

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

const commentModel = require('./models/Comment')
app.post('/comment' , (req,res)=>{

})


app.listen(3000, (req, res) => {
  console.log('ITLAB');
});
