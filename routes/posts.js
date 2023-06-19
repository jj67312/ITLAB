const express = require('express');
const router = express.Router();

const posts = require('../controllers/posts');

router.get('/', posts.getAllPosts);
router.post('/', posts.createPost);
router.get('/new', posts.renderNewForm);
router.post('/like/:postId', posts.likePost);
router.post('/dislike/:postId', posts.dislikePost);
router.put('/:id', posts.updatePost);
router.delete('/:id', posts.deletePost);
router.get('/:id', posts.getSinglePost);

module.exports = router;
