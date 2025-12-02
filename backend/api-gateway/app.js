import express from "express";
import cors from "cors";
import tasksRoutes from "./src/routes/tasks.routes.js"

const app = express();

app.use(cors());
app.use(express.json());

// gateway route
app.use("/tasks", tasksRoutes);

export default app;
