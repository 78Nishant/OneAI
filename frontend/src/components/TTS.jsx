import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";

const SpeechToText = ({ input, setInput }) => {
  const [listening, setListening] = useState(false);

  const handleSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript); // Set the input field with speech text
    };

    recognition.start();
  };

  return (
    <FaMicrophone
      className={`text-2xl cursor-pointer ${listening ? "text-red-500" : "text-black"}`}
      onClick={handleSpeechRecognition}
    />
  );
};

export default SpeechToText;
