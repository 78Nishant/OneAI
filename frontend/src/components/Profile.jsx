import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "Guest",
    email: "guest@example.com",
    joined: "Unknown",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        name: storedUser.name,
        email: storedUser.email,
        joined: new Date().toLocaleDateString(),
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    localStorage.removeItem("isAuthenticated"); 
    navigate("/login"); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-center">
        <CgProfile className="text-7xl mx-auto mb-3 text-gray-400" />
        <h2 className="text-2xl font-semibold">{user.name}</h2>
        <p className="text-gray-400">{user.email}</p>
        <p className="mt-3 text-gray-400">Joined: {user.joined}</p>

        <button
          onClick={handleLogout}
          className="mt-5 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
