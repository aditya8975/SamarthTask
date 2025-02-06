const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
//const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
router.post("/register", async (req, res) => {
    try {
        console.log("Received data:", req.body);  // Debugging output

        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/login",async (req, res) => {
    const { email, password } = req.body;   
    try {
        

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});


module.exports = router;
