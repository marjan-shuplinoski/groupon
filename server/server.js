import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Import routers (ESM)
import authRouter from './routes/auth.js';
import dealsRouter from './routes/deals.js';
import merchantRouter from './routes/merchant.js';
import adminRouter from './routes/admin.js';

// Register routes
app.use('/api/auth', authRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/merchant', merchantRouter);
app.use('/api/admin', adminRouter);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
