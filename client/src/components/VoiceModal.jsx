import React, { useState, useContext } from "react";
import { TaskContext } from "../context/TaskContext.jsx";
import api from "../api.js";

const VoiceModal = ({ open, setOpen }) => {
    const { createTask } = useContext(TaskContext);

    const [transcript, setTranscript] = useState("");
    const [parsed, setParsed] = useState(null);

    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [recording, setRecording] = useState(false);

    // ----------------------------------------------------
    // Start Recording
    // ----------------------------------------------------
    const startRecording = async () => {
        try {
            // console.log("Requesting audio permission...");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Pick the best supported MIME type
            const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
                ? "audio/webm;codecs=opus"
                : "audio/webm";

            const recorder = new MediaRecorder(stream, { mimeType });

            let chunks = [];
            setAudioChunks([]); // reset React state
            setMediaRecorder(recorder);

            recorder.ondataavailable = (e) => {
                chunks.push(e.data);        // local array
                setAudioChunks((prev) => [...prev, e.data]); // react state (optional)
            };

            // IMPORTANT: define BEFORE .stop()
            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: mimeType });
                // console.log("Final audio blob:", blob);

                await uploadAudioAndTranscribe(blob);
            };

            recorder.start();
            setRecording(true);

            console.log("Recording started with:", mimeType);
        } catch (err) {
            console.error("Failed to start recording:", err);
        }
    };


    // ----------------------------------------------------
    // Stop Recording → Auto Upload + Transcribe
    // ----------------------------------------------------
    const stopRecording = () => {
        if (!mediaRecorder) return;

        console.log("Stopping recording...");
        mediaRecorder.stop();
        setRecording(false);
    };


    // ----------------------------------------------------
    // Upload + Transcribe Function (Used by both recorder and file upload)
    // ----------------------------------------------------
    const uploadAudioAndTranscribe = async (blobOrFile) => {
        try {
            console.log("Uploading audio to backend for transcription...");

            const form = new FormData();
            form.append("audio", blobOrFile, "recording.webm");

            const res = await api.post("/speech/speectranscribe", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("Transcription response:", res.data);
            setTranscript(res.data.transcript);
            // setTranscript(res.data.transcript);
            await parseTranscript(res.data.transcript);

        } catch (err) {
            console.error("Transcription failed:", err);
        }
    };


    // ----------------------------------------------------
    // Parse Transcript through API
    // ----------------------------------------------------
    // ----------------------------------------------------
    // Parse Transcript (AI NLP Parser)
    // ----------------------------------------------------
    const parseTranscript = async (text) => {
        try {
            console.log("Sending transcript to parser:", text);

            const res = await api.post("/nlp/aiparser", { transcribe: text });

            console.log("Parser response:", res.data);

            const parsed = res.data?.result;

            if (!parsed) {
                console.warn("Parser returned no result.");
                return;
            }

            // Normalize values for frontend form
            setParsed({
                title: parsed.title || "",
                priority: parsed.priority || "medium",
                dueDate: parsed.dueDate || "",
                status: parsed.status || "todo",
            });
        } catch (err) {
            console.error("Parsing failed:", err);
        }
    };


    // ----------------------------------------------------
    // Simulated Transcription (Testing Only)
    // ----------------------------------------------------
    const simulateTranscribe = async () => {
        const fakeTranscript =
            "Create a high priority task to review the pull request by tomorrow";

        console.log("Simulated transcript:", fakeTranscript);
        setTranscript(fakeTranscript);

        await parseTranscript(fakeTranscript);
    };

    // ----------------------------------------------------
    // Handle File Upload
    // ----------------------------------------------------
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log("User selected file for transcription:", file);

        await uploadAudioAndTranscribe(file);
    };

    // ----------------------------------------------------
    // Create Task From Parsed Output
    // ----------------------------------------------------
    const onCreateTask = async () => {
        const payload = {
            title: parsed?.title || transcript,
            description: parsed?.description || "",
            priority: parsed?.priority || "medium",
            status: parsed?.status || "todo",
            dueDate: parsed?.dueDate || "",
        };

        console.log("Creating task from voice payload:", payload);

        await createTask(payload);
        setOpen(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-4 rounded w-full max-w-lg shadow">
                <h3 className="font-semibold mb-3">Voice Task Creation</h3>
                ex: Remind me to send the project proposal to the client by next
                Wednesday, it's high priority
                <div className="space-y-4">

                    {/* Record Buttons */}
                    <div className="flex gap-2">
                        {!recording ? (
                            <button
                                onClick={startRecording}
                                className="px-3 py-1 border rounded"
                            >
                                Start Recording
                            </button>
                        ) : (
                            <button
                                onClick={stopRecording}
                                className="px-3 py-1 border rounded"
                            >
                                Stop Recording
                            </button>
                        )}

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

                    {/* Upload Audio Input */}
                    <div>
                        <label className="text-sm text-gray-500">Upload Audio File:</label>
                        <input
                            type="file"
                            accept=".mp3,.wav,.m4a,.webm"
                            onChange={handleFileUpload}
                            className="mt-1 p-2 border rounded w-full"
                        />
                    </div>

                    {/* Transcript */}
                    <div>
                        <div className="text-sm text-gray-500">Transcript:</div>
                        <div className="p-2 border min-h-12 rounded">
                            {transcript ? transcript : <em className="text-gray-400">No transcript yet</em>}
                        </div>
                    </div>

                    {/* Parsed Preview */}
                    <div>
                        <div className="text-sm text-gray-500">Parsed Preview (editable):</div>

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
                                            setParsed({ ...parsed, priority: e.target.value })
                                        }
                                        className="p-2 border rounded"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>

                                    <input
                                        type="date"
                                        value={parsed.dueDate || ""}
                                        onChange={(e) =>
                                            setParsed({ ...parsed, dueDate: e.target.value })
                                        }
                                        className="p-2 border rounded"
                                    />

                                    <select
                                        value={parsed.status}
                                        onChange={(e) =>
                                            setParsed({ ...parsed, status: e.target.value })
                                        }
                                        className="p-2 border rounded"
                                    >
                                        <option>To Do</option>
                                        <option>In Progress</option>
                                        <option>Review</option>
                                        <option>Done</option>
                                    </select>
                                </div>

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
                            <div className="p-2 border rounded">No parsed data yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceModal;
