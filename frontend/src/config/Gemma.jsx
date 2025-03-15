import { HfInference } from "@huggingface/inference";

const client = new HfInference(import.meta.env.VITE_HUGGING_FACE_API);

async function chatCompletion_gemma(prompt) {
    try {
const output = await client.textGeneration({
	model: "google/gemma-2-2b-it",
	inputs: prompt,
	provider: "hf-inference",
});
return output.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    return "Error fetching response.";
  }
}

export default chatCompletion_gemma;

