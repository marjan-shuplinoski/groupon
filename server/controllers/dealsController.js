import Deal from '../models/Deal.js';

/**
 * @desc    Get all published deals (with search/filter)
 * @route   GET /api/deals
 * @access  Public
 */
export const getDeals = async (req, res) => {
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
};

/**
 * @desc    Get deal details
 * @route   GET /api/deals/:id
 * @access  Public
 */
export const getDealById = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate('merchant', 'businessName');
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json({ deal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Note: claimDeal, unclaimDeal, favoriteDeal, and unfavoriteDeal are already in userController.js
