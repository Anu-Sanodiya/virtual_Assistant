const axios = require("axios");

const geminiResponse = async (prompt) => {
  try {
    const apiKey = (process.env.GEMINI_API_KEY || "").trim();
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment");
    }

    // Use encoded key if placing in query param
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      encodeURIComponent(apiKey);

    const payload = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    };

    const result = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        // x-goog-api-key header is typically unnecessary when using ?key= but harmless
        "x-goog-api-key": apiKey
      },
      timeout: 15000 // 15s timeout
    });

    if (!result || !result.data) {
      throw new Error("Empty response from Gemini API");
    }

    // Return the raw response data; callers can inspect specific fields
    return result.data.candidates[0].content.parts[0].text;
  } catch (error) {
    // Provide clearer error logs for debugging
    console.error("Gemini Error →", error.response?.data || error.message || error);
    throw error;
  }
};

module.exports = { geminiResponse };
