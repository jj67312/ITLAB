const express = require('express');
const app = express();

const passport = require('passport');

const genPassword = require('./utils').genPassword;
const { check, validationResult } = require('express-validator');
const validator = require('validator');

const isAuth = require('./authMiddleware').isAuth;

app.use(express.urlencoded({ extended: true }));

// Database connection
require('./config/database');

// Session store
const session = require('express-session');
const flash = require('connect-flash');

const MongoStore = require('connect-mongo');
const sessionStore = new MongoStore({
  collectionName: 'sessions',
  mongoUrl: 'mongodb://127.0.0.1:27017/bitbotDB',
});

app.use(
  session({
    secret: 'jvdbvjdiv',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1min
    },
  })
);
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

// Google auth
require('./config/passportGoogle')(passport);

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  // console.log(req.
  next();
});

//ejssession);
// console.log(req.user);
app.set('view-engine', 'ejs');

//static
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));

//models
const postModel = require('./models/Post');
const User = require('./models/User');

// login and register routes --------------------

app.get('/login', (req, res) => {
  res.render('login.ejs', { message: req.flash('error_msg') });
});

app.get('/register', (req, res) => {
  res.render('register.ejs', { message: req.flash('error_msg') });
});

app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/forums',
  })
);

app.post(
  '/register',
  // check('password', 'Password is weak').isAlphanumeric().isLength({ min: 8 }),
  // check('email', 'Incorrect email format').isEmail(),
  (req, res, next) => {
    // if(!username || !password || !email){
    //   req.flash('error_msg', 'Enter all fields')
    //   res.redirect('/register')
    // }
    // if(!validator.isEmail(email)){
    //   req.flash('error_msg', 'Incorrect email format')
    //   res.redirect('/register')
    // }
    // if(!validator.isStrongPassword(req.body.password)){
    //   req.flash('error_msg', 'Weak Password')
    //   res.redirect('/register')
    // }
    User.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          // req.flash('error_msg', 'User already exists');
          res.redirect('/register');
        } else {
          const errors = validationResult(req);

          console.log(errors);
          if (!errors.isEmpty()) {
            const alert = errors.array();
            // req.flash('error_msg', { alert });
            res.redirect('/register');
          } else {
            const saltHash = genPassword(req.body.password);

            const salt = saltHash.salt;
            const hash = saltHash.hash;

            const newUser = new User({
              username: req.body.username,
              email: req.body.email,
              googleId: null,
              salt: salt,
              hashedPassword: hash,
            });

            newUser.save().then((user) => {
              console.log(user);
            });

            res.redirect('/login');
          }
        }
      })
      .catch((err) => {
        next(err);
      });
  }
);

app.get('/home', (req, res) => {
  res.render('landing.ejs');
});

app.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/forums',
  }),
  (req, res) => {
    //res.redirect('/login-success')
  }
);

app.get('/login-success', isAuth, (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

app.get('/login-failure', (req, res, next) => {
  res.send('Wrong user credentials');
});

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    else res.redirect('/login');
  });
});

app.get('/allTitles', async (req, res) => {
  const allCamps = await postModel.find({});
  const campTitles = allCamps.map((camp) => camp.title);
  res.json({ campTitles });
});

app.post('/allTitles', async (req, res) => {
  const { campTitle } = req.body;
  console.log(campTitle);
  const camp = await postModel.findOne({ title: campTitle });
  if (camp === null) {
    res.redirect('/forums');
  } else {
    res.redirect(`/forums/${camp._id}`);
  }
});

// post and comment routes ------------------------------------------------------------

// get all posts
app.get('/forums', async (req, res) => {
  const allPosts = await postModel.find({}).populate('author');
  const userId = req.user._id;
  const user = await User.findById(userId);

  // const allPosts = await postModel.find();
  const allComments = await commentModel.find();

  let userPosts = [];
  let userComments = [];

  for (let post of allPosts) {
    if (post.author.equals(user._id)) {
      userPosts.push(post);
    }
  }

  for (let comment of allComments) {
    console.log(comment);
    if (comment.author.equals(user._id)) {
      userComments.push(comment);
    }
  }

  for (let comment of userComments) {
    comment.populate('postId');
  }
  // console.log(allPosts);
  // res.json(allPosts);
  res.render('forums.ejs', { allPosts, userPosts, userComments });
});

