const Post = require('../models/Post');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Create a new post
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = asyncHandler(async (req, res) => {
  const { title, content, tags, imageUrl } = req.body;
  if (!title || !content) {
    res.status(400);
    throw new Error('Please add a title and content');
  }
  const post = await Post.create({
    title,
    content,
    tags,
    imageUrl,
    author: req.user._id,
  });
  res.status(201).json(post);
});

/**
 * @desc    Search posts by title
 * @route   GET /api/posts/search/:keyword
 * @access  Public
 */
const searchPosts = asyncHandler(async (req, res) => {
  const keyword = req.params.keyword
    ? {
        title: {
          $regex: req.params.keyword,
          $options: 'i',
        },
      }
    : {};
  const posts = await Post.find({ ...keyword }).populate('author', 'name');
  res.json(posts);
});

/**
 * @desc    Fetch all posts (with pagination)
 * @route   GET /api/posts
 * @access  Public
 */
const getAllPosts = asyncHandler(async (req, res) => {
  const pageSize = 8; // Show 8 posts per page
  const page = Number(req.query.pageNumber) || 1;

  const count = await Post.countDocuments();
  const posts = await Post.find({})
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ posts, page, pages: Math.ceil(count / pageSize) });
});

/**
 * @desc    Fetch a single post by ID
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name');
  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updatedPost);
});

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }
  await post.deleteOne();
  res.json({ message: 'Post removed' });
});

/**
 * @desc    Get all posts by a user
 * @route   GET /api/posts/user/:userId
 * @access  Public
 */
const getPostsByUser = asyncHandler(async (req, res) => {
  const posts = await Post.find({ author: req.params.userId }).populate('author', 'name');
  res.json(posts);
});

/**
 * @desc    Create a new comment
 * @route   POST /api/posts/:id/comments
 * @access  Private
 */
const createComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const post = await Post.findById(req.params.id);

  if (post) {
    const comment = {
      text,
      name: req.user.name,
      user: req.user._id,
    };
    post.comments.push(comment);
    await post.save();
    res.status(201).json({ message: 'Comment added' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser,
  searchPosts,
  createComment,
};