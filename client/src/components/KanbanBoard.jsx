import React from "react";
import { useTasks } from "../context/TaskContext";
import TaskCard from "./TaskCard";

const STATUSES = ["To Do", "In Progress", "Review", "Done"];

export default function KanbanBoard({ onEdit }) {
    const { tasks, updateTask } = useTasks();

    const onDragStart = (e, id) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("taskId", id);
    };

    const onDrop = (e, newStatus) => {
        e.preventDefault();
        const id = e.dataTransfer.getData("taskId");
        updateTask(id, { status: newStatus });
    };

    const allowDrop = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {STATUSES.map((status) => (
                <div
                    key={status}
                    className="bg-white p-3 rounded shadow h-[60vh] overflow-auto"
                    onDragOver={allowDrop}
                    onDrop={(e) => onDrop(e, status)}
                >
                    <h3 className="font-semibold mb-2">{status}</h3>

                    {tasks
                        .filter((t) => t.status === status)
                        .map((task) => (
                            <div
                                key={task.id}
                                draggable={true}
                                onDragStart={(e) => onDragStart(e, task.id)}
                                className="cursor-grab active:cursor-grabbing"
                            >
                                <TaskCard
                                    task={task}
                                    onClick={() => onEdit(task)}
                                />
                            </div>
                        ))}
                </div>
            ))}
        </div>
    );
}
