import express from 'express';
const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Admin dashboard info
router.get('/dashboard', (req, res) => {
  res.json({ message: 'admin dashboard' });
});

// @route   GET /api/admin/users
// @desc    List all users
router.get('/users', (req, res) => {
  res.json({ message: 'admin users' });
});

// @route   GET /api/admin/merchants
// @desc    List all merchants
router.get('/merchants', (req, res) => {
  res.json({ message: 'admin merchants' });
});

// @route   GET /api/admin/deals
// @desc    List all deals
router.get('/deals', (req, res) => {
  res.json({ message: 'admin deals' });
});

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
