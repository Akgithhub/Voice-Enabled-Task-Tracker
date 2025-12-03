import dotenv from "dotenv";
// import app from "./app.js";
import cors from 'cors'
import tasksRoutes from "./src/routes/tasks.routes.js"
import speechRoutes from "./src/routes/speech.routes.js"
import express from 'express'

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

// gateway route
app.use("/tasks", tasksRoutes);
app.use("/speech", speechRoutes);
// app.use("/nlp", nlpRoutes);

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
