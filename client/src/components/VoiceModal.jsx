import React, { useState, useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import api from "../api/api";

const VoiceModal = ({ open, setOpen }) => {
    const { createTask } = useContext(TaskContext);

    const [transcript, setTranscript] = useState("");
    const [parsed, setParsed] = useState(null);

    // ----------------------------------------------------
    // Simulate the voice flow (replace with real API later)
    // ----------------------------------------------------
    const simulateTranscribe = async () => {
        const fakeTranscript =
            "Create a high priority task to review the pull request by tomorrow";

        setTranscript(fakeTranscript);

        try {
            const res = await api.post("/voice/parse", {
                transcript: fakeTranscript,
            });

            setParsed(res.data);
        } catch (err) {
            console.error("Parse failed", err);
        }
    };

    // ----------------------------------------------------
    // Create Task from parsed values
    // ----------------------------------------------------
    const onCreateTask = async () => {
        const payload = {
            title: parsed.title || transcript,
            description: parsed.description || "",
            priority: parsed.priority || "Medium",
            status: parsed.status || "To Do",
            dueDate: parsed.dueDate || "",
        };

        await createTask(payload);
        setOpen(false);
    };

    // ----------------------------------------------------
    // Component Closed? Don't render anything
    // ----------------------------------------------------
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-4 rounded w-full max-w-lg shadow">
                <h3 className="font-semibold mb-3">Voice Task Creation</h3>

                <div className="space-y-4">

                    {/* Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={simulateTranscribe}
                            className="px-3 py-1 border rounded"
                        >
                            Simulate Transcribe
                        </button>

                        <button
                            onClick={() => {
                                setTranscript("");
                                setParsed(null);
                            }}
                            className="px-3 py-1 border rounded"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Transcript */}
                    <div>
                        <div className="text-sm text-gray-500">Transcript:</div>
                        <div className="p-2 border min-h-12 rounded">
                            {transcript ? (
                                transcript
                            ) : (
                                <em className="text-gray-400">
                                    No transcript yet
                                </em>
                            )}
                        </div>
                    </div>

                    {/* Parsed Preview */}
                    <div>
                        <div className="text-sm text-gray-500">
                            Parsed Preview (editable):
                        </div>

                        {parsed ? (
                            <div className="p-3 border rounded space-y-3">

                                <input
                                    className="w-full p-2 border rounded"
                                    placeholder="Title"
                                    value={parsed.title}
                                    onChange={(e) =>
                                        setParsed({ ...parsed, title: e.target.value })
                                    }
                                />

                                <div className="flex gap-2">
                                    <select
                                        value={parsed.priority}
                                        onChange={(e) =>
                                            setParsed({
                                                ...parsed,
                                                priority: e.target.value,
                                            })
                                        }
                                        className="p-2 border rounded"
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                    </select>

                                    <input
                                        type="date"
                                        value={parsed.dueDate || ""}
                                        onChange={(e) =>
                                            setParsed({
                                                ...parsed,
                                                dueDate: e.target.value,
                                            })
                                        }
                                        className="p-2 border rounded"
                                    />

                                    <select
                                        value={parsed.status}
                                        onChange={(e) =>
                                            setParsed({
                                                ...parsed,
                                                status: e.target.value,
                                            })
                                        }
                                        className="p-2 border rounded"
                                    >
                                        <option>To Do</option>
                                        <option>In Progress</option>
                                        <option>Review</option>
                                        <option>Done</option>
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setParsed(null);
                                            setTranscript("");
                                        }}
                                        className="px-3 py-1 border rounded"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={onCreateTask}
                                        className="px-3 py-1 bg-blue-600 text-white rounded"
                                    >
                                        Create Task
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-2 border rounded">
                                No parsed data yet
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceModal;
