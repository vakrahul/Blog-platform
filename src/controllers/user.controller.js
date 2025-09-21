const User = require('../models/User');
const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get user profile
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Get all posts by a specific user
 * @route   GET /api/users/:id/posts
 * @access  Public
 */
const getPostsByUser = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.params.id }).populate(
    'author',
    'name'
  );
  res.json(posts);
});

module.exports = {
  getUserProfile,
  getPostsByUser,
};