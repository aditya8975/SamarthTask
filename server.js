const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");


const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const onlineUsers = new Map();
const users = {};
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const connectDB = require("./config/db");

dotenv.config();
connectDB();
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("registerUser", (userId) => {
        onlineUsers.set(userId, socket.id);
        users[userId] = socket.id;
    });

    socket.on("newMeeting", (meeting) => {
        console.log("New meeting created:", meeting);
        Object.values(users).forEach((socketId) => {
            io.to(socketId).emit("newMeeting", meeting);
        });
    });

    socket.on("meetingResponse", ({ meetingId, userId, status, reason }) => {
        console.log(`User ${userId} responded to meeting ${meetingId}: ${status}`);

        // Emit to admin or relevant users
        Object.values(users).forEach((socketId) => {
            io.to(socketId).emit("meetingResponse", { meetingId, userId, status, reason });
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
            }
        }
    });
});

// Meeting Routes (Pass io instance correctly)
const meetingRoutes = require("./routes/meetingRoutes")(io);
app.use("/api/meetings", meetingRoutes);

app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching users' });
    }
  });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
