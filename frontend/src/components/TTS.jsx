import React, { useContext, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const SpeechToText = ({ input, setInput }) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
//   const {onSent} = useContext(Context);

  useEffect(() => {
    if (!listening && transcript) {
      setInput(transcript); // Save transcript when listening stops
    }
  }, [transcript, listening, setInput]);

  const startListening = () => {
    resetTranscript();
    setInput(""); 
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  };
  

  return (
    <div className="flex gap-3">
      <FaMicrophone
        className={`text-2xl cursor-pointer ${listening ? "text-red-500" : "text-black"}`}
        onClick={startListening}
      />
      {listening && <button className='text-black' onClick={SpeechRecognition.stopListening}>Stop</button>}
    </div>
  );
};

export default SpeechToText;
