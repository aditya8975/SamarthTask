const jwt = require("jsonwebtoken");
const SECRET_KEY = "aksecrate"; // Store in .env

const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
      const token = req.header("Authorization");
      if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
  
      const decoded = jwt.verify(token,SECRET_KEY);
      req.user = decoded;
  
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      req.user.role = user.role;
      next();
    } catch (error) {
      res.status(401).json({ msg: "Invalid token" });
    }
  };
const adminMiddleware = (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access Denied: Admins Only" });
    }
    next();
  };
  
module.exports = { authMiddleware, adminMiddleware };
