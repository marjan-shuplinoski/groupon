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

// Deal CRUD (Private, merchant only)
router.post('/deals', authenticate, merchantOnly, createDeal);
router.get('/deals', authenticate, merchantOnly, getDeals);
router.get('/deals/:id', authenticate, merchantOnly, getDeal);
router.put('/deals/:id', authenticate, merchantOnly, updateDeal);
router.delete('/deals/:id', authenticate, merchantOnly, deleteDeal);

export default router;
