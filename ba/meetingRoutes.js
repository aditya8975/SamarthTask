const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const Meeting = require("../models/Meeting");
const User = require("../models/User");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
require("dotenv").config();

const router = express.Router();

// 📌 Generate Agora Token
const generateAgoraToken = (channelName, role) => {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;
  const expirationTime = 3600; // 1 hour

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    0, // UID (0 for dynamic)
    role === "host" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER,
    expirationTime
  );
  return token;
};

// 📌 Create a New Meeting (Admin Only)
router.post("/create", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, scheduledTime, invitedUsers } = req.body;
    
    const channelName = `meeting_${Date.now()}`;
    const agoraToken = generateAgoraToken(channelName, "host");

    const meeting = new Meeting({
      title,
      description,
      scheduledTime,
      channelName,
      token: agoraToken,
      invitedUsers: invitedUsers.map(user => ({
        userId: user,
        status: "pending",
      })),
    });

    await meeting.save();

    // 📩 Send Email Invitations
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    invitedUsers.forEach(async (userId) => {
      const user = await User.findById(userId);
      if (user) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `Invitation to Meeting: ${title}`,
          text: `You have been invited to a meeting.\n\nTitle: ${title}\nDescription: ${description}\nScheduled Time: ${scheduledTime}\nClick here to respond: http://localhost:3000/meetings`,
        });
      }
    });

    res.json({ msg: "Meeting created and invitations sent!", meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating meeting" });
  }
});

// 📌 User Accept/Decline Meeting
router.post("/:meetingId/respond", authMiddleware, async (req, res) => {
  try {
    const { status, reason } = req.body;
    const meeting = await Meeting.findById(req.params.meetingId);

    if (!meeting) return res.status(404).json({ msg: "Meeting not found" });

    const invitedUser = meeting.invitedUsers.find(u => u.userId.toString() === req.user.id);
    if (!invitedUser) return res.status(403).json({ msg: "You are not invited" });

    invitedUser.status = status;
    invitedUser.reason = status === "declined" ? reason : null;
    await meeting.save();

    res.json({ msg: "Response recorded", meeting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error responding to meeting" });
  }
});

// 📌 Get All Meetings for User
router.get("/my-meetings", authMiddleware, async (req, res) => {
  try {
    const meetings = await Meeting.find({ "invitedUsers.userId": req.user.id });
    res.json(meetings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error fetching meetings" });
  }
});

module.exports = router;
