import User from '../models/User.js';
import Deal from '../models/Deal.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register merchant
// @route   POST /api/merchant/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, address, email, password, repeatPassword, businessName, logo, contactInfo } = req.body;
    if (!name || !email || !password || !repeatPassword || !businessName) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (password !== repeatPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const existing = await User.findOne({ email, role: 'merchant' });
    if (existing) {
      return res.status(409).json({ message: 'email exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const merchant = new User({
      name,
      address,
      email,
      password: hashedPassword,
      role: 'merchant',
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

// @desc    Merchant dashboard (stats + deal info)
// @route   GET /api/merchant/dashboard
// @access  Private (merchant)
export const dashboard = async (req, res) => {
  try {
    const merchant = await User.findById(req.user.id);
    if (!merchant || merchant.role !== 'merchant') {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    // Get all deals for this merchant
    const deals = await Deal.find({ merchant: merchant._id });
    let totalClaimed = 0;
    const dealStats = await Promise.all(
      deals.map(async (deal) => {
        const claimedCount = await User.countDocuments({ claimedDeals: deal._id });
        const favoritedCount = await User.countDocuments({ savedDeals: deal._id });
        totalClaimed += claimedCount;
        return {
          id: deal._id,
          title: deal.title,
          status: deal.status,
          claimedCount,
          favoritedCount
        };
      })
    );
    res.json({
      totalDeals: deals.length,
      totalClaimed,
      deals: dealStats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Merchant profile
// @route   GET /api/merchant/profile
// @access  Private (merchant)
export const profile = async (req, res) => {
  try {
    const merchant = await User.findById(req.user.id);
    if (!merchant || merchant.role !== 'merchant') {
      return res.status(404).json({ message: 'Merchant not found' });
    }
    // Get all deals for this merchant
    const deals = await Deal.find({ merchant: merchant._id });
    // For each deal, count how many users have claimed/favorited it
    const dealStats = await Promise.all(
      deals.map(async (deal) => {
        const claimedCount = await User.countDocuments({ claimedDeals: deal._id });
        const favoritedCount = await User.countDocuments({ savedDeals: deal._id });
        return {
          id: deal._id,
          title: deal.title,
          status: deal.status,
          claimedCount,
          favoritedCount
        };
      })
    );
    res.json({
      name: merchant.name,
      address: merchant.address,
      email: merchant.email,
      businessName: merchant.businessName,
      logo: merchant.logo,
      contactInfo: merchant.contactInfo,
      createdAt: merchant.createdAt,
      deals: dealStats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
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
    const merchant = await User.findOne({ email, role: 'merchant' });
    if (!merchant) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (merchant.isBanned) {
      return res.status(403).json({ message: 'This merchant account is banned. Please contact support.' });
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
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required.' });
    }
    
    if (!description) {
      return res.status(400).json({ message: 'Description is required.' });
    }
    
    if (!price) {
      return res.status(400).json({ message: 'Price is required.' });
    }
    
    if (!discount) {
      return res.status(400).json({ message: 'Discount is required.' });
    }
    
    if (!terms) {
      return res.status(400).json({ message: 'Terms are required.' });
    }
    
    if (!expiry) {
      return res.status(400).json({ message: 'Expiry date is required.' });
    }
    
    // Validate data types and values
    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({ message: 'Price must be a positive number.' });
    }
    
    if (typeof discount !== 'number' || discount <= 0) {
      return res.status(400).json({ message: 'Discount must be a positive number.' });
    }
    
    // Validate status
    if (status && !['published', 'draft', 'expired'].includes(status)) {
      return res.status(400).json({ message: 'Status must be published, draft, or expired.' });
    }
    
    // Create deal with only the fields defined in the model
    const deal = new Deal({
      title,
      description,
      price,
      discount,
      terms,
      expiry,
      status: status || 'draft', // Default to draft if not provided
      merchant: req.user.id
    });
    
    await deal.save();
    return res.status(201).json({ message: 'Deal created successfully.', deal });
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
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
    // Get the existing deal first
    const existingDeal = await Deal.findOne({ _id: req.params.id, merchant: req.user.id });
    if (!existingDeal) return res.status(404).json({ message: 'Deal not found' });
    
    // Extract only the fields that are in the Deal model
    const { title, description, price, discount, terms, expiry, status } = req.body;
    
    // Create an update object with only valid fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      if (typeof price !== 'number' || price <= 0) {
        return res.status(400).json({ message: 'Price must be a positive number' });
      }
      updateData.price = price;
    }
    if (discount !== undefined) {
      if (typeof discount !== 'number' || discount <= 0) {
        return res.status(400).json({ message: 'Discount must be a positive number' });
      }
      updateData.discount = discount;
    }
    if (terms !== undefined) updateData.terms = terms;
    if (expiry !== undefined) updateData.expiry = expiry;
    if (status !== undefined) {
      if (!['published', 'draft', 'expired'].includes(status)) {
        return res.status(400).json({ message: 'Status must be published, draft, or expired' });
      }
      updateData.status = status;
    }
    
    // Update the deal with validated data
    const deal = await Deal.findOneAndUpdate(
      { _id: req.params.id, merchant: req.user.id },
      updateData,
      { new: true }
    );
    
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
