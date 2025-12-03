import express from 'express'
import dotenv from 'dotenv';
import cors from 'cors';
import taskRouter from './src/routes/task.routes.js'
import connectDB from './src/config/db.config.js';

connectDB();

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    httpOnly: true,
    methods: "GET,POST,PUT,DELETE,PATCH",
  })
);
app.use('/task', taskRouter);

app.get('/task-service', (req, res) => {
    res.send('Task Service is running');
});

app.listen(PORT, () => {
    console.log(`Task Service is running on port ${PORT}`);
});