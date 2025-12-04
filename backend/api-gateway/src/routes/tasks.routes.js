import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTask,
  updateTask
} from "../controllers/tasks.controller.js";

const router = express.Router();

router.post("/ct", createTask);
router.get("/getTasks", getAllTasks);
router.get("/:id", getTaskById);
router.delete("/delt/:id", deleteTask);
router.put("/udt/:id", updateTask);

export default router;
