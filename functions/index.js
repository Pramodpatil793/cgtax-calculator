const {onCall} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/v2/params");
const fetch = require("node-fetch");

const geminiApiKey = defineSecret("GEMINI_API_KEY");

exports.getAiTaxAdvice = onCall({
  secrets: [geminiApiKey],
  cors: ["https://cgtax.in", "https://www.cgtax.in"],
}, async (request) => {
  const userPrompt = request.data.prompt;
  if (!userPrompt) {
    throw new Error("Bad Request: Missing prompt.");
  }

  const key = geminiApiKey.value();
  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`;

  try {
    const apiResponse = await fetch(geminiApiUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({contents: [{parts: [{text: userPrompt}]}]}),
    });

    if (!apiResponse.ok) {
      throw new Error(`API Error: ${apiResponse.status}`);
    }

    return await apiResponse.json();
  } catch (error) {
    throw new Error("Failed to call Gemini API.");
  }
});