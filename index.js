const express = require('express');
const app = express();

const passport = require('passport');

const genPassword = require('./utils').genPassword;

const isAuth = require('./authMiddleware').isAuth;

app.use(express.urlencoded({ extended: true }));

// Database connection
require('./config/database');

// Session store
const session = require('express-session');

const MongoStore = require('connect-mongo');
const sessionStore = new MongoStore({
  collectionName: 'sessions',
  mongoUrl: 'mongodb://localhost:27017/itlab',
});

app.use(
  session({
    secret: 'jvdbvjdiv',
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60, // 1min
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

// Google auth
require('./config/passportGoogle')

app.use((req, res, next) => {
  // console.log(req.session);
  // console.log(req.user);
  next();
});

//ejs
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
  res.render('login.ejs');
});

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: '/login-success',
  })
);

app.post('/register', (req, res, next) => {
  const saltHash = genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.username,
    salt: salt,
    hashedPassword: hash,
  });

  newUser.save().then((user) => {
    console.log(user);
  });

  res.redirect('/home');
});

app.get('/home', (req, res) => {
  res.render('landing.ejs');
});

<<<<<<< HEAD
app.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}))

app.get('/google/callback', passport.authenticate('google', {failureRedirect:'/login-failure', successRedirect:'/login-success'}), (req,res)=>{
  //res.redirect('/login-success')
})

app.get('/login-success', isAuth, (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

app.get('/login-failure', isAuth, (req, res, next) => {
  res.send('Wrong user credentials');
});

app.get('/protected-route', isAuth, (req, res, next) => {
  res.send('You made it to the route.');
});

=======
>>>>>>> cac9009d020353d8aeae2168c475d096787f1bc2
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    else res.redirect('/login');
  });
});

// post and comment routes ------------------------------------------------------------

// get all posts
app.get('/forums', async (req, res) => {
  const allPosts = await postModel.find({});
  // console.log(allPosts);
  res.json(allPosts);
  // res.render('forums.ejs', { allPosts });
});

app.get('/forums/new', async (req, res) => {
  res.render('newForum.ejs');
});

// get specified forums
app.get('/forums/:id', async (req, res) => {
  const post = await postModel.findById(req.params.id).populate('comments');
  res.send(post);
});

// create new post
app.post('/', async (req, res) => {
  const newPost = req.body;
  const post = await postModel.create(newPost);
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

// web scraping
<<<<<<< HEAD
const axios = require('axios')
const cheerio = require('cheerio');
const { Strategy } = require('passport-local');
=======
const axios = require('axios');
const cheerio = require('cheerio');
>>>>>>> cac9009d020353d8aeae2168c475d096787f1bc2

// "samsung" "oneplus" "vivo" "oppo"
const brand = 'xiaomi';

<<<<<<< HEAD
// mobile urls
const url = "https://www.91mobiles.com/"+ brand +"-mobile-price-list-in-india"
const url2 ="https://www.amazon.in/Apple-iPhone-14-256GB-Midnight/dp/B0BDJ6N5D6/?_encoding=UTF8&pd_rd_w=DsMoj&content-id=amzn1.sym.1f592895-6b7a-4b03-9d72-1a40ea8fbeca&pf_rd_p=1f592895-6b7a-4b03-9d72-1a40ea8fbeca&pf_rd_r=YWHCYMEK8FBTP8HDXE0D&pd_rd_wg=2bLli&pd_rd_r=c80153b8-a457-45cd-a521-7066673fdd7a&ref_=pd_gw_ci_mcx_mr_hp_atf_m"
const laptopBrand =""
// laptop urls
const laptopUrl = "https://www.91mobiles.com/hp-laptops-price-list-in-india"
=======
const url =
  'https://www.91mobiles.com/' + brand + '-mobile-price-list-in-india';
>>>>>>> cac9009d020353d8aeae2168c475d096787f1bc2

const products = [];
const titles = [];
const prices = [];

<<<<<<< HEAD
app.get('/products', (req,res)=>{
    //res.send("hello")
    axios(url)
    .then(resp =>{
        const html = resp.data
        //console.log(html);
        //res.send(html)
        const $ = cheerio.load(html)
        $('.finder_pro_image', html).each(function (){
            //console.log($(this));
            const link = $(this).attr('src')
            //const title = $(this).text()
            products.push(link)
        })
        $('.hover_blue_link', html).each(function(){
            const title = $(this).text().replace('\n                                 ', '').replace('                             ','')
            titles.push(title)
        })
        $('.price', html).each(function(){
            const price = $(this).text().replace('\n\t\t\t\t\t\n\t\t\t\t\t','')
            prices.push(price)
        })
        res.json({products:products, titles:titles, prices:prices})
        // console.log(products);
        // console.log(titles);
        // console.log(prices);
=======
app.get('/products', (req, res) => {
  res.send('hello');
  axios(url)
    .then((resp) => {
      const html = resp.data;
      //console.log(html);
      //res.send(html)
      const $ = cheerio.load(html);
      $('.finder_pro_image', html).each(function () {
        //console.log($(this));
        const link = $(this).attr('src');
        //const title = $(this).text()
        products.push(link);
      });
      $('.hover_blue_link', html).each(function () {
        const title = $(this).text().replace('\n', '');
        titles.push(title);
      });
      $('.price', html).each(function () {
        const price = $(this).text();
        prices.push(price);
      });
      console.log(products);
      console.log(titles);
      console.log(prices);
>>>>>>> cac9009d020353d8aeae2168c475d096787f1bc2
    })
    .catch((err) => {
      console.log(err);
    });
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
