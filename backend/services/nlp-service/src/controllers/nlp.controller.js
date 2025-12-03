import genAI from "../clients/gemini.client.js";
import { transcibeParserPrompt } from "../utils/parseUtils.js";

function cleanJSON(text) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

export const parseVoiceCommand = async (req, res) => {
  try {
    const transcript = req.body.transcribe;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `${transcibeParserPrompt} Transcript: "${transcript}"`;

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    const cleaned = cleanJSON(text);

    const parsedJson = JSON.parse(cleaned);

    res.json({ result: parsedJson });
  } catch (err) {
    console.error("Voice Parse Error:", err);
    res.status(500).json({ error: "Voice parsing failed" });
  }
};
