import express from 'express';
const router = express.Router();

// @route   GET /api/deals
// @desc    Get all deals
router.get('/', (req, res) => {
  res.json({ message: 'all deals' });
});

// @route   GET /api/deals/:id
// @desc    Get deal details
router.get('/:id', (req, res) => {
  res.json({ message: 'deal details', id: req.params.id });
});

// @route   POST /api/deals
// @desc    Create a deal
router.post('/', (req, res) => {
  res.json({ message: 'deal created' });
});

// @route   PUT /api/deals/:id
// @desc    Update a deal
router.put('/:id', (req, res) => {
  res.json({ message: 'deal updated', id: req.params.id });
});

// @route   DELETE /api/deals/:id
// @desc    Delete a deal
router.delete('/:id', (req, res) => {
  res.json({ message: 'deal deleted', id: req.params.id });
});

export default router;
