// src/integrations/gemini/generate.ts
import { model } from "./client";

export async function generateText(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! Something went wrong while generating a response.";
  }
}
