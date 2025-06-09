import express from 'express';
import { dashboard, profile } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { userOnly } from '../middleware/user.js';
import User from '../models/User.js'; // Import User model
const router = express.Router();

// @route   GET /api/user/dashboard
// @desc    User dashboard
// @access  Private (user)
router.get('/dashboard', authenticate, userOnly, dashboard);

// @route   GET /api/user/profile
// @desc    User profile
// @access  Private (user)
router.get('/profile', authenticate, userOnly, profile);

// @route   GET /api/users/me/claimed
// @desc    Get claimed deals for current user
// @access  Private (user)
router.get('/me/claimed', authenticate, userOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('claimedDeals');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ deals: user.claimedDeals });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/me/favorited
// @desc    Get favorited deals for current user
// @access  Private (user)
router.get('/me/favorited', authenticate, userOnly, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedDeals');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ deals: user.savedDeals });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
