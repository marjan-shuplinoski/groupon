import express from 'express';
import { dashboard, profile } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { userOnly } from '../middleware/user.js';
const router = express.Router();

// @route   GET /api/user/dashboard
// @desc    User dashboard
// @access  Private (user)
router.get('/dashboard', authenticate, userOnly, dashboard);

// @route   GET /api/user/profile
// @desc    User profile
// @access  Private (user)
router.get('/profile', authenticate, userOnly, profile);

export default router;
