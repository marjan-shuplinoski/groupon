import Merchant from '../models/Merchant.js';
import Deal from '../models/Deal.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register merchant
// @route   POST /api/merchant/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { email, password, repeatPassword, businessName, logo, contactInfo } = req.body;
    if (!email || !password || !repeatPassword || !businessName) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== repeatPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const existing = await Merchant.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'email exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const merchant = new Merchant({
      email,
      password: hashedPassword,
      businessName,
      logo,
      contactInfo
    });
    await merchant.save();
    return res.status(201).json({ message: 'merchant registered' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Merchant dashboard (basic info)
// @route   GET /api/merchant/dashboard
// @access  Private (merchant)
export const dashboard = async (req, res) => {
  // Placeholder: In real app, use req.user.id from JWT and aggregate stats
  res.json({ message: 'merchant dashboard', stats: { totalDeals: 0, totalRedemptions: 0 } });
};

// @desc    Merchant profile
// @route   GET /api/merchant/profile
// @access  Private (merchant)
export const profile = async (req, res) => {
  // Placeholder: In real app, use req.user.id from JWT
  res.json({ message: 'merchant profile' });
};

// @desc    Merchant login
// @route   POST /api/merchant/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const merchant = await Merchant.findOne({ email });
    if (!merchant) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, merchant.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const payload = { id: merchant._id, email: merchant.email, role: merchant.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ message: 'logged', token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Deal CRUD
export const createDeal = async (req, res) => {
  try {
    const { title, description, price, discount, terms, expiry, status } = req.body;
    const deal = new Deal({
      title,
      description,
      price,
      discount,
      terms,
      expiry,
      status,
      merchant: req.user.id
    });
    await deal.save();
    return res.status(201).json({ message: 'deal created', deal });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getDeals = async (req, res) => {
  try {
    const deals = await Deal.find({ merchant: req.user.id });
    return res.json({ deals });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getDeal = async (req, res) => {
  try {
    const deal = await Deal.findOne({ _id: req.params.id, merchant: req.user.id });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    return res.json({ deal });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateDeal = async (req, res) => {
  try {
    const deal = await Deal.findOneAndUpdate(
      { _id: req.params.id, merchant: req.user.id },
      req.body,
      { new: true }
    );
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    return res.json({ message: 'deal updated', deal });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findOneAndDelete({ _id: req.params.id, merchant: req.user.id });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    return res.json({ message: 'deal deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
