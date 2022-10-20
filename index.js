const express = require('express');
const app = express();

const passport = require('passport');

const genPassword = require('./utils').genPassword

const isAuth = require('./authMiddleware').isAuth

app.use(express.urlencoded({ extended: true }));

// Database connection
require('./config/database')

// Session store
const session = require('express-session')

const MongoStore = require('connect-mongo')
const sessionStore = new MongoStore({collectionName:"sessions", mongoUrl:'mongodb://localhost:27017/itlab'})

app.use(session({
  secret:"jvdbvjdiv",
  resave:false,
  saveUninitialized:true,
  store: sessionStore,
  cookie : {
    maxAge: 1000*60 // 1min
  }
}))

// Passport 
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')

app.use((req,res,next)=>{
  console.log(req.session)
  console.log(req.user);
  next()
})

//ejs
app.set('view-engine', 'ejs')

//models
const postModel = require('./models/Post');
const User = require('./models/User')

// login and register routes --------------------

app.get('/login', (req,res)=>{
  res.render('login.ejs')
})

app.get('/register', (req,res)=>{
  res.render('register.ejs')
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/login-failure', successRedirect: 'login-success' }))

app.post('/register', (req, res, next) => {
  const saltHash = genPassword(req.body.password);
  
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username:req.body.username,
    salt: salt,
    hashedPassword:hash
  })

  newUser.save()
      .then((user) => {
          console.log(user);
      });

  res.redirect('/login');
});

app.get('/login-success', isAuth, (req, res, next) => {
  res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
});

app.get('/login-failure', (req, res, next) => {
  res.send('Wrong user credentials');
});

app.get('/protected-route', isAuth, (req, res, next) => {
  res.send('You made it to the route.');
});

app.get('/logout', (req, res, next) => {
  req.logout((err)=>{
    if(err) return next(err)
    else res.redirect('/login');
  });
});


// post and comment routes ------------------------------------------------------------


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
