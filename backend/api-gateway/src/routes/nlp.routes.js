import express from 'express';
import { aiParser } from '../controllers/nlp.controller.js';
const speechRoutes = express.Router();

speechRoutes.post('/aiparser',aiParser);

export default speechRoutes;