// Middleware to allow only users
export const userOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'user') {
    return res.status(403).json({ message: 'Access denied: users only' });
  }
  next();
};
