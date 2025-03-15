import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      setError("No user found! Please sign up first.");
      return;
    }

    if (storedUser.email === email && storedUser.password === password) {
      localStorage.setItem("isAuthenticated", "true"); // Mark as authenticated
      alert("Login Successful!");
      navigate("/profile"); // Redirect to profile
    } else {
      setError("Invalid email or password!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-3xl font-semibold mb-4">Welcome Back!</h2>
        <p className="text-gray-400 mb-6">Login to continue</p>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 text-white rounded-md outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 text-white rounded-md outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md font-semibold"
        >
          Login
        </button>

        <p className="mt-4 text-gray-400">
          Don't have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
