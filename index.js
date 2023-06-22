const express = require('express');
const app = express();

const passport = require('passport');

const genPassword = require('./utils').genPassword;
//const { check, validationResult } = require('express-validator');
const validator = require('validator');

const isAuth = require('./authMiddleware').isAuth;
const isLoggedIn = require('./authMiddleware').isLoggedIn;

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
  next();
});

app.set('view-engine', 'ejs');

//static
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'static')));

//models
const postModel = require('./models/Post');
const User = require('./models/User');

// ROUTES
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/user');
app.use('/forums', postRoutes);
app.use('/comments', commentRoutes);
app.use('/', userRoutes);

// login and register routes --------------------

app.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/forums',
    failureRedirect:'/login',
    failureFlash:true
  })(req,res,next);
})

app.post(
  '/register', (req, res, next) => {
    const { username, password, email } = req.body;
    
    if (!username || !password || !email) {
      req.flash('error_msg', 'Enter all fields');
      return res.redirect('/register');
    }

    if (!validator.isEmail(email)) {
      req.flash('error_msg', 'Incorrect email format');
      return res.redirect('/register');
    }

    if (!validator.isStrongPassword(req.body.password)) {
      req.flash('error_msg', 'Enter a strong password with numbers, symbols, small and capital letters.');
      return res.redirect('/register');
    }

    User.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          req.flash('error_msg', 'User already exists');
          res.redirect('/register');
        }
        else {
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

          newUser.save();
          res.redirect('/login');
        }
      })
      .catch((err) => {
        next(err);
      });
  }
);

app.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/forums',
  }));

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
  const camp = await postModel.findOne({ title: campTitle });
  if (camp === null) {
    res.redirect('/forums');
  } else {
    res.redirect(`/forums/${camp._id}`);
  }
});

// Comments -------------------

// web scraping
const axios = require('axios');
const cheerio = require('cheerio');

//const url ='https://www.91mobiles.com/' + brand + '-mobile-price-list-in-india';

const webCrawler = require('./utils');

urlTag = '.btn_prcList_sn flt-rt target_link_external impressions_gts';
app.get('/market', async (req, res) => {
  let ans, ans2;
  let finalData = [];
  const predecessor = 'https://www.91mobiles.com';
  const url2 = 'https://www.91mobiles.com/top-10-mobiles-in-india';
  ans = await webCrawler.crawlData(url2);
  for (let j = 0; j < 12; j++) {
    ans2 = await webCrawler.scrapeData(
      predecessor + ans[j],
      '.overview_lrg_pic_img',
      '.h1_pro_head',
      '.store_prc',
      '.btn_prcList_sn.flt-rt.target_link_external.impressions_gts'
    );
    finalData.push(ans2);
  }
  res.render('market.ejs', { finalData });
});

// news
// const NewsAPI = require('newsapi');
// const api_key = "eadeccef94e442f69bb28a13ed8b6975"
// const newsapi = new NewsAPI(api_key)

app.get('/news', async (req, res) => {
  res.render('news.ejs');
});

app.listen(3000, (req, res) => {
  console.log('ITLAB');
});

module.exports = app;

// If using ejs

// Refer https://dev.to/atultyagi612/build-a-news-app-with-nodejs-express-ejs-and-newsapi-140f
