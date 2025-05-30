import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import authRouter from './routes/auth.js';
import dealsRouter from './routes/deals.js';
import adminRouter from './routes/admin.js';
import userRouter from './routes/user.js';
import merchantRouter from './routes/merchant.js';

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Import routers (ESM)

// Register routes
app.use('/api/auth', authRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/user', userRouter);
app.use('/api/merchant', merchantRouter);
app.use('/api/admin', adminRouter);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
