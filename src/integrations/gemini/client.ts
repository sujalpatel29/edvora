// src/integrations/gemini/client.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing Gemini API Key! Add VITE_GEMINI_API_KEY in .env");
}

export const genAI = new GoogleGenerativeAI(apiKey);

// Example: Load a model
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
