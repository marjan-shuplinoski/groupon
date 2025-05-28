import express from 'express';
import { getDeals, getDealById } from '../controllers/dealsController.js';
import { claimDeal, unclaimDeal, favoriteDeal, unfavoriteDeal } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { userOnly } from '../middleware/user.js';

const router = express.Router();

// @route   GET /api/deals
// @desc    Get all published deals with optional search
// @access  Public
router.get('/', getDeals);

// @route   GET /api/deals/:id
// @desc    Get deal details by ID
// @access  Public
router.get('/:id', getDealById);

// @route   POST /api/deals/:id/claim
// @desc    Claim a deal
// @access  Private (user)
router.post('/:id/claim', authenticate, userOnly, claimDeal);

// @route   DELETE /api/deals/:id/claim
// @desc    Unclaim a deal
// @access  Private (user)
router.delete('/:id/claim', authenticate, userOnly, unclaimDeal);

// @route   POST /api/deals/:id/favorite
// @desc    Add deal to favorites
// @access  Private (user)
router.post('/:id/favorite', authenticate, userOnly, favoriteDeal);

// @route   DELETE /api/deals/:id/favorite
// @desc    Remove deal from favorites
// @access  Private (user)
router.delete('/:id/favorite', authenticate, userOnly, unfavoriteDeal);

export default router;