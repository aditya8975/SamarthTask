const express = require("express");
const Meeting = require("../models/Meeting");
const mongoose = require('mongoose');

module.exports = (io) => {
    const router = express.Router();

    // 📌 Create a new meeting
    router.post("/create", async (req, res) => {
        try {
            const { title, description, date, invitedUsers, type, location, items} = req.body;
            const newMeeting = new Meeting({ title, description, date, invitedUsers, type, location, items });
            await newMeeting.save();

            // Emit event to invited users
            const users = await User.find({ '_id': { $in: invitedUsers } });
            users.forEach(user => {
                // Send email/notification to user
                console.log(`Sending invitation to ${user.name} for meeting: ${title}`);
              });
              res.status(200).json({ message: 'Meeting created and invitations sent.' });

            invitedUsers.forEach(userId => {
                const userSocket = io.sockets.sockets.get(userId);
                if (userSocket) {
                    io.to(userSocket).emit("newMeeting", { title, description, date, type });
                }
            });

            res.status(201).json(newMeeting);
        } catch (error) {
            console.error("Error creating meeting:", error);
            res.status(500).json({ message: "Server error" });
        }
    });

    // 📌 User response to meeting
    router.post("/respond", async (req, res) => {
        try {
            const { meetingId, status, reason, userId } = req.body;
            const meeting = await Meeting.findById(meetingId);

            if (!meeting) return res.status(404).json({ message: "Meeting not found" });

            // Update meeting responses
            const response = { userId, status, reason };
            meeting.responses.push(response);
            await meeting.save();

            // Notify admin about response
            io.emit("meetingResponse", { meetingId, userId, status, reason });

            res.json({ message: "Response recorded" });
        } catch (error) {
            console.error("Error updating response:", error);
            res.status(500).json({ message: "Server error" });
        }
    });

    // 📌 Get all meetings for admin
    router.get("/", async (req, res) => {
        try {
            const meetings = await Meeting.find();
            res.json(meetings);
        } catch (error) {
            console.error("Fetching meetings error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    // 📌 Get user-specific meetings
    router.get("/user/:userId", async (req, res) => {
        try {
            const meetings = await Meeting.find({ invitedUsers: req.params.userId });
            res.json(meetings);
        } catch (error) {
            console.error("Fetching user meetings error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

router.get("/user-meetings/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("Fetching meetings for user ID:", userId); // ✅ Debugging log

        const meetings = await Meeting.find({ invitedUsers: { $in: [userId] }});
        console.log("Meetings found:", meetings); // ✅ Debugging log

        res.status(200).json(meetings);
    } catch (error) {
        console.error("Error fetching meetings:", error);
        res.status(500).json({ message: "Error fetching meetings" });
    }
});

return router;

};