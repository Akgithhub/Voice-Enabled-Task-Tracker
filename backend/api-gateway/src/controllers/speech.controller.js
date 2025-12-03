import httpClient from "../utils/httpClient.js";
import serviceUrls from "../config/serviceUrls.js";
import FormData from "form-data";

export const speectranscribe = async (req, res) => {
    console.log("🔥 GATEWAY: Speech request for /speech");

    try {
        // req.file MUST exist here
        // console.log(" GATEWAY: FILE RECEIVED:", req.file);

        if (!req.file) {
            return res.status(400).json({ error: "No audio file received at gateway" });
        }

        // Create multipart/form-data body to forward
        const form = new FormData();
        form.append("audio", req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype
        });

        // Forward request to speech microservice
        const response = await httpClient.post(
            `${serviceUrls.SPEECH_SERVICE_URL}/speech/transcribe`,
            form,
            { headers: form.getHeaders() }
        );

        res.status(response.status).json(response.data);

    } catch (error) {
        console.error("Error in /speech transcribe:", error?.response?.data || error);
        res.status(error?.response?.status || 500).json({
            error: error.message,
        });
    }
};
