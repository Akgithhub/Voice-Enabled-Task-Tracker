import dotenv from "dotenv";
dotenv.config();

export default {
  TASK_SERVICE_URL: process.env.TASK_SERVICE_URL,
  SPEECH_SERVICE_URL: process.env.SPEECH_SERVICE_URL,
  // NLP_SERVICE_URL: process.env.NLP_SERVICE_URL"
};
