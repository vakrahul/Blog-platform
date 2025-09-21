const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  getPostsByUser,
} = require('../controllers/user.controller');

// Public routes for viewing profiles and posts
router.get('/:id', getUserProfile);
router.get('/:id/posts', getPostsByUser);

module.exports = router;