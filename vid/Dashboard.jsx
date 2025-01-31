// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div>
//       <h2>Dashboard</h2>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useEffect, useState } from "react";
import axios from "axios";
import MeetingRoom from "./MeetingRoom";

const Dashboard = () => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/meetings/my-meetings", {
        headers: { Authorization: token },
      });
      setMeetings(res.data);
    };

    fetchMeetings();
  }, []);

  return (
    <div>
      <h2>My Meetings</h2>
      {meetings.map((meeting) => (
        <div key={meeting._id}>
          <h3>{meeting.title}</h3>
          <p>{meeting.description}</p>
          <button onClick={() => window.open(`/meeting/${meeting.channelName}`)}>Join</button>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
