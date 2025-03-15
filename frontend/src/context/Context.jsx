import { createContext, useState } from "react";
import chatCompletion_meta from "../config/metalama";
import chatCompletion_mistral from "../config/mistral";
import chatCompletion_perplexy from "../config/perplexy";
import chatCompletion_deep from "../config/deepseek";
import chatCompletion_qwen from "../config/Qwen";
import chatCompletion_gemini from "../config/Gemini";
import chatCompletion_ibm from "../config/IBM";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [chooseAI, setChooseAI] = useState("meta-llama"); // ✅ Default AI selected

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
  };

  const getAIResponse = async (prompt) => {
    switch (chooseAI) {
      case "meta-llama":
        return await chatCompletion_meta(prompt);
      case "mistral":
        return await chatCompletion_mistral(prompt);
      case "perplexy":
        return await chatCompletion_perplexy(prompt);
      case "deepseek":
        return await chatCompletion_deep(prompt);
      case "qwen":
        return await chatCompletion_qwen(prompt);
        case "ibm":
        return await chatCompletion_qwen(prompt);
        case "ibm_granite":
        return await chatCompletion_qwen(prompt);
        case "gemma":
        return await chatCompletion_qwen(prompt);
      case "gemini":
      default:
        return await chatCompletion_gemini(prompt);
    }
  };

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);
  
    let query = prompt !== undefined ? prompt : input;
    setRecentPrompt(query);
  
    // Store in localStorage
    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    history.unshift(query); // Add new search at the beginning
    localStorage.setItem("searchHistory", JSON.stringify(history));
  
    let responseText = await getAIResponse(query);
  
    if (!responseText) {
      setResultData("Error: No response received.");
      setLoading(false);
      return;
    }
  
    let responseArray = responseText.split(" ");
    for (let i = 0; i < responseArray.length; i++) {
      delayPara(i, responseArray[i] + " ");
    }
  
    setLoading(false);
  };
  

  const contextValue = {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    prevPrompt,
    setPrevPrompt,
    showResult,
    loading,
    resultData,
    onSent,
    newChat,
    chooseAI,
    setChooseAI,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
