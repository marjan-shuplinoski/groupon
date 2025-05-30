import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Signup user or merchant
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {

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
    return res.status(201).json({ message: 'signed up' });
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
    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    return res.json({ message: 'logged', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
