import deepgram from "../clients/deepgram.client.js";

export const transcribeSpeech = async (req, res) => {
  try {
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No audio file received" });
    }

    const audioBuffer = req.file.buffer;

    const response = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: "nova",
        smart_format: true,
        punctuate: true,
        language: "en",
      }
    );

    // console.log("DEEPGRAM RAW:", JSON.stringify(response, null, 2));

    // Validate structure
    const transcript =
      response.result.results.channels[0].alternatives[0].transcript;

    if (!transcript) {
      return res.status(500).json({
        error: "Deepgram returned no transcript",
        deepgramResponse: response,
      });
    }

    res.json({ transcript });
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Transcription failed" });
  }
};
