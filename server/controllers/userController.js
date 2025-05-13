import User from '../models/User.js';
import Deal from '../models/Deal.js';

// @desc    Get user dashboard
// @route   GET /api/user/dashboard
// @access  Private (user)
export const dashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('claimedDeals savedDeals');
    res.json({
      email: user.email,
      claimedDeals: user.claimedDeals,
      savedDeals: user.savedDeals
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private (user)
export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      claimedDeals: user.claimedDeals,
      savedDeals: user.savedDeals
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Claim a deal
// @route   POST /api/deals/:id/claim
// @access  Private (user)
export const claimDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    const user = await User.findById(req.user.id);
    if (user.claimedDeals.includes(deal._id)) {
      return res.status(409).json({ message: 'Already claimed' });
    }
    user.claimedDeals.push(deal._id);
    await user.save();
    res.json({ message: 'deal claimed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Save/favorite a deal
// @route   POST /api/deals/:id/favorite
// @access  Private (user)
export const favoriteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    const user = await User.findById(req.user.id);
    if (user.savedDeals.includes(deal._id)) {
      return res.status(409).json({ message: 'Already favorited' });
    }
    user.savedDeals.push(deal._id);
    await user.save();
    res.json({ message: 'deal favorited' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Unfavorite a deal
// @route   DELETE /api/deals/:id/favorite
// @access  Private (user)
export const unfavoriteDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    const user = await User.findById(req.user.id);
    const idx = user.savedDeals.indexOf(deal._id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Not in favorites' });
    }
    user.savedDeals.splice(idx, 1);
    await user.save();
    res.json({ message: 'deal unfavorited' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Unclaim a deal
// @route   DELETE /api/deals/:id/claim
// @access  Private (user)
export const unclaimDeal = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    const user = await User.findById(req.user.id);
    const idx = user.claimedDeals.indexOf(deal._id);
    if (idx === -1) {
      return res.status(404).json({ message: 'Not in claimed deals' });
    }
    user.claimedDeals.splice(idx, 1);
    await user.save();
    res.json({ message: 'deal unclaimed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
