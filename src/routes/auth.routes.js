const express = require('express');
const router = express.Router();

// Import both functions from the controller
const { registerUser, loginUser } = require('../controllers/auth.controller');

// Define the routes
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;