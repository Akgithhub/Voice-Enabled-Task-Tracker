// clients/gemini.client.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { configDotenv } from "dotenv";
configDotenv()
const gemini_api_key = process.env.GEMINI_API_KEY
if (!gemini_api_key) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
}
const genAI = new GoogleGenerativeAI(gemini_api_key);

export default genAI;
