import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import { ThemeContext } from "../context/ThemeContext";
import { FaThumbtack, FaSearch, FaStar } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import aiModels from "../../model";

const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedModels, setPinnedModels] = useState([]);
  const { setChooseAI, chooseAI, onSent } = useContext(Context);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const isDark = theme === "dark";

  // Load pinned models from localStorage on component mount
  useEffect(() => {
    const storedPins = localStorage.getItem("pinnedModels");
    if (storedPins) {
      setPinnedModels(JSON.parse(storedPins));
    }
  }, []);

  // Save pinned models to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pinnedModels", JSON.stringify(pinnedModels));
  }, [pinnedModels]);

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

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Filter models based on search input
  const filteredModels = aiModels.filter((ai) =>
    ai.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate pinned and unpinned models
  const pinned = filteredModels.filter((ai) => pinnedModels.includes(ai.key));
  const unpinned = filteredModels.filter((ai) => !pinnedModels.includes(ai.key));

  return (
    <div className={`w-72 flex flex-col transition-all duration-300 ${
      isDark 
        ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" 
        : "bg-gradient-to-br from-indigo-50 to-blue-50 text-gray-800"
    } border-r ${
      isDark ? "border-gray-700" : "border-gray-200"
    }`}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-4 pt-4 pb-2">
        <div 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer mb-4 transform transition hover:scale-105"
        >
          <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            One-AI
          </p>
        </div>

        {/* Search Input with clear button */}
        <div className={`relative flex items-center mt-2 ${
          isDark 
            ? "bg-gray-700/70 text-white" 
            : "bg-white text-gray-800"
        } rounded-xl overflow-hidden focus-within:ring-2 ${
          isDark ? "focus-within:ring-purple-500" : "focus-within:ring-blue-400"
        } transition-all`}>
          <div className="flex items-center px-3 py-2">
            <FaSearch className={`${isDark ? "text-gray-400" : "text-gray-500"}`} />
          </div>
          <input
            type="text"
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 p-2 border-none focus:outline-none ${
              isDark ? "bg-transparent placeholder-gray-400" : "bg-transparent placeholder-gray-400"
            }`}
          />
          {searchQuery && (
            <button 
              onClick={clearSearch}
              className={`px-3 text-lg ${isDark ? "text-gray-400" : "text-gray-500"} hover:text-gray-300`}
            >
              <IoMdClose />
            </button>
          )}
        </div>
      </div>

      {/* Categories Section */}
      {pinnedModels.length > 0 && (
        <div className={`px-4 py-3 ${isDark ? "bg-gray-800/50" : "bg-white/50"}`}>
          <div className="flex items-center gap-2 mb-2">
            <FaStar className={`text-sm ${isDark ? "text-yellow-400" : "text-yellow-500"}`} />
            <h3 className="font-medium text-sm uppercase tracking-wider">Pinned Models</h3>
          </div>
          
          <div className="space-y-1.5">
            {pinned.map((ai) => (
              <ModelItem 
                key={ai.key}
                ai={ai}
                isSelected={chooseAI === ai.key}
                isPinned={true}
                togglePin={togglePinModel}
                onSelect={handleSelectAI}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      )}

      {/* AI Model List */}
      <div className="flex-grow overflow-y-auto px-4 py-3">
        {pinnedModels.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-medium text-sm uppercase tracking-wider">All Models</h3>
          </div>
        )}
        
        <div className="space-y-1.5">
          {unpinned.length > 0 ? (
            unpinned.map((ai) => (
              <ModelItem 
                key={ai.key}
                ai={ai}
                isSelected={chooseAI === ai.key}
                isPinned={false}
                togglePin={togglePinModel}
                onSelect={handleSelectAI}
                isDark={isDark}
              />
            ))
          ) : (
            filteredModels.length === 0 && (
              <div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                <p>No models match your search</p>
                {searchQuery && (
                  <button 
                    onClick={clearSearch}
                    className={`mt-2 px-3 py-1 rounded-md ${
                      isDark 
                        ? "bg-gray-700 hover:bg-gray-600" 
                        : "bg-gray-200 hover:bg-gray-300"
                    } text-sm transition-colors`}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className={`p-4 text-center text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        <p>© 2025 One-AI</p>
      </div>
    </div>
  );
};

// Extracted Model Item component for cleaner code
const ModelItem = ({ ai, isSelected, isPinned, togglePin, onSelect, isDark }) => {
  return (
    <div
      className="relative group flex items-center justify-between rounded-lg overflow-hidden transition-all duration-200"
    >
      <button
        onClick={() => onSelect(ai.key)}
        className={`flex items-center w-full p-2.5 rounded-lg transition-all ${
          isSelected
            ? isDark 
              ? "bg-indigo-600/80 text-white" 
              : "bg-indigo-500/80 text-white"
            : isDark 
              ? "bg-gray-800/60 hover:bg-gray-700/70" 
              : "bg-white/70 hover:bg-gray-100/90"
        }`}
      >
        <div className="relative">
          <img
            className="rounded-full h-10 w-10 object-cover border-2 mr-3"
            style={{ borderColor: isSelected ? (isDark ? '#a5b4fc' : '#818cf8') : 'transparent' }}
            src={ai.img_src}
            alt={ai.name}
          />
          {isSelected && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${isSelected ? "text-white" : ""}`}>
            {ai.name}
          </p>
          {ai.description && (
            <p className={`text-xs truncate ${
              isSelected
                ? "text-indigo-100" 
                : isDark ? "text-gray-400" : "text-gray-500"
            }`}>
              {ai.description}
            </p>
          )}
        </div>
      </button>

      {/* Pin Icon with improved visibility and styling */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePin(ai.key);
        }}
        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
          isPinned
            ? isDark 
              ? "bg-yellow-500/20 text-yellow-400" 
              : "bg-yellow-100 text-yellow-600"
            : isDark 
              ? "opacity-0 group-hover:opacity-100 bg-gray-700/50 text-gray-400 hover:text-gray-300" 
              : "opacity-0 group-hover:opacity-100 bg-gray-200/80 text-gray-500 hover:text-gray-700"
        }`}
      >
        <FaThumbtack className="text-sm" />
      </button>
    </div>
  );
};

export default Sidebar;