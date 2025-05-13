import User from '../models/User.js';
import Deal from '../models/Deal.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Admin login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await User.findOne({ email, role: 'admin' });
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  const payload = { id: admin._id, email: admin.email, role: admin.role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ message: 'admin logged in', token });
};

// Get all users
export const getUsers = async (req, res) => {
  const users = await User.find({ role: 'user' });
  res.json({ users });
};

// Ban/unban user
export const banUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'user') return res.status(404).json({ message: 'User not found' });
  user.isBanned = !user.isBanned;
  await user.save();
  res.json({ message: user.isBanned ? 'User banned' : 'User unbanned' });
};

// Get all merchants
export const getMerchants = async (req, res) => {
  const merchants = await User.find({ role: 'merchant' });
  res.json({ merchants });
};

// Ban/unban merchant
export const banMerchant = async (req, res) => {
  const merchant = await User.findById(req.params.id);
  if (!merchant || merchant.role !== 'merchant') return res.status(404).json({ message: 'Merchant not found' });
  merchant.isBanned = !merchant.isBanned;
  await merchant.save();
  res.json({ message: merchant.isBanned ? 'Merchant banned' : 'Merchant unbanned' });
};


// Get all deals
export const getDeals = async (req, res) => {
  const deals = await Deal.find().populate('merchant', 'email businessName');
  res.json({ deals });
};


// Moderate (unpublish) a deal
export const moderateDeal = async (req, res) => {
  const deal = await Deal.findById(req.params.id);
  if (!deal) return res.status(404).json({ message: 'Deal not found' });
  deal.status = 'draft';
  await deal.save();
  res.json({ message: 'Deal unpublished' });
};

// System stats
export const getStats = async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalMerchants = await User.countDocuments({ role: 'merchant' });
  const totalDeals = await Deal.countDocuments();
  res.json({ totalUsers, totalMerchants, totalDeals });
};
