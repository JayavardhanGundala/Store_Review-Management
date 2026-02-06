import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function OwnerDashboard() {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false); // show/hide reset password form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:5000/api/auth/storeowner/greetings",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setRatings(res.data);

        if (res.data.length > 0) {
          setAverage(Number(res.data[0].avg_rating).toFixed(1));
        } else {
          setAverage(0);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Reset password function
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

  if (loading) return <p className="p-5">Loading dashboard...</p>;
  if (error) return <p className="p-5 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Store Owner Dashboard</h1>

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

      {/* Store Average Rating */}
      <div className="bg-white p-5 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">
          Store: {ratings[0]?.store_name || "N/A"}
        </h2>
        <p className="text-2xl">Average Rating: {average} ⭐</p>
      </div>

      {/* User Ratings Table */}
      <div className="bg-white p-5 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">User Ratings</h2>

        {ratings.length === 0 ? (
          <p className="text-gray-500">No ratings submitted yet.</p>
        ) : (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">User Name</th>
                <th className="p-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r, index) => (
                <tr key={index} className="border-t text-center">
                  <td className="p-2">{r.user_name}</td>
                  <td className="p-2">{Number(r.rating).toFixed(1)} ⭐</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

