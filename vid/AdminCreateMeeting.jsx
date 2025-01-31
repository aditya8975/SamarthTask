import React, { useState } from "react";
import axios from "axios";

const AdminCreateMeeting = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [invitedUsers, setInvitedUsers] = useState(""); // Comma-separated user IDs
  const [message, setMessage] = useState("");

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/meetings/create",
        {
          title,
          description,
          scheduledTime,
          invitedUsers: invitedUsers.split(",").map((id) => id.trim()),
        },
        {
          headers: { Authorization: token },
        }
      );

      setMessage("Meeting created successfully!");
      setTitle("");
      setDescription("");
      setScheduledTime("");
      setInvitedUsers("");
    } catch (error) {
      setMessage("Error creating meeting!");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Create a New Meeting</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleCreateMeeting}>
        <input
          type="text"
          placeholder="Meeting Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Meeting Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Invite User IDs (comma-separated)"
          value={invitedUsers}
          onChange={(e) => setInvitedUsers(e.target.value)}
          required
        />
        <button type="submit">Create Meeting</button>
      </form>
    </div>
  );
};

export default AdminCreateMeeting;
