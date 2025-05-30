import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT and attach user to req
export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;
  
  // Get token from header or cookie
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from the token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({ message: 'This account is banned. Please contact support.' });
    }
    
    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired' });
    }
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to allow only merchants
export const merchantOnly = async (req, res, next) => {
  if (!req.user || req.user.role !== 'merchant') {
    return res.status(403).json({ message: 'Access denied: merchants only' });
  }
  // Optionally, fetch the merchant from DB and attach
  try {
    const merchant = await User.findById(req.user.id);
    if (!merchant || merchant.role !== 'merchant') return res.status(404).json({ message: 'Merchant not found' });
    req.merchant = merchant;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
