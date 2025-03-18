import { HfInference } from "@huggingface/inference";

const client = new HfInference(import.meta.env.VITE_HUGGING_FACE_API);

async function chatCompletion_response(prompt) {
    try {
const chatCompletion = await client.chatCompletion({
    model: prompt.model,
    messages: [
        {
            role: "user",
            content: prompt.query
        }
    ],
    provider: prompt.provider,
    max_tokens: 500,
});

return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    return "Error fetching response.";
  }
}

export default chatCompletion_response;