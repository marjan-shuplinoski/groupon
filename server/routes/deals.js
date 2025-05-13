import express from 'express';
import Deal from '../models/Deal.js';
import { claimDeal, favoriteDeal, unfavoriteDeal, unclaimDeal } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { userOnly } from '../middleware/user.js';
const router = express.Router();

// @route   GET /api/deals
// @desc    Get all published deals (with search/filter)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = { status: 'published' };
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    const deals = await Deal.find(query).populate('merchant', 'businessName');
    res.json({ deals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/deals/:id
// @desc    Get deal details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate('merchant', 'businessName');
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json({ deal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/deals/:id/claim
// @desc    Claim/reserve a deal
// @access  Private (user)
router.post('/:id/claim', authenticate, userOnly, claimDeal);

// @route   DELETE /api/deals/:id/claim
// @desc    Unclaim a deal
// @access  Private (user)
router.delete('/:id/claim', authenticate, userOnly, unclaimDeal);

// @route   POST /api/deals/:id/favorite
// @desc    Save/favorite a deal
// @access  Private (user)
router.post('/:id/favorite', authenticate, userOnly, favoriteDeal);

// @route   DELETE /api/deals/:id/favorite
// @desc    Unfavorite a deal
// @access  Private (user)
router.delete('/:id/favorite', authenticate, userOnly, unfavoriteDeal);

export default router;
