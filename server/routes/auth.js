import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user or merchant
// @access  Public
router.post('/login', login);


// @route   POST /api/auth/register
// @desc    Register user or merchant
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private

// Protected routes (require authentication)
router.post('/logout', authenticate, logout);

// @route   GET /api/auth/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', authenticate, getMe);

export default router;
