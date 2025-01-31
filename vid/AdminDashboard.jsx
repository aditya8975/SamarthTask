import { useEffect, useState } from "react";
import axios from "axios";
import AdminCreateMeeting from "./AdminCreateMeeting";
const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
        
        const res = await axios.get("http://localhost:5000/api/admin/users", {
          headers: { Authorization: token },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Check console for details.");
      }
    };

    fetchUsers();
  }, []);


  const handleRoleChange = async (id, newRole) => {
    if (!window.confirm(`Are you sure you want to change the role to ${newRole}?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/admin/users/${id}/role`,
        { role: newRole },
        { headers: { Authorization: token } }
      );

      setUsers(users.map((user) => (user._id === id ? { ...user, role: newRole } : user)));
      alert(res.data.msg);
    } catch (err) {
      console.error("Error updating user role:", err);
      alert("Error updating user role. Check console for details.");
    }
  };    



  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: token },
      });
      setUsers(users.filter((user) => user._id !== id));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Error deleting user. Check console for details.");
    }
  };

  return (
    <div>
      <h2>Admin Panel - Users List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role !== "admin" && (
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                )}


<select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  disabled={user.role === "admin" && users.filter((u) => u.role === "admin").length === 1}
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AdminCreateMeeting />
    </div>
  );
};

export default AdminDashboard;
