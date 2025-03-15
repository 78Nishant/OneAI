import { HfInference } from "@huggingface/inference";

const client = new HfInference(import.meta.env.VITE_HUGGING_FACE_API);

async function chatCompletion_ibm(prompt) {
    try {
const chatCompletion = await client.chatCompletion({
    model: "deepseek-ai/DeepSeek-R1",
    messages: [
        {
            role: "user",
            content: prompt
        }
    ],
    provider: "together",
    max_tokens: 500
});

console.log("hello")
console.log(chatCompletion.choices[0].message.content)

return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    return "Error fetching response.";
  }
}

export default chatCompletion_ibm;
