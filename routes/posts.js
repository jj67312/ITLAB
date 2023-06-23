const express = require('express');
const router = express.Router();
const isAuth = require('../authMiddleware').isAuth;

const posts = require('../controllers/posts');

router.get('/', isAuth, posts.getAllPosts);
router.post('/', isAuth, posts.createPost);
router.get('/new', isAuth, posts.renderNewForm);
router.post('/like/:postId', isAuth, posts.likePost);
router.post('/dislike/:postId', isAuth, posts.dislikePost);
router.put('/:id', isAuth, posts.updatePost);
router.delete('/:id', isAuth, posts.deletePost);
router.get('/:id', isAuth, posts.getSinglePost);

module.exports = router;
