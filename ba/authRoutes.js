const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SECRET_KEY = "aksecrate"; // Store in .env

// 🟢 User Registration
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) { 
    res.status(500).json({ msg: "Error in registration" });
  }
});

// 🟢 User Login
router.post('/login', async (req, res) => {
  console.log(req.body);  // Log the incoming email and password
  try {
    const { email, password } = req.body;

    // Fetch user from DB, compare password, and return a token
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Assuming bcrypt is used for password hashing
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id },SECRET_KEY, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
