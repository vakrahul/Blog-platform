const mongoose = require('mongoose');

// 1. Define the schema for a single comment first.
const commentSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

// 2. Now define the schema for a post.
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    imageUrl: {
      type: String,
      required: false,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Now you can correctly include the comments array.
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;