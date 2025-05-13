import jwt from 'jsonwebtoken';
import Merchant from '../models/Merchant.js';

// Middleware to verify JWT and attach user/merchant to req
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
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
    const merchant = await Merchant.findById(req.user.id);
    if (!merchant) return res.status(404).json({ message: 'Merchant not found' });
    req.merchant = merchant;
    next();
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};
