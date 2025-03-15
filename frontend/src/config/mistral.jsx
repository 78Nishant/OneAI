import { HfInference } from "@huggingface/inference";

const client = new HfInference(import.meta.env.VITE_HUGGING_FACE_API);

async function chatCompletion_mistral(prompt) {
  try {
    const chatCompletion = await client.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.3",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      provider: "novita",
      max_tokens: 500,
    });

    return chatCompletion.choices[0].message.content; 
  } catch (error) {
    console.error("Error fetching chat completion:", error);
    return "Error fetching response.";
  }
}

// chatCompletion_mistral("Who is the PM of Israel?").then((response) => {
//   console.log(response); // ✅ Now it will log the AI's response
// });

export default chatCompletion_mistral;
