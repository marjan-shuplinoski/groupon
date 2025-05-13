// Middleware to allow only admins
export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: admins only' });
  }
  next();
};
