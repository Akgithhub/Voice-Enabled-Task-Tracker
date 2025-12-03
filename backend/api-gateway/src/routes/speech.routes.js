import express from 'express';
import { speectranscribe } from '../controllers/speech.controller.js';
import multer from 'multer';

const upload = multer();
const speechRoutes = express.Router();

speechRoutes.post('/speectranscribe', upload.single("audio"), speectranscribe);

export default speechRoutes;