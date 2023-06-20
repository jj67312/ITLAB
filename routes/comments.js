const express = require('express');
const router = express.Router();
const comments = require('../controllers/comments');

router.post('/:id', comments.createComment);
// router.delete('/:id', comments.deleteComment);
router.post('/like/:commentId', comments.likeComment);
router.post('/dislike/:commentId', comments.dislikeComment);

module.exports = router;
