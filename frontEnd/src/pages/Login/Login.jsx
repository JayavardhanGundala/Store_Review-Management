import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate=useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "Admin") {
        navigate("/adminDashboard", { replace: true });
      } else if (res.data.role === "User") {
        navigate("/userDahboard", { replace: true });
      } else  {
        navigate("/storeownerDasgboard", { replace: true });
      }

    } catch (err) {
        console.log(err)
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-indigo-900">

      <form 
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-87"
      >

        <h2 className="text-2xl font-bold text-center mb-6">
          Store Rating System
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-3">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

       <p className="text-sm text-center mt-4">
          Don’t have an account? 
          <Link to="/">
            <span className="text-blue-600 cursor-pointer ml-1">Sign Up</span>
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;
