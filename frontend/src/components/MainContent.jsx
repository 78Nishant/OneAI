import React, { useContext, useState, useEffect, useRef } from "react";
import { FaSun, FaMoon, FaChevronDown, FaChevronUp, FaImage } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { BsFillVolumeUpFill, BsFillVolumeMuteFill } from "react-icons/bs";
import { MdContentCopy, MdFileUpload } from "react-icons/md";
import { Context } from "../context/Context";
import { ThemeContext } from "../context/ThemeContext";
import SpeechToText from "./TTS";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import Tesseract from 'tesseract.js';
import { SignInButton, UserButton, useUser, SignOutButton, SignUpButton, useAuth } from "@clerk/clerk-react";

const MainContent = () => {
  const { isSignedIn, user } = useUser();
  const { getToken } = useAuth();
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
    setChatHistory,
  } = useContext(Context);

  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [processingImage, setProcessingImage] = useState(false);
  const [imageText, setImageText] = useState("");
  const [dropIndicatorVisible, setDropIndicatorVisible] = useState(false);

  const saveSearchHistory = async () => {
    if (!user) return "none";
    try {
      const token = await getToken();
      const historyData = {
        id: user.id,
        history: input,
      };
      const response = await axios.post("http://localhost:3000/main/save-history", historyData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("Search history saved:", response.data);
    } catch (error) {
      console.error("Error saving search history:", error.response?.data || error.message);
    }
  };

  const [searchActive, setSearchActive] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
  }, []);

  // Setup global drag and drop event listeners
  useEffect(() => {
    const handleWindowDragEnter = (e) => {
      e.preventDefault();
      setDropIndicatorVisible(true);
    };
    
    const handleWindowDragLeave = (e) => {
      e.preventDefault();
      // Only hide indicator if leaving to an element outside the window
      if (e.relatedTarget === null) {
        setDropIndicatorVisible(false);
      }
    };
    
    const handleWindowDrop = (e) => {
      e.preventDefault();
      setDropIndicatorVisible(false);
    };
    
    // Prevent default to allow drop
    const handleWindowDragOver = (e) => {
      e.preventDefault();
    };
    
    window.addEventListener('dragenter', handleWindowDragEnter);
    window.addEventListener('dragleave', handleWindowDragLeave);
    window.addEventListener('drop', handleWindowDrop);
    window.addEventListener('dragover', handleWindowDragOver);
    
    return () => {
      window.removeEventListener('dragenter', handleWindowDragEnter);
      window.removeEventListener('dragleave', handleWindowDragLeave);
      window.removeEventListener('drop', handleWindowDrop);
      window.removeEventListener('dragover', handleWindowDragOver);
    };
  }, []);
  
  // Setup specific drop area event listeners
  useEffect(() => {
    const dropArea = dropAreaRef.current;
    
    if (!dropArea) return;
    
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };
    
    const handleDragLeave = () => {
      setIsDragging(false);
    };
    
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      setDropIndicatorVisible(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleImageFile(e.dataTransfer.files[0]);
      }
    };
    
    dropArea.addEventListener('dragover', handleDragOver);
    dropArea.addEventListener('dragleave', handleDragLeave);
    dropArea.addEventListener('drop', handleDrop);
    
    return () => {
      if (dropArea) {
        dropArea.removeEventListener('dragover', handleDragOver);
        dropArea.removeEventListener('dragleave', handleDragLeave);
        dropArea.removeEventListener('drop', handleDrop);
      }
    };
  }, []);

  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Process image with Tesseract
    setProcessingImage(true);
    try {
      const result = await Tesseract.recognize(
        file,
        'eng', // English language
        { logger: m => console.log(m) }
      );
      
      const extractedText = result.data.text;
      setImageText(extractedText);
      
      // Update the input field with extracted text
      if (extractedText.trim()) {
        setInput(prev => prev ? `${prev} ${extractedText}` : extractedText);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to extract text from image. Please try again.");
    }
    setProcessingImage(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageFile(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    setImageText("");
  };

  const handleSearch = () => {
    if (input.trim()) {
      setSearchActive(true);
      saveSearchHistory();
      onSent();
    }
  };

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

  const handleStopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };

  const handleCopy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 1500);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const isDark = theme === "dark";
  
  return (
    <div className={`flex flex-col overflow-y-auto min-h-screen w-full transition-all duration-300 ${
      isDark ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800"
    }`}>
      {/* Full-screen drop overlay */}
      {dropIndicatorVisible && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className={`p-12 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-white'} flex flex-col items-center shadow-2xl`}>
            <MdFileUpload className={`text-6xl mb-4 ${
              isDark ? 'text-indigo-400' : 'text-indigo-500'
            } animate-bounce`} />
            <h2 className="text-2xl font-bold mb-2">Drop Your Image Here</h2>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              We'll extract any text from it automatically
            </p>
          </div>
        </div>
      )}
      
      {/* Header with improved styling */}
      <header className={`w-full px-6 py-4 flex justify-between items-center ${
        isDark ? "bg-gray-800/70 shadow-lg" : "bg-white/70 shadow-md"
      } backdrop-blur-md sticky top-0 z-10`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/history")}
            className={`px-4 py-2 rounded-full font-medium transition-all ${
              isDark 
                ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                : "bg-indigo-500 hover:bg-indigo-600 text-white"
            }`}
          >
            History
          </button>
          <button
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-all ${
              isDark 
                ? "bg-gray-700 hover:bg-gray-600 text-yellow-300" 
                : "bg-gray-200 hover:bg-gray-300 text-indigo-600"
            }`}
          >
            {isDark ? <FaSun className="text-xl" /> : <FaMoon className="text-xl" />}
          </button>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <div className={`flex gap-3 items-center rounded-full transition pl-2 pr-4 py-1 ${
              isDark ? "bg-gray-700/70" : "bg-white/90 shadow-sm"
            }`}>
              <UserButton />
              <span className="text-sm font-medium">{user?.fullName}</span>
            </div>
          ) : (
            <div className="flex gap-3">
              <SignInButton mode="modal">
                <button className={`px-4 py-2 rounded-full font-medium transition-all ${
                  isDark 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}>
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className={`px-4 py-2 rounded-full font-medium transition-all ${
                  isDark 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}>
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </header>

      {/* Main content area with animated transitions */}
      <main className="flex-1 flex flex-col items-center px-4 w-full max-w-6xl mx-auto">
        {/* Logo and search section with animation */}
        <div className={`transition-all duration-500 w-full max-w-3xl ${
          searchActive ? "mt-6" : "mt-32"
        } flex flex-col items-center`}>
          {!searchActive && (
            <div className="mb-8 text-center transform transition-all duration-500 hover:scale-105">
              <p className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-lg">
                One-AI
              </p>
              <p className={`mt-3 text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                Your intelligent AI assistant
              </p>
            </div>
          )}

          {/* Enhanced search input */}
          <div className={`flex flex-col w-full rounded-xl transition-all duration-300 ${
            isDark 
              ? "bg-gray-700/70 text-white shadow-xl shadow-purple-900/20" 
              : "bg-white text-gray-800 shadow-lg shadow-blue-200/50"
          } focus-within:ring-2 ${
            isDark ? "focus-within:ring-purple-500" : "focus-within:ring-blue-400"
          }`}>
            <div className="flex items-center w-full py-3 px-6 rounded-full">
              <input
                type="text"
                placeholder="Ask me anything..."
                className={`flex-1 bg-transparent border-none outline-none p-2 text-lg placeholder-${isDark ? 'gray-400' : 'gray-400'}`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <div className="flex items-center gap-2">
                <SpeechToText input={input} setInput={setInput} />
                <button 
                  onClick={openFileDialog}
                  className={`p-3 rounded-full transition-all ${
                    isDark 
                      ? "bg-teal-600 hover:bg-teal-700" 
                      : "bg-teal-500 hover:bg-teal-600"
                  } text-white`}
                  title="Upload or drop an image"
                >
                  <FaImage className="text-xl" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={handleSearch}
                  className={`p-3 rounded-full transition-all ${
                    isDark 
                      ? "bg-indigo-600 hover:bg-indigo-700" 
                      : "bg-indigo-500 hover:bg-indigo-600"
                  } text-white ${!input.trim() && 'opacity-50 cursor-not-allowed'}`}
                  disabled={!input.trim()}
                >
                  <IoMdSend className="text-xl" />
                </button>
              </div>
            </div>

            {/* Image Drop Area */}
            <div 
              ref={dropAreaRef}
              className={`w-full p-3 transition-all duration-300 ${imagePreview ? 'mb-3' : ''}`}
            >
              {imagePreview ? (
                <div className={`relative rounded-lg overflow-hidden p-3 ${
                  isDark ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img 
                        src={imagePreview} 
                        alt="Uploaded" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {processingImage && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                          <div className={`w-6 h-6 rounded-full border-2 border-t-transparent animate-spin ${
                            isDark ? "border-white" : "border-indigo-600"
                          }`}></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            Image Uploaded
                          </p>
                          {processingImage ? (
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              Extracting text...
                            </p>
                          ) : (
                            imageText && (
                              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {imageText.length > 100 ? imageText.substring(0, 100) + '...' : imageText}
                              </p>
                            )
                          )}
                        </div>
                        <button
                          onClick={clearImagePreview}
                          className={`p-1 rounded transition-all ${
                            isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-all cursor-pointer ${
                    isDragging 
                      ? isDark ? 'border-indigo-400 bg-indigo-900/30' : 'border-indigo-400 bg-indigo-50'
                      : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={openFileDialog}
                >
                  <MdFileUpload className={`mx-auto text-3xl ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  } ${isDragging && 'animate-bounce'}`} />
                  <p className={`mt-2 text-sm ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  } ${isDragging && 'font-medium'}`}>
                    {isDragging ? 'Drop your image here!' : 'Drop an image here or click to upload'}
                  </p>
                  <p className={`text-xs mt-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Supported formats: JPG, PNG, GIF, etc.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat history dropdown with animations */}
        {/* {searchActive && (
          <div className="w-full max-w-3xl mt-6 transition-all duration-300">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`w-full flex justify-between items-center px-5 py-3 rounded-xl transition-all ${
                isDark 
                  ? "bg-gray-700/80 hover:bg-gray-600/80 text-white" 
                  : "bg-white/90 hover:bg-gray-100/90 text-gray-800"
              } shadow-md`}
            >
              <span className="font-medium">Chat History</span>
              {showHistory ? <FaChevronUp /> : <FaChevronDown />}
            </button>

            {showHistory && (
              <div className={`mt-2 p-4 rounded-xl max-h-72 overflow-y-auto transition-all duration-300 ${
                isDark ? "bg-gray-800/90 shadow-lg shadow-purple-900/10" : "bg-white/90 shadow-md shadow-blue-200/50"
              }`}>
                {chatHistory.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {chatHistory.map((msg, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-lg transition-all ${
                            msg.role === "user" 
                              ? isDark ? "bg-indigo-600/70" : "bg-indigo-500/70 text-white" 
                              : isDark ? "bg-gray-700/70" : "bg-gray-200/70"
                          } ${msg.role === "user" ? "ml-8" : "mr-8"}`}
                        >
                          <p>{msg.content}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={clearChatHistory}
                      className={`w-full mt-4 px-4 py-2 rounded-lg transition-all ${
                        isDark 
                          ? "bg-red-600/90 hover:bg-red-700/90" 
                          : "bg-red-500/90 hover:bg-red-600/90"
                      } text-white font-medium`}
                    >
                      Clear Chat History
                    </button>
                  </>
                ) : (
                  <p className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    No chat history available
                  </p>
                )}
              </div>
            )}
          </div>
        )} */}

        {/* Search results with enhanced styling */}
        {searchActive && (
          <div className="w-full  my-6 pb-12">
            <div className={`p-6 rounded-2xl transition-all ${
              isDark 
                ? "bg-gray-800/80 shadow-lg shadow-purple-900/10" 
                : "bg-white/90 shadow-md shadow-blue-200/30"
            }`}>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className={`w-12 h-12 rounded-full border-4 border-t-transparent animate-spin ${
                    isDark ? "border-indigo-500" : "border-indigo-600"
                  }`}></div>
                  <p className="mt-4 text-lg">Loading results from {chooseAI}...</p>
                </div>
              ) : (
                <div className="text-lg leading-relaxed">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      code({ inline, className, children, node }) {
                        const codeText = String(children).trim();
                        const codeBlockIndex = node?.position?.start?.line || Math.random();

                        return inline ? (
                          <code className={`px-1.5 py-0.5 rounded ${
                            isDark ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-indigo-700"
                          }`}>
                            {codeText}
                          </code>
                        ) : (
                          <pre
                            className="relative my-4 rounded-xl overflow-x-auto transition-all group"
                          >
                            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleCopy(codeText, codeBlockIndex)}
                                className={`px-2 py-1 rounded text-sm ${
                                  isDark 
                                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                                }`}
                              >
                                {copiedCode === codeBlockIndex ? "Copied!" : "Copy"}
                              </button>
                            </div>
                            <code className={`block p-4 rounded-xl ${
                              isDark ? "bg-gray-900" : "bg-gray-800 text-gray-100"
                            } ${className}`}>
                              {codeText}
                            </code>
                          </pre>
                        );
                      },
                      p: ({ children }) => <p className="mb-4">{children}</p>,
                      h1: ({ children }) => <h1 className={`text-3xl font-bold mt-6 mb-4 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}>{children}</h1>,
                      h2: ({ children }) => <h2 className={`text-2xl font-bold mt-5 mb-3 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}>{children}</h2>,
                      h3: ({ children }) => <h3 className={`text-xl font-bold mt-4 mb-2 ${
                        isDark ? "text-white" : "text-gray-800"
                      }`}>{children}</h3>,
                      ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      blockquote: ({ children }) => <blockquote className={`pl-4 border-l-4 ${
                        isDark ? "border-indigo-500 text-gray-300" : "border-indigo-400 text-gray-600"
                      } my-4 italic`}>{children}</blockquote>,
                    }}
                  >
                    {resultData}
                  </ReactMarkdown>

                  {resultData && (
                    <button
                      onClick={isSpeaking ? handleStopSpeaking : handleSpeak}
                      className={`mt-6 px-5 py-2.5 rounded-full transition-all flex items-center gap-2 ${
                        isDark 
                          ? "bg-indigo-600 hover:bg-indigo-700" 
                          : "bg-indigo-500 hover:bg-indigo-600"
                      } text-white font-medium`}
                    >
                      {isSpeaking ? <BsFillVolumeMuteFill className="text-lg" /> : <BsFillVolumeUpFill className="text-lg" />}
                      {isSpeaking ? "Stop" : "Listen"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainContent;