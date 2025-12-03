import express from 'express';
import { parseVoiceCommand } from '../controllers/nlp.controller.js';
const nlpRouter = express.Router();
nlpRouter.post('/parse',parseVoiceCommand);
export default nlpRouter;