const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error('User already exists');
  }

  // 2. Create the new user
  // (The password will be automatically hashed by the 'pre-save' hook in your User.js model)
  const user = await User.create({
    name,
    email,
    password,
  });

  // 3. If user was created, send back user data and a token
  if (user) {
    res.status(201).json({ // 201 = Created
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user by email
  const user = await User.findOne({ email });

  // 2. Check if the user exists AND if the password matches
  if (user && (await user.matchPassword(password))) {
    // 3. If they match, send back the user data and a new token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } else {
    // 4. If not, send an 'Unauthorized' error
    res.status(401);
    throw new Error('Invalid email or password');
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

  // Check if the logged-in user is the author of the post
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(401); // Unauthorized
    throw new Error('User not authorized');
  }

  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the modified document
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

  // Check if the logged-in user is the author of the post
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await post.deleteOne();

  res.json({ message: 'Post removed' });
});

// Export both functions
module.exports = {
  registerUser,
  loginUser,
};