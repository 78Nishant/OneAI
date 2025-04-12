import React, { useState, useEffect } from "react";
import { MdOutlineDeleteOutline, MdHistory, MdDeleteSweep } from "react-icons/md";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

const History = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        console.log("User not logged in");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const token = await getToken();
        const userInfo = {
          id: user.id
        };
        
        const res = await axios.post("http://localhost:3000/main/get-history", userInfo, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        
        setHistory(res.data.history);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching history:", err);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, getToken]);

  const deleteHistoryItem = async (id, index) => {
    try {
      if (user) {
        const token = await getToken();
        await axios.delete(`http://localhost:3000/main/delete-history-item/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      }
      
      const updatedHistory = history.filter((_, i) => i !== index);
      setHistory(updatedHistory);
    } catch (err) {
      console.error("Error deleting history item:", err);
    }
  };

  const clearAllHistory = async () => {
    try {
      if (user) {
        const token = await getToken();
        await axios.delete(`http://localhost:3000/main/clear-history/${user.id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      }
      
      setHistory([]);
    } catch (err) {
      console.error("Error clearing history:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen h-auto w-screen bg-gradient-to-b from-gray-900 to-black text-white p-3 overflow-x-auto">
      <div className="flex items-center mb-8 border-b border-gray-700 pb-4">
        <MdHistory className="text-blue-400 text-3xl mr-3" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Search History</h2>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {history.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={clearAllHistory}
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-lg"
              >
                <MdDeleteSweep className="text-lg" />
                Clear All History
              </button>
            </div>
          )}

          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 ">
              <MdHistory className="text-6xl mb-4 opacity-30" />
              <p className="text-xl">No search history available</p>
              <p className="text-sm mt-2">Your previous searches will appear here</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {history.map((item, index) => (
                <div 
                  key={index} 
                  className="flex justify-between h-auto w-screen items-center bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300"
                >
                  <p className="text-lg text-gray-200 truncate">{item}</p>
                  <button
                    onClick={() => deleteHistoryItem(item.id || index, index)}
                    className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-full text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md"
                    aria-label="Delete item"
                  >
                    <MdOutlineDeleteOutline className="text-xl" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;