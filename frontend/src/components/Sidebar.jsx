import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { FaThumbtack } from "react-icons/fa";
import aiModels from "../../model";

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedModels, setPinnedModels] = useState([]); // Store pinned models
  const { setChooseAI, chooseAI, onSent } = useContext(Context);
  const navigate = useNavigate();

  // Select AI model
  const handleSelectAI = async (key) => {
    setChooseAI(key);
    await onSent();
  };

  // Toggle pinning models
  const togglePinModel = (key) => {
    setPinnedModels((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  // Filter models based on search input
  const filteredModels = aiModels.filter((ai) =>
    ai.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate pinned and unpinned models
  const pinned = filteredModels.filter((ai) => pinnedModels.includes(ai.key));
  const unpinned = filteredModels.filter((ai) => !pinnedModels.includes(ai.key));

  return (
    <div className="w-[22%] bg-[#171717] text-white flex flex-col">
      <div className="sticky z-10">
        <p
          onClick={() => navigate("/")}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-600 drop-shadow-lg ml-3 mt-2 cursor-pointer"
        >
          One-AI
        </p>

        {/* Search Input */}
        <div className="w-full flex justify-center">
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 text-black border-none focus:outline-none bg-[#E5E7EB] rounded-xl w-9/10 h-12 mt-4"
          />
        </div>
      </div>

      {/* AI Model List */}
      <div className="flex flex-col flex-grow overflow-y-auto animate-fadeIn duration-1000 p-5">
        {[...pinned, ...unpinned].length > 0 ? (
          [...pinned, ...unpinned].map((ai) => (
            <div
              key={ai.key}
              className="relative group flex items-center justify-between"
            >
              <button
                onClick={() => handleSelectAI(ai.key)}
                className={`flex items-center gap-2 font-semibold w-full mt-2 py-2 px-3 text-[16px] cursor-pointer rounded-md transition ${
                  chooseAI === ai.key
                    ? "bg-[#3c3b3b] text-white"
                    : "bg-[#171717] hover:bg-gray-400 text-white"
                }`}
              >
                <img
                  className="rounded-full h-10 w-10 mr-2"
                  src={ai.img_src}
                  alt={ai.name}
                />
                {ai.name}
              </button>

              {/* Pin Icon Logic */}
              {pinnedModels.includes(ai.key) ? (
                // Always show yellow pin if pinned
                <FaThumbtack
                  className="absolute right-3 mt-2 text-lg text-yellow-400 cursor-pointer"
                  onClick={() => togglePinModel(ai.key)}
                />
              ) : (
                // Show gray pin only on hover if unpinned
                <FaThumbtack
                  className="absolute right-3 text-lg text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                  onClick={() => togglePinModel(ai.key)}
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center mt-5">No models found</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
