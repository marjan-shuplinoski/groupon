import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
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
  role: {
    type: String,
    enum: ['user', 'merchant', 'admin'],
    default: 'user'
  },
  savedDeals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }],
  claimedDeals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }],
  isBanned: {
    type: Boolean,
    default: false
  },
  // Merchant specific fields
  businessName: { type: String },
  logo: { type: String },
  contactInfo: { type: String },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


export default mongoose.model('User', UserSchema);
