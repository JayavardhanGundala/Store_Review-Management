import React, { useState, useEffect } from "react";
import StatsCards from "./StatsCards";
import UsersTable from "./UsersTable";
import StoresTable from "./StoresTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDah = () => {
  const [dashboard, setDashboard] = useState(null);
  const [usersdata, setUsersData] = useState(null);
  const [storesdata, setStoresData] = useState(null);
  const [flag, setFlag] = useState(true);

  const [showReset, setShowReset] = useState(false); 
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Reset Password Handler
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/resetPassword", // Your API endpoint
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

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/admin/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDashboard(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/admin/getallausers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsersData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchStores = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/admin/stores",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStoresData(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDashboard();
    fetchUsers();
    fetchStores();
  }, [flag, token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

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
                <p
                  className={`text-sm ${
                    resetMessage.toLowerCase().includes("success")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
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

      <StatsCards dashboard={dashboard} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <UsersTable usersdata={usersdata} flag={setFlag} />
        <StoresTable storesdata={storesdata} flag={setFlag} />
      </div>
    </div>
  );
};

export default AdminDah;
