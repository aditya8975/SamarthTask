const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  scheduledTime: {
    type: Date,
    required: true,
  },
  channelName: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["scheduled", "live", "completed", "canceled"],
    default: "scheduled",
  },
  invitedUsers: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "declined"],
        default: "pending",
      },
      reason: {
        type: String, // If declined, store reason
      },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Admin who created the meeting
    required: true,
  },
});

module.exports = mongoose.model("Meeting", MeetingSchema);
