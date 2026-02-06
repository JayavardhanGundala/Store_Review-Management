import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ratings, setRatings] = useState({}); // temporary input per user
  const [updatingId, setUpdatingId] = useState(null); // show loading per row
  const [flag,setFlag]=useState(true)
  const navigate = useNavigate();
    const [showReset, setShowReset] = useState(false); // show/hide reset password form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  // Fetch users from API
  const token = localStorage.getItem("token");
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const res = await axios.get("http://localhost:5000/api/auth/user/getstores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      console.log(res.data)
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/resetPassword", // Your API
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResetMessage(res.data.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setShowReset(false);
    } catch (err) {
      console.error(err);
      setResetMessage(err.response?.data?.message || "Failed to update password");
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchUsers();
  }, [flag]);

  // Filtered users for search
  const filteredUsers = useMemo(() => {
    if (!search) return users;
    return users.filter((user) =>
      [user.name, user.address].some((field) =>
        field?.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  // Handle rating input change
  const handleRatingChange = (userId, value) => {
    setRatings((prev) => ({ ...prev, [userId]: value }));
  };
  const handleLogout = () => {
    // Remove token and role from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Redirect to login page
    navigate("/login");
  };

  // Handle submit/update rating
  const handleUpdateRating = async (userId) => {
    const token = localStorage.getItem("token");
    const ratingValue = Number(ratings[userId]);

    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      
      return;
    }

    try {
      setUpdatingId(userId);

      // Send rating to API
      const res = await axios.post(
        "http://localhost:5000/api/auth/user/ratestore",
        { storeid: userId, rating: ratingValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Optimistic update: update rating in state
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, rating: res.data.rating } : user
        )
      );

      // Clear input for this user
      setRatings((prev) => ({ ...prev, [userId]: "" }));


    } catch (err) {
      console.error(err);
      alert("Failed to update rating");
    } finally {
      setUpdatingId(null);
      setFlag((prev)=>!prev)
    }
  };

  // Loading / error / empty state
  if (loading) return <p className="p-5">Loading users...</p>;
  if (error) return <p className="p-5 text-red-500">{error}</p>;
  if (!users || users.length === 0)
    return (
      <div className="bg-white p-5 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Users</h2>
        <p className="text-gray-500 text-center">No users found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>

        <div className="flex gap-4">
          <button
            onClick={() => setShowReset(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reset Password
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
      {/* Reset Password Modal */}
      {showReset && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="border px-3 py-2 rounded"
                required
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border px-3 py-2 rounded"
                required
              />
              {resetMessage && (
                <p className={`text-sm ${resetMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {resetMessage}
                </p>
              )}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowReset(false)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search */}
      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Search by Name / Address"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Address</th>
            <th className="p-2">Rating</th>
            <th className="p-2">Update Rating</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-t text-center">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.address}</td>
              <td className="p-2">{Number(user.rating || 0).toFixed(1)} ⭐</td>
              <td className="p-2 flex justify-center gap-2">
                <input
                  type="number"
                  min={1} 
                  max={5}
                  placeholder="1-5"
                  value={ratings[user.id] || ""}
                  onChange={(e) => handleRatingChange(user.id, e.target.value)}
                  className="border p-1 w-16 rounded text-center"
                />
                <button
                  onClick={() => handleUpdateRating(user.id)}
                  className="bg-blue-600 text-white px-2 py-1 rounded disabled:opacity-50"
                  disabled={updatingId === user.id}
                >
                  {updatingId === user.id ? "Updating..." : "Update"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



