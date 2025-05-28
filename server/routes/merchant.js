import express from 'express';
import { register, dashboard, profile, login, createDeal, getDeals, getDeal, updateDeal, deleteDeal } from '../controllers/merchantController.js';
import { authenticate, merchantOnly } from '../middleware/auth.js';
const router = express.Router();

// @route   POST /api/merchant/register
// @desc    Register merchant
// @access  Public
router.post('/register', register);

// @route   POST /api/merchant/login
// @desc    Merchant login
// @access  Public
router.post('/login', login);

// @route   GET /api/merchant/dashboard
// @desc    Merchant dashboard info
// @access  Private (merchant)
router.get('/dashboard', authenticate, merchantOnly, dashboard);

// @route   GET /api/merchant/profile
// @desc    Merchant profile info
// @access  Private (merchant)
router.get('/profile', authenticate, merchantOnly, profile);

// Deal Management Routes (Private, merchant only)

// @route   POST /api/merchant/deals
// @desc    Create a new deal
// @access  Private (merchant)
router.post('/deals', authenticate, merchantOnly, createDeal);

// @route   GET /api/merchant/deals
// @desc    Get all deals for merchant
// @access  Private (merchant)
router.get('/deals', authenticate, merchantOnly, getDeals);

// @route   GET /api/merchant/deals/:id
// @desc    Get specific deal by ID
// @access  Private (merchant)
router.get('/deals/:id', authenticate, merchantOnly, getDeal);

// @route   PUT /api/merchant/deals/:id
// @desc    Update existing deal
// @access  Private (merchant)
router.put('/deals/:id', authenticate, merchantOnly, updateDeal);

// @route   DELETE /api/merchant/deals/:id
// @desc    Delete a deal
// @access  Private (merchant)
router.delete('/deals/:id', authenticate, merchantOnly, deleteDeal);

export default router;
