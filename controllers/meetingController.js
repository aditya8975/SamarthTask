const Meeting = require("../models/Meeting");
const User = require("../models/User");

// Admin creates a meeting
exports.createMeeting = async (req, res) => {
    try {
        const { title, description, type, date, location, geoLocation, requiredItems, invitedUsers } = req.body;

        const meeting = new Meeting({
            title,
            description,
            type,
            date,
            location,
            geoLocation,
            requiredItems,
            invitedUsers
        });

        await meeting.save();
        res.status(201).json({ message: "Meeting created successfully", meeting });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get meetings for a user
exports.getMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find({ invitedUsers: req.user.id }).populate("responses.userId", "name email");
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// User responds to a meeting (Accept/Reject)
exports.respondToMeeting = async (req, res) => {
    try {
        const { meetingId, status, reason } = req.body;
        const userId = req.user.id;

        const meeting = await Meeting.findById(meetingId);
        if (!meeting) return res.status(404).json({ message: "Meeting not found" });

        const existingResponse = meeting.responses.find((r) => r.userId.toString() === userId);
        if (existingResponse) {
            existingResponse.status = status;
            existingResponse.reason = status === "rejected" ? reason : "";
        } else {
            meeting.responses.push({ userId, status, reason: status === "rejected" ? reason : "" });
        }

        await meeting.save();
        res.status(200).json({ message: "Response recorded successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
