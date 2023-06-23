const express = require('express');
const router = express.Router();
const comments = require('../controllers/comments');
const isAuth = require('../authMiddleware').isAuth;

router.post('/:id', isAuth, comments.createComment);
// router.delete('/:id', comments.deleteComment);
router.post('/like/:commentId', isAuth, comments.likeComment);
router.post('/dislike/:commentId', isAuth, comments.dislikeComment);

module.exports = router;
