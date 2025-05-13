import express from 'express';
import { signup, login, logout } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login user or merchant
// @access  Public
router.post('/login', login);


// @route   POST /api/auth/signup
// @desc    Signup user or merchant
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private

router.post('/logout', logout);

export default router;
