import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState(""); // 🔍 Search query state
  const { setChooseAI, chooseAI, onSent } = useContext(Context);
  const navigate = useNavigate();

  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  const saveUser = async () => {
    try {
      
      const token = await getToken();

      console.log("token is",token)

      if (!token) {
        alert("No authentication token found. Please sign in.");
        return;
      }
      await axios.post(
        "http://localhost:3000/main/save-user",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User info saved!");
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const aiModels = [
    { name: "Meta-Llama", key: "meta-llama", img_src: "https://asset.kompas.com/crops/lFgJr6bjgPhh0Xs0dli1Z7ybLwg=/109x0:909x533/1200x800/data/photo/2024/07/25/66a1c8562d0ef.png" },
    { name: "Gemini", key: "gemini", img_src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9HHof-iCZDrNOvABgMhjBGUuySGtYUhrdKw&s" },
    { name: "DeepSeek", key: "deepseek", img_src: "https://miro.medium.com/v2/resize:fit:1400/1*O6RL_ZCq88aMkgPb-FhA1g.png" },
    { name: "Perplexity", key: "perplexy", img_src: "https://assets.bizclikmedia.net/1800/b9c92286e658119663b97a2267aee9d1:0006bf344b145b7046bf9b5f43b7a786/perplexity-logo.webp" },
    { name: "Qwen", key: "qwen", img_src: "https://miro.medium.com/v2/resize:fit:1400/0*mzqlZrYuFnX0HNRZ.png" },
    { name: "Mistral", key: "mistral", img_src: "https://images.indianexpress.com/2025/02/Mistral-.jpg" },
    { name: "IBM", key: "ibm", img_src: "https://developer-blogs.nvidia.com/wp-content/uploads/2024/10/IBM-Granite-Models-NVIDIA-1.png" },
    { name: "IBM_Granite", key: "ibm_granite", img_src: "https://developer-blogs.nvidia.com/wp-content/uploads/2024/10/IBM-Granite-Models-NVIDIA-1.png" },
    { name: "Gemma", key: "gemma", img_src: "https://res.infoq.com/news/2024/02/google-gemma-open-model/en/headerimage/generatedHeaderImage-1708977571481.jpg" },
  ];

  // Function to handle AI selection
  const handleSelectAI = async (key) => {
    setChooseAI(key);
    await onSent();
  };

  const filteredModels = aiModels.filter((ai) =>
    ai.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[22%] bg-[#171717] text-white">
      <p onClick={() => navigate("/")} className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-600 drop-shadow-lg ml-3 mt-2 cursor-pointer">
        One-AI
      </p>
      
      {/* Search Input */}
      
      <div className="w-full flex justify-center">
        <input
          type="text"
          placeholder="Search models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // 🔍 Update searchQuery
          className="p-2 text-black border-none focus:outline-none bg-[#E5E7EB] rounded-xl w-9/10 h-12 mt-4"
        />
      </div>

      {/* AI Model List */}
      <div className="flex flex-col animate-fadeIn duration-1000 p-5">
        {filteredModels.length > 0 ? (
          filteredModels.map((ai) => (
            <button
              key={ai.key}
              onClick={() => handleSelectAI(ai.key)}
              className={`font-semibold w-full mt-[10px] inline-flex items-center gap-[10px] py-[10px] px-[15px] text-[16px] cursor-pointer rounded-md transition
              ${chooseAI === ai.key ? "bg-[#3c3b3b] text-white" : "bg-[#171717] hover:bg-gray-400 text-white"}`}
            >
              <img className="scale-115 rounded-full h-10 w-10 mr-2" src={ai.img_src} alt={ai.name} />
              {ai.name}
            </button>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-5">No models found</p>
        )}
        <button onClick={saveUser} className=" cursor-pointer bg-red-500 text-white font-semiboldtext-center">Save User </button>
      </div>
    </div>
  );
};

export default Sidebar;
