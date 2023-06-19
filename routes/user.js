const express = require('express');
const router = express.Router();
const users = require('../controllers/user');

router.get('/', users.renderHomePage)
router.get('/login', users.renderLoginPage);
router.get('/register', users.renderRegisterPage);
router.get('/users/:id', users.getUserProfile);

module.exports = router;
