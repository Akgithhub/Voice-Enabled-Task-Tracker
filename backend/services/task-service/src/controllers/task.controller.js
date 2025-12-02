// controllers/task.controller.js
import Task from "../models/Task.model.js";

export const getTask = async (req, res) => {
    try {
        console.log("GET /tasks called");
        res.json({
            message: "Get Task endpoint hit"
        })
    } catch (error) {
        console.log(error);
    }
};

export const createTask = async (req, res) => {
    try {
        const newTask = await Task.create(req.body);
        return res.status(201).json({
            message: "Task created successfully",
            task: newTask
        });
    } catch (error) {
        console.error("Create Task Error:", error);
        return res.status(500).json({
            message: "Failed to create task",
            error: error.message
        });
    }
};

export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Delete Task Error:", error);
        return res.status(500).json({
            message: "Failed to delete task",
            error: error.message
        });
    }
}

export const getAllTask = async (req, res) => {
    try {
        const tasks = await Task.find();
        return res.status(200).json({
            message: "Tasks retrieved successfully",
            tasks: tasks
        });
    }

    catch (error) {
        console.error("Get All Tasks Error:", error);
        return res.status(500).json({
            message: "Failed to retrieve tasks",
            error: error.message
        });
    }
}
export const updateTask = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found Or does'nt exist" });
        }
        const tasktoupdate = await Task.findByIdAndUpdate(id, updates, { new: true });
        if (!tasktoupdate) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json({
            message: "Task updated successfully",
            updatedTask: tasktoupdate,
            previousTask: task
        });

    } catch (error) {
        console.error("Update Task Error:", error);
        return res.status(500).json({
            message: "Failed to update task",
            error: error.message
        });

    }
}
