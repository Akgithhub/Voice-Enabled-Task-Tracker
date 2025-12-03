import httpClient from "../utils/httpClient.js";
import serviceUrls from "../config/serviceUrls.js";

export const aiParser = async (req, res) => {
    console.log("🔥 GATEWAY: Speech request for /nlp transcribe");

    try {
        // console.log(" GATEWAY body:", req.body);

        const transcript = req.body.transcribe;

        if (!transcript) {
            return res.status(400).json({ error: "Transcript is missing" });
        }

        // console.log("🔥 Parsed Transcript:", transcript);

        // now forward to NLP microservice:
        const response = await httpClient.post(
            `${serviceUrls.NLP_SERVICE_URL}/nlp/parse`,
            { transcribe: transcript }
        );

        res.status(response.status).json(response.data);

    } catch (err) {
        console.error("Error speech→nlp:", err);
        res.status(err?.response?.status || 500).json({ error: err.message });
    }
};
