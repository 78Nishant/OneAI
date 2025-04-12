import React, { useState, useEffect } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

const History = () => {
  const [history, setHistory] = useState([]);
  const {user}=useUser()
  const {getToken}=useAuth

  useEffect(() => {
    const fetchData=async () => {
    if(!user) {
      console.log("User not logged in");
      return; }// Ensure user is logged in before fetching history
    try{
      console.log(user.id)
      const token=await getToken()
    const userInfo={
      id:user.id
    }
    const res=await axios.get("http://localhost:3000/main/get-history",userInfo,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
    console.log(res.data.history)
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setHistory(storedHistory);
  }catch(err){
    console.error("Error fetching history:", err);
  }}
  fetchData();
  }, []);

  const deleteHistoryItem = (index) => {
    const updatedHistory = history.filter((_, i) => i !== index);
    setHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const clearAllHistory = () => {
    setHistory([]); 
    localStorage.removeItem("searchHistory"); 
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#1D1E20] text-white p-5 text-2xl font-bold">
      <div className="flex justify-between items-center mb-5">
        <h2>Search History</h2>
        {history.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="bg-red-500 px-4 py-2 rounded-md text-white hover:bg-red-700"
          >
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-gray-400">No history available.</p>
      ) : (
        history.map((item, index) => (
          <div key={index} className="flex justify-between items-center border-b-2 border-gray-500 py-2 text-xl">
            <p>{item}</p>
            <button
              onClick={() => deleteHistoryItem(index)}
              className="bg-red-500 px-3 py-1 rounded-md text-white hover:bg-red-700"
            >
              <MdOutlineDeleteOutline />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default History;