app.get('/test/forums', async (req, res) => {
  const allPosts = await postModel.find({}).populate('author');
  res.json(allPosts);
});

app.get('/forums/new', async (req, res) => {
  res.render('newForum.ejs');
});

// get specified forums
app.get('/forums/:id', async (req, res) => {
  const post = await postModel
    .findById(req.params.id)
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  // const postAuthor = await User.findById(post.author);
  res.render('comments.ejs', { post });
});

app.get('/test/forums/:id', async (req, res) => {
  const post = await postModel.findById(req.params.id).populate('comments');
  res.json(post);
});

// create new post
app.post('/', async (req, res) => {
  const newPost = req.body;
  console.log('Current user:');
  console.log(req.user);
  const currUserId = req.user._id;
  const post = await postModel.create(newPost);
  post.author = currUserId;
  await post.save();
  res.redirect('/forums');
  // res.json(newPost);
});

app.post('/test', async (req, res) => {
  const newPost = req.body;
  // console.log('Current user:');
  // console.log(req.user);
  // const currUserId = req.user._id;
  const post = await postModel.create(newPost);
  // post.author = currUserId;
  await post.save();
  // res.redirect('/forums');
  res.json(newPost);
});

// for deleting post:
app.delete('/:id', async (req, res) => {
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
});

app.delete('/test/:id', async (req, res) => {
  const postId = req.params.id;
  const post = await postModel
    .findById(postId)
    .then((data) => {
      postModel.deleteOne(data);
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(404).send('Failed to delete');
    });
  res.json(post);
  // res.redirect('/forums');
});

// update data:
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
  res.json(post);
});

// Profile
app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  const allPosts = await postModel.find();
  const allComments = await commentModel.find();
  // console.log(user);
  // console.log(allPosts);
  // console.log(allComments);

  let userPosts = [];
  let userComments = [];

  for (let post of allPosts) {
    if (post.author.equals(user._id)) {
      userPosts.push(post);
    }
  }

  for (let comment of allComments) {
    console.log(comment);
    if (comment.author.equals(user._id)) {
      userComments.push(comment);
    }
  }

  for (let comment of userComments) {
    comment.populate('postId');
  }

  console.log(userComments);
  console.log(userPosts);

  res.render('profile.ejs', { userComments, userPosts, user });
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
  newComment.author = req.user._id;
  newComment.postId = currPost._id;

  console.log(newComment);

  await newComment.save();
  await currPost.save();
  // res.send(currPost);
  res.redirect(`/forums/${postID}`);
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

// web scraping
const axios = require('axios');
const cheerio = require('cheerio');

// // "samsung" "oneplus" "vivo" "oppo"
// const brand = 'xiaomi';

//const url ='https://www.91mobiles.com/' + brand + '-mobile-price-list-in-india';

const webCrawler = require('./utils');

urlTag = '.btn_prcList_sn flt-rt target_link_external impressions_gts';
app.get('/market', async (req, res) => {
  let ans, ans2;
  let finalData = [];
  const predecessor = 'https://www.91mobiles.com';
  const url2 = 'https://www.91mobiles.com/top-10-mobiles-in-india';
  ans = await webCrawler.crawlData(url2);
  console.log(ans);
  for (let j = 0; j < 12; j++) {
    ans2 = await webCrawler.scrapeData(
      predecessor + ans[j],
      '.overview_lrg_pic_img',
      '.h1_pro_head',
      '.store_prc',
      '.btn_prcList_sn.flt-rt.target_link_external.impressions_gts'
    );
    //console.log(ans2);
    finalData.push(ans2);
  }
  console.log(finalData);
  res.render('market.ejs', { finalData });
});

// news
// const NewsAPI = require('newsapi');
// const api_key = "eadeccef94e442f69bb28a13ed8b6975"
// const newsapi = new NewsAPI(api_key)

app.get('/news', async (req, res) => {
  res.render('news.ejs');
  // newsapi.v2.topHeadlines({
  //   category: 'technology',
  //   language: 'en'
  // })
  // .then(data=>{
  //   res.render('news.ejs' , {articles: data.articles})
  // })
  // .catch(err => {console.log(err);})
});

app.listen(3000, (req, res) => {
  console.log('ITLAB');
});

module.exports = app;

// If using ejs

// Refer https://dev.to/atultyagi612/build-a-news-app-with-nodejs-express-ejs-and-newsapi-140f