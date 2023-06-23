const express = require('express');
const router = express.Router();
const users = require('../controllers/user');

const alreadyLoggedIn = require('../authMiddleware').alreadyLoggedIn;
const isAuth = require('../authMiddleware').isAuth;

router.get('/', alreadyLoggedIn, users.renderHomePage)
router.get('/login', alreadyLoggedIn, users.renderLoginPage);
router.get('/register', alreadyLoggedIn, users.renderRegisterPage);
router.get('/users/:id', isAuth, users.getUserProfile);

module.exports = router;
