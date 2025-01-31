const express = require("express");
const User = require("../models/User");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const authenticateUser=require('../middleware/authenticateUser')
const router = express.Router();


router.put("/users/:id/role", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { role } = req.body;
      const validRoles = ["user", "admin", "moderator"];
  
      if (!validRoles.includes(role)) {
        return res.status(400).json({ msg: "Invalid role specified" });
      }
  
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ msg: "User not found" });
  
      // Prevent demoting the last admin
      const adminCount = await User.countDocuments({ role: "admin" });
      if (user.role === "admin" && role !== "admin" && adminCount <= 1) {
        return res.status(400).json({ msg: "At least one admin must exist" });
      }
  
      user.role = role;
      await user.save();
  
      res.json({ msg: `User role updated to ${role}`, user });
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ msg: "Error updating user role" });
    }
  });
  





// 🟢 Admin Dashboard Route (Protected)
router.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ msg: "Welcome to Admin Dashboard", user: req.user });
});
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const users = await User.find().select("-password"); // Exclude passwords
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ msg: "Error fetching users" });
    }
  });

  router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) return res.status(404).json({ msg: "User not found" });
      res.json({ msg: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ msg: "Error deleting user" });
    }
  });

  // backend route to get authenticated user data
router.get('/me', authenticateUser, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);  // `req.user.id` should be set by the authentication middleware
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ msg: 'Server error' });
    }
  });
  

module.exports = router;
