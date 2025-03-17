import React, { useContext, useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoLogOut } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { BsFillVolumeUpFill, BsFillVolumeMuteFill } from "react-icons/bs";
import { Context } from "../context/Context";
import { ThemeContext } from "../context/ThemeContext";
import SpeechToText from "./TTS";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Enables strikethroughs, tables, etc.
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const MainContent = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const {
    input,
    setInput,
    loading,
    resultData,
    onSent,
    chooseAI,
    chatHistory,
    setChatHistory, // ✅ Added to clear chat history
  } = useContext(Context);

  const [searchActive, setSearchActive] = useState(false);
  const [user, setUser] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null); // ✅ Track copied code block

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleSearch = () => {
    if (input.trim()) {
      setSearchActive(true);
      onSent();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  // 🔊 TTS Function
  const handleSpeak = () => {
    if (!resultData) return;
    const utterance = new SpeechSynthesisUtterance(resultData);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  // 🔇 Stop TTS
  const handleStopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // 🗑️ Clear Chat History
  const clearChatHistory = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };


  // 📋 Copy code to clipboard
  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(index); // Mark the copied code block
      setTimeout(() => setCopiedCode(null), 1500); // Reset after 1.5 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen w-full transition-all duration-300 ${theme === "dark" ? "bg-[#1D1E20] text-white" : "bg-gray-100 text-black"
      } items-center relative`}
    >
      {/* HEADER */}
      <div className="w-full px-5 flex justify-between items-center text-xl p-3">
        <button
          onClick={() => navigate("/history")}
          className="px-3 py-1 rounded-md hover:bg-blue-600 transition font-bold"
        >
          History
        </button>

        <div className="flex gap-4 items-center">
          <button
            onClick={toggleTheme}
            className={`text-2xl p-2 rounded-full transition ${theme === "dark" ? "bg-gray-700 text-yellow-400" : "bg-gray-300 text-gray-800"
              }`}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {user ? (
            <>
              <div
                className={`flex gap-2 items-center cursor-pointer p-2 rounded-lg transition ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                onClick={() => navigate("/profile")}
              >
                <CgProfile className="text-3xl" />
                <span className="text-sm">{user.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition flex items-center"
              >
                <IoLogOut className="text-xl" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-500 px-3 py-1 rounded-md hover:bg-blue-600 transition"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-600 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className={`transition-all duration-300 w-full max-w-[900px] px-5 ${searchActive ? "mt-5" : "mt-[30vh]"} flex flex-col items-center`}>
        {!searchActive && <p className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-orange-600 drop-shadow-lg ml-3 mt-2 cursor-pointer">One-AI</p>}

        <div className={`flex items-center w-full py-2 px-5 rounded-full mt-5 transition ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
          }`}
        >
          <input
            type="text"
            placeholder="Search here..."
            className="flex-1 bg-transparent border-none outline-none p-2 text-lg"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <SpeechToText input={input} setInput={setInput} />
          {input && (
            <IoMdSend
              onClick={handleSearch}
              className="text-2xl cursor-pointer ml-5 transition"
            />
          )}
        </div>
      </div>

      {/* CHAT HISTORY DROPDOWN */}
      <div className="w-full max-w-[900px] mt-5">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex justify-between items-center bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
        >
          Chat History {showHistory ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {showHistory && (
          <div className="mt-2 p-3 bg-gray-600 rounded-md max-h-60 overflow-y-auto">
            {chatHistory.length > 0 ? (
              <>
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`p-2 my-2 rounded ${msg.role === "user" ? "bg-blue-600" : "bg-gray-700"}`}>
                    <p>{msg.content}</p>
                  </div>
                ))}
                <button
                  onClick={clearChatHistory}
                  className="w-full mt-3 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Clear Chat History
                </button>
              </>
            ) : (
              <p className="text-gray-300">No chat history available.</p>
            )}
          </div>
        )}
      </div>

      {/* SEARCH RESULTS */}
      {searchActive && (
        <div className="w-full px-5 mt-5">
          <div className="py-0 px-[5%] max-h-[70vh] overflow-y-scroll scrollbar">
            <div className="flex items-start gap-5 mt-10">
              {loading ? (
                <p>Loading results from {chooseAI}...</p>
              ) : (
                <div className="text-lg font-[400] leading-[1.8] transition">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]} // Enables strikethroughs (~text~)
                    rehypePlugins={[rehypeHighlight]} // Enables syntax highlighting
                    components={{
                      code({ inline, className, children, node }) {
                        const codeText = String(children).trim();
                        const codeBlockIndex = node?.position?.start?.line || Math.random(); // Unique key for tracking copied state

                        return inline ? (
                          <code className="bg-gray-800 text-yellow-400 px-1 rounded">{codeText}</code>
                        ) : (
                          <pre
                            className="relative bg-gray-900 p-4 rounded-lg overflow-x-auto cursor-pointer hover:bg-gray-800 transition"
                            onClick={() => handleCopy(codeText, codeBlockIndex)}
                          >
                            <code className={className}>{codeText}</code>
                            {copiedCode === codeBlockIndex && (
                              <span className="absolute top-2 right-2 text-sm text-green-400">Copied!</span>
                            )}
                          </pre>
                        );
                      },
                    }}
                  >
                    {resultData}
                  </ReactMarkdown>

                  {resultData && (
                    <button
                      onClick={isSpeaking ? handleStopSpeaking : handleSpeak}
                      className="mt-3 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 flex items-center gap-2"
                    >
                      {isSpeaking ? <BsFillVolumeMuteFill /> : <BsFillVolumeUpFill />}
                      {isSpeaking ? "Stop" : "Listen"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
