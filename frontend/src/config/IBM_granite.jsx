import { HfInference } from "@huggingface/inference";

const client = new HfInference(import.meta.env.VITE_HUGGING_FACE_API);

async function chatCompletion_ibm_granite(prompt) {
    try {
const chatCompletion = await client.chatCompletion({
	model: "ibm-granite/granite-3.2-2b-instruct",
	messages: [
		{
			role: "user",
			content: prompt
		}
	],
	provider: "hf-inference",
	max_tokens: 500,
});

return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    return "Error fetching response.";
  }
}

export default chatCompletion_ibm_granite;

