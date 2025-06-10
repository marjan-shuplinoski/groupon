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
  origin: [
    'http://localhost:5173',
    'http://192.168.0.106:5173',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Global preflight handler for CORS
app.options('*', cors());
app.use(express.json());

// Debug: log request origin and CORS headers
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log('Request Origin:', req.headers.origin);
    console.log('CORS headers:', {
      'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials'),
      'Access-Control-Allow-Methods': res.getHeader('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': res.getHeader('Access-Control-Allow-Headers'),
    });
  });
  next();
});

// Health check route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

// Import routers (ESM)

// Register routes
app.use('/api/auth', authRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/users', userRouter); // Add this line for /api/users/* endpoints
app.use('/api/merchant', merchantRouter);
app.use('/api/admin', adminRouter);

// Connect to MongoDB
connectDB();

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 5000;
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
