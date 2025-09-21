const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // No two users can have the same email
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: '', // Default value for optional fields
    },
    profilePicture: {
      type: String,
      default: '',
    },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
  },
  {
    // Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true, 
  }
);

// --- Mongoose Middleware to Hash Password ---
// This function will run *before* a document is saved to the database
userSchema.pre('save', async function (next) {
  // 'this' refers to the user document being saved
  
  // Only hash the password if it's new or has been modified
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a 'salt' for hashing
  const salt = await bcrypt.genSalt(10);
  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Custom Method to Compare Passwords ---
// We'll use this later in our login route
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' is the hashed password from the database
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;