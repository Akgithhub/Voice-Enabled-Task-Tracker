import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import nlpRouter from './src/routes/nlp.routes.js' 
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;
app.use(express.json());
app.use(cors())
app.use('/nlp', nlpRouter);
app.get('/nlp-service', (req, res) => {
    res.send('NLP Service is running');
});

app.listen(PORT, () => {
    console.log(`NLP Service is running on port ${PORT}`);
});