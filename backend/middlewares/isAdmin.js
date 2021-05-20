module.exports = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(401).json({ message: 'Unauthorized Access' });
  }
  return next();
};
