const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser,
  searchPosts,
  createComment, // 1. Import the createComment function
} = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');

// Routes for '/api/posts'
router.route('/').post(protect, createPost).get(getAllPosts);

// Search and User-specific routes
router.get('/search/:keyword', searchPosts);
router.get('/user/:userId', getPostsByUser);

// Routes for a specific post by ID ('/:id')
router
  .route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// 2. Add the route for creating a comment on a specific post
router.route('/:id/comments').post(protect, createComment);

module.exports = router;