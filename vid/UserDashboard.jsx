import { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/auth/user", {
        headers: { Authorization: token },
      });
      setUser(res.data);
    };

    fetchUser();
  }, []);

  return user ? (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  ) : (
    <h2>Loading...</h2>
  );
};

export default UserDashboard;
