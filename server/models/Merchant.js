import mongoose from 'mongoose';

const MerchantSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  businessName: {
    type: String,
    required: true
  },
  logo: String,
  contactInfo: String,
  role: {
    type: String,
    enum: ['merchant'],
    default: 'merchant'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Merchant', MerchantSchema);
