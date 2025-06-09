import mongoose from 'mongoose';

const DealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  terms: String,
  expiry: Date,
  status: { type: String, enum: ['published', 'draft', 'expired'], default: 'draft' },
  merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  image: { type: String, required: true }
});

export default mongoose.model('Deal', DealSchema);
