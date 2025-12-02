import express from "express";
import speechTranscribeRouter from "./src/routes/speech.routes.js";
import dotenv from 'dotenv'
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
app.use("/speech", speechTranscribeRouter);
app.get("/speech-service", (req, res) => {
  res.send("Speech Service is running");
});

app.listen(PORT, () => {
  console.log(`Speech Service is running on port ${PORT}`);
});
