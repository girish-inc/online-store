const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  refreshToken,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Refresh token
router.post('/refresh-token', refreshToken);

// User profile routes (protected)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;