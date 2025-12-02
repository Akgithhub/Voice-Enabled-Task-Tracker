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
router.delete("/:id", deleteTask);
router.put("/:id", updateTask);

export default router;
