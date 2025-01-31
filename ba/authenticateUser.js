const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRATE_KEY='aksecrate'
const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token,SECRATE_KEY);  // Verify JWT token
    req.user = await User.findById(decoded.userId);  // Fetch user data from DB
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authenticateUser;
