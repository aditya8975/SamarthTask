const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Unauthorized access" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
    next();
};
