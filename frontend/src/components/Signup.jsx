import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = () => {
    if (!name || !email || !password) {
      setError("All fields are required!");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      joined: new Date().toLocaleDateString(),
    };

    localStorage.setItem("user", JSON.stringify(newUser));
    alert("Sign Up Successful! Please log in.");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-3xl font-semibold mb-4">Create an Account</h2>
        <p className="text-gray-400 mb-6">Join us today!</p>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 mb-4 text-white rounded-md outline-none"
          onChange={(e) => setName(e.target.value)}
        />
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
          onClick={handleSignUp}
          className="w-full bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md font-semibold"
        >
          Sign Up
        </button>

        <p className="mt-4 text-gray-400">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
