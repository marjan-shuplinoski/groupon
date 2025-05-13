import express from 'express';
import { adminLogin, getUsers, banUser, getMerchants, banMerchant, getDeals, moderateDeal, getStats } from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { adminOnly } from '../middleware/admin.js';
const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', adminLogin);

// @route   GET /api/admin/users
// @desc    List all users
// @access  Private (admin)
router.get('/users', authenticate, adminOnly, getUsers);

// @route   PATCH /api/admin/users/:id/ban
// @desc    Ban/unban user
// @access  Private (admin)
router.patch('/users/:id/ban', authenticate, adminOnly, banUser);

// @route   GET /api/admin/merchants
// @desc    List all merchants
// @access  Private (admin)
router.get('/merchants', authenticate, adminOnly, getMerchants);

// @route   PATCH /api/admin/merchants/:id/ban
// @desc    Ban/unban merchant
// @access  Private (admin)
router.patch('/merchants/:id/ban', authenticate, adminOnly, banMerchant);

// @route   GET /api/admin/deals
// @desc    List all deals
// @access  Private (admin)
router.get('/deals', authenticate, adminOnly, getDeals);

// @route   PATCH /api/admin/deals/:id/moderate
// @desc    Moderate (unpublish) a deal
// @access  Private (admin)
router.patch('/deals/:id/moderate', authenticate, adminOnly, moderateDeal);

// @route   GET /api/admin/stats
// @desc    System stats
// @access  Private (admin)
router.get('/stats', authenticate, adminOnly, getStats);

// @route   POST /api/admin/ban-user
// @desc    Ban user
router.post('/ban-user', (req, res) => {
  res.json({ message: 'user banned' });
});

// @route   POST /api/admin/ban-merchant
// @desc    Ban merchant
router.post('/ban-merchant', (req, res) => {
  res.json({ message: 'merchant banned' });
});

// @route   POST /api/admin/unban-user
// @desc    Unban user
router.post('/unban-user', (req, res) => {
  res.json({ message: 'user unbanned' });
});

// @route   POST /api/admin/unban-merchant
// @desc    Unban merchant
router.post('/unban-merchant', (req, res) => {
  res.json({ message: 'merchant unbanned' });
});

export default router;
