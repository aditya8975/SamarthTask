const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
    title: { type: String, required: true },  // ✅ Use String, not ToString
    description: { type: String },
    date: { type: Date, required: true },
    invitedUsers: [String], // Array of user IDs
    type: { type: String, enum: ["online", "offline"], required: true },
    location: { type: String },
    items: [{ type: String }],
    responses: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ["accepted", "declined"] },
        reason: { type: String }
    }]
    

}, { timestamps: true });

module.exports = mongoose.model("Meeting", MeetingSchema);
