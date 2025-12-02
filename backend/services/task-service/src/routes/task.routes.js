// routes/task.routes.js
import express from "express";
import { getTask, createTask,deleteTask,getAllTask, updateTask } from "../controllers/task.controller.js";

const taskRouter = express.Router();

taskRouter.get("/getTask", getTask);
taskRouter.get("/getAllTask", getAllTask);
taskRouter.post("/createTask", createTask);
taskRouter.delete("/deleteTask/:id", deleteTask);
taskRouter.put("/updateTask/:id", updateTask);

export default taskRouter;
