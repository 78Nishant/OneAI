import { HfInference } from "@huggingface/inference";

const client = new HfInference(import.meta.env.VITE_HUGGING_FACE_API);

async function chatCompletion_qwen(prompt) {
  try {
    const chatCompletion = await client.chatCompletion({
      model: "Qwen/QwQ-32B",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      provider: "fireworks-ai",
      max_tokens: 500,
    });
	return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    return "Error fetching response.";
  }
}



export default chatCompletion_qwen;
