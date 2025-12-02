import express from "express";
import {transcribeSpeech} from '../controllers/speech.controller.js'
import { upload } from "../middlewares/uploadAudio.js";

const speechTranscribeRouter = express.Router();

speechTranscribeRouter.post("/transcribe",upload.single("audio"), transcribeSpeech);
export default speechTranscribeRouter;
