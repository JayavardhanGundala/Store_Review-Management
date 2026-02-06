import { useState } from "react";
import axios from "axios";

export default function StoresTable({ storesdata,flag }) {

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name:"",
    email:"",
    address:"",
    password:"",
    role:"storeOwner"
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.post(
      "http://localhost:5000/api/auth/admin/createUser",
      form,
      {
        headers:{
          Authorization:`Bearer ${token}`
        }
      }
    );

    setShowModal(false);
    flag((prev=>!prev))
      // reload store list
  };

  return (
    <div className="bg-white p-5 rounded shadow">

      {/* Header */}
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-semibold">Stores</h2>

        <button
          onClick={()=>setShowModal(true)}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          + Add Store
        </button>
      </div>

      {/* Search */}
      <input
        className="border p-2 w-full mb-3 rounded"
        placeholder="Search by Name / Email / Address"
      />

      {/* Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Rating</th>
          </tr>
        </thead>

        <tbody>
          {storesdata?.map((s) => (
            <tr key={s.id} className="border-t text-center">
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{Number(s.avg_rating || 0).toFixed(1)} ⭐</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

          <div className="bg-white p-6 rounded w-87.5 relative">

            {/* X Button */}
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={()=>setShowModal(false)}
            >
              ✖
            </button>

            <h2 className="text-xl font-bold mb-4">
              Add Store 
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input
                name="name"
                placeholder="Name"
                className="border p-2 w-full rounded"
                onChange={handleChange}
                required
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                className="border p-2 w-full rounded"
                onChange={handleChange}
                required
              />

              <input
                name="address"
                placeholder="Address"
                className="border p-2 w-full rounded"
                onChange={handleChange}
                required
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
                className="border p-2 w-full rounded"
                onChange={handleChange}
                required
              />

              <button
                className="bg-green-600 text-white w-full py-2 rounded"
              >
                Create Store
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

