const express = require('express');
const app = express();

const passport = require('passport');
const genPassword = require('./utils').genPassword;
const validator = require('validator');

const isAuth = require('./authMiddleware').isAuth;
const alreadyLoggedIn = require('./authMiddleware').alreadyLoggedIn;
const dotenv = require('dotenv');
const configurations = require('./configuration');

app.use(express.urlencoded({ extended: true }));

// Database connection
require('./config/database');

// Session store
const session = require('express-session');
const flash = require('connect-flash');

const MongoStore = require('connect-mongo');
const sessionStore = new MongoStore({
  collectionName: 'sessions',
  mongoUrl: configurations.DB_URL,
});

app.use(
  session({
    secret: configurations.SECRET,
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

app.post('/login', alreadyLoggedIn, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/forums',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
});

app.post('/register', alreadyLoggedIn, (req, res, next) => {
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
    req.flash(
      'error_msg',
      'Enter a strong password with numbers, symbols, small and capital letters.'
    );
    return res.redirect('/register');
  }

  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        req.flash('error_msg', 'User already exists');
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

        newUser.save();
        res.redirect('/login');
      }
    })
    .catch((err) => {
      next(err);
    });
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
  })
);

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
const webCrawler = require('./utils');

urlTag = '.btn_prcList_sn flt-rt target_link_external impressions_gts';
app.get('/market', isAuth, async (req, res) => {
  const predecessor = configurations.PRODUCTS_URL;

  // mobiles
  let mobileUrls;
  let mobileData = [];
  const mobile_url = configurations.MOBILE_URL;
  mobileUrls = await webCrawler.crawlData(mobile_url);
  for (let j = 0; j < 12; j++) {
    mobileItem = await webCrawler.scrapeData(
      predecessor + mobileUrls[j],
      '.overview_lrg_pic_img',
      '.h1_pro_head',
      '.store_prc',
      '.btn_prcList_sn.flt-rt.target_link_external.impressions_gts'
    );
    mobileData.push(mobileItem);
  }

  //laptops
  let laptopUrls;
  let laptopData = [];
  const laptop_url = configurations.LAPTOP_URL;
  laptopUrls = await webCrawler.crawlData(laptop_url);
  for (let j = 0; j < 12; j++) {
    laptopItem = await webCrawler.scrapeData(
      predecessor + laptopUrls[j],
      '.overview_lrg_pic_img',
      '.h1_pro_head',
      '.store_prc',
      '.btn_prcList_sn.flt-rt.target_link_external.impressions_gts'
    );
    laptopData.push(laptopItem);
  }

  //tablets
  let tabletUrls;
  let tabletData = [];
  const tablet_url = configurations.TABLET_URL;
  tabletUrls = await webCrawler.crawlData(tablet_url);
  for (let j = 0; j < 10; j++) {
    tabletItem = await webCrawler.scrapeData(
      predecessor + tabletUrls[j],
      '.overview_lrg_pic_img',
      '.h1_pro_head',
      '.store_prc',
      '.btn_prcList_sn.flt-rt.target_link_external.impressions_gts'
    );
    tabletData.push(tabletItem);
  }

  //cameras
  let cameraUrls;
  let cameraData = [];
  const camera_url = configurations.CAMERA_URL;
  cameraUrls = await webCrawler.crawlData(camera_url);
  for (let j = 0; j < 12; j++) {
    cameraItem = await webCrawler.scrapeData(
      predecessor + cameraUrls[j],
      '.overview_lrg_pic_img',
      '.h1_pro_head',
      '.store_prc',
      '.btn_prcList_sn.flt-rt.target_link_external.impressions_gts'
    );
    cameraData.push(cameraItem);
  }

  res.render('market.ejs', { mobileData, laptopData, tabletData, cameraData });
});

app.get('/news', isAuth, async (req, res) => {
  const getData = async () => {
    const options = {
      method: 'GET',
      url: `${configurations.NEWS_URL}&apiKey=${configurations.NEWS_API_KEY}`,
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
  // console.log(newsData)
  res.render('news.ejs', {newsData});
});

app.listen(3000, (req, res) => {
  console.log('BitBot running...');
});

module.exports = app;
