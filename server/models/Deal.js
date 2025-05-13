import mongoose from 'mongoose';

const DealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  terms: String,
  expiry: Date,
  status: { type: String, enum: ['published', 'draft', 'expired'], default: 'draft' },
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'Merchant', required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Deal', DealSchema);
