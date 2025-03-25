import { createContext, useState, useEffect } from "react";
import chatCompletion_response from "../config/Response";

import models from "../../model";
export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompt, setPrevPrompt] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [chooseAI, setChooseAI] = useState("meta-llama");
  const [chatHistory, setChatHistory] = useState([]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    setChatHistory(storedHistory);
  }, []);

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setChatHistory([]);
    localStorage.removeItem("chatHistory"); // Clear stored history
  };

  // we have chooseAI already
  // const getAIResponse = async (prompt) => {
  //   const model=models.find((model)=>model.key===chooseAI);
    
  //   switch (chooseAI) {
  //     case "meta-llama":
  //       return await chatCompletion_meta(prompt);
  //     case "mistral":
  //       return await chatCompletion_mistral(prompt);
  //     case "perplexy":
  //       return await chatCompletion_perplexy(prompt);
  //     case "deepseek":
  //       return await chatCompletion_deep(prompt);
  //     case "qwen":
  //       return await chatCompletion_qwen(prompt);
  //     case "ibm":
  //       return await chatCompletion_ibm(prompt);
  //     case "ibm_granite":
  //       return await chatCompletion_ibm_granite(prompt);
  //     case "gemma":
  //       return await chatCompletion_gemma(prompt);
  //     case "response":
  //       return await chatCompletion_response(model,prompt); //prompt :{query,model,provider}
  //     case "gemini":
  //     default:
  //       return await chatCompletion_gemini(prompt);
  //   }
  // };

  //testing alternate way
  const getAIResponse = async (prompt) => {
    const model=models.find((m)=>m.key===chooseAI);
    return await chatCompletion_response(model,prompt); //prompt :{query,model,provider}
    }


  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let query = prompt !== undefined ? prompt : input; //prompt.query instead of prompt
    // let query = prompt.query !== undefined ? prompt : input;
    setRecentPrompt(query);

    // Store in search history
    let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    searchHistory.unshift(query);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    let responseText = await getAIResponse(query); //pass prompt here

    //alternate way
    //let responseText = await chatCompletion_response(prompt);


    if (!responseText) {
      setResultData("Error: No response received.");
      setLoading(false);
      return;
    }

    let responseArray = responseText.split(" ");
    for (let i = 0; i < responseArray.length; i++) {
      delayPara(i, responseArray[i] + " ");
    }

    // Store chat message in history
    const newChatHistory = [
      ...chatHistory,
      { role: "user", content: query },
      { role: "ai", content: responseText },
    ];
    setChatHistory(newChatHistory);
    localStorage.setItem("chatHistory", JSON.stringify(newChatHistory));

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
    chatHistory,
    setChatHistory,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
