import { HfInference } from "@huggingface/inference";

const client = new HfInference(import.meta.env.VITE_HUGGING_FACE_API);

async function chatCompletion_meta(prompt) {
  try {
    const response = await client.chatCompletion({
      model: "meta-llama/Llama-3.3-70B-Instruct",
      messages: [
        {
          role: "user",
          content: prompt, 
        }
      ],
      provider: "novita",
      max_tokens: 500,
    });

    
    console.log(response.choices[0].message.content)

    return response.choices[0].message.content; 
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    return "Error fetching response.";
  }
}

export default chatCompletion_meta; 


