import express from 'express'

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.get('/nlp-service', (req, res) => {
    res.send('NLP Service is running');
});

app.listen(PORT, () => {
    console.log(`NLP Service is running on port ${PORT}`);
});