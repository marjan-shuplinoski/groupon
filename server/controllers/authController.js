import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register user or merchant
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {

  try {
    const { name, address, email, password, repeatPassword, role } = req.body;
    // Basic validation
    if (!name || !email || !password || !repeatPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== repeatPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'email exists' });
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create user
    const user = new User({
      name,
      address,
      email,
      password: hashedPassword,
      role: role || 'user'
    });
    await user.save();
    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = (req, res) => {
  // If using cookies for JWT, clear the cookie
  res.clearCookie('token');
  return res.json({ message: 'logged out' });
};

// @desc    Login user or merchant
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (user.isBanned) {
      return res.status(403).json({ message: 'This account is banned. Please contact support.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT
    const payload = { 
      id: user._id, 
      email: user.email, 
      role: user.role,
      name: user.name,
      isEmailVerified: user.isEmailVerified
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    return res.json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user's profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    // Get user from the request object (set by auth middleware)
    const user = req.user;
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user data (excluding sensitive information like password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    
    return res.json(userData);
  } catch (err) {
    console.error('Get me error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
