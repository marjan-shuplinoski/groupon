import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Merchant from '../models/Merchant.js';
import User from '../models/User.js';

dotenv.config();

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);

  const merchants = await Merchant.find();
  for (const merchant of merchants) {
    // Check if user with same email already exists
    const existing = await User.findOne({ email: merchant.email });
    if (existing) {
      console.log(`User with email ${merchant.email} already exists, skipping.`);
      continue;
    }
    const user = new User({
      email: merchant.email,
      password: merchant.password, // already hashed
      role: 'merchant',
      businessName: merchant.businessName,
      logo: merchant.logo,
      contactInfo: merchant.contactInfo,
      createdAt: merchant.createdAt || new Date()
    });
    await user.save();
    console.log(`Migrated merchant ${merchant.email}`);
  }

  console.log('Migration complete!');
  process.exit();
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
