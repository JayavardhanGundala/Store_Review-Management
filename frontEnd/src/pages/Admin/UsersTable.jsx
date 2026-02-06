import { useState } from "react";
import axios from "axios";

export default function UsersTable({ usersdata,flag }) {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(""); // <-- error state

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "User",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // clear error when user types again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/auth/admin/createUser",
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setShowModal(false);
      flag((prev)=>!prev); // reload users list
    } catch (err) {
      console.error("Failed to add user:", err);

      // Get backend error message
      if (err.response?.data?.message) {
        setError(err.response.data.message); // display message from backend
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const inputFields = [
    { name: "name", placeholder: "Name", type: "text" },
    { name: "email", placeholder: "Email", type: "email" },
    { name: "address", placeholder: "Address", type: "text" },
    { name: "password", placeholder: "Password", type: "password" },
  ];

  const roles = ["User", "Admin", "storeOwner"];

  return (
    <div className="bg-white p-5 rounded shadow">

      {/* Header */}
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-semibold">Users</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          + Add User
        </button>
      </div>

      {/* Search */}
      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Search by Name / Email / Address / Role"
      />

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            {["Name", "Email", "Address", "Role", "Rating"].map((col) => (
              <th key={col} className="p-2">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {usersdata?.map((user) => (
            <tr key={user.id} className="border-t text-center">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.address}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">
                {user.role === "StoreOwner"
                  ? Number(user.store_avg_rating || 0).toFixed(1) + " ⭐"
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-87.5 relative">

            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4">Add User</h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              {inputFields.map((field) => (
                <input
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="border p-2 w-full rounded"
                  onChange={handleChange}
                  required
                />
              ))}

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              {/* Error Message */}
              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <button className="bg-blue-600 text-white w-full py-2 rounded">
                Create User
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}



