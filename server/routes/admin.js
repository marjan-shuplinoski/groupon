import express from 'express';
import { adminLogin, getUsers, banUser, getMerchants, banMerchant, getDeals, moderateDeal, getStats, banUserById, banMerchantById, deleteUser, deleteMerchant, deleteDeal } from '../controllers/adminController.js';
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

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (admin)
router.delete('/users/:id', authenticate, adminOnly, deleteUser);

// @route   GET /api/admin/merchants
// @desc    List all merchants
// @access  Private (admin)
router.get('/merchants', authenticate, adminOnly, getMerchants);

// @route   PATCH /api/admin/merchants/:id/ban
// @desc    Ban/unban merchant
// @access  Private (admin)
router.patch('/merchants/:id/ban', authenticate, adminOnly, banMerchant);

// @route   DELETE /api/admin/merchants/:id
// @desc    Delete merchant
// @access  Private (admin)
router.delete('/merchants/:id', authenticate, adminOnly, deleteMerchant);

// @route   GET /api/admin/deals
// @desc    List all deals
// @access  Private (admin)
router.get('/deals', authenticate, adminOnly, getDeals);

// @route   PATCH /api/admin/deals/:id/moderate
// @desc    Moderate (unpublish) a deal
// @access  Private (admin)
router.patch('/deals/:id/moderate', authenticate, adminOnly, moderateDeal);

// @route   DELETE /api/admin/deals/:id
// @desc    Delete deal
// @access  Private (admin)
router.delete('/deals/:id', authenticate, adminOnly, deleteDeal);

// @route   GET /api/admin/stats
// @desc    System stats
// @access  Private (admin)
router.get('/stats', authenticate, adminOnly, getStats);

// @route   POST /api/admin/ban-user
// @desc    Ban user by ID (body: { userId })
router.post('/ban-user', authenticate, adminOnly, banUserById);

// @route   POST /api/admin/ban-merchant
// @desc    Ban/unban merchant by ID (body: { merchantId })
router.post('/ban-merchant', authenticate, adminOnly, banMerchantById);


export default router;
