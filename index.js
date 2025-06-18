import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv'; // Import dotenv
dotenv.config(); // Call config method

// Access the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

main(); // Call main function