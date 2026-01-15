// const axios = require("axios");

// const geminiResponse = async (prompt) => {
//   try {
//     const apiKey = (process.env.GEMINI_API_KEY || "").trim();
//     if (!apiKey) {
//       throw new Error("GEMINI_API_KEY is not set in environment");
//     }

//     // Use encoded key if placing in query param
//     const url =
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
//       encodeURIComponent(apiKey);

//     const payload = {
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }]
//         }
//       ]
//     };

//     const result = await axios.post(url, payload, {
//       headers: {
//         "Content-Type": "application/json",
//         // x-goog-api-key header is typically unnecessary when using ?key= but harmless
//         "x-goog-api-key": apiKey
//       },
//       timeout: 15000 // 15s timeout
//     });

//     if (!result || !result.data) {
//       throw new Error("Empty response from Gemini API");
//     }

//     // Return the raw response data; callers can inspect specific fields
//     const text = result.data.candidates?.[0]?.content?.parts?.[0]?.text;

// if (!text) {
//   throw new Error("Invalid Gemini response format");
// }

// return {
//   type: "chat",
//   userInput: prompt,
//   response: text
// };

//   } catch (error) {
//     // Provide clearer error logs for debugging
//     console.error("Gemini Error →", error.response?.data || error.message || error);
//     throw error;
//   }
// };

// module.exports = { geminiResponse };


const axios = require("axios");

const geminiResponse = async (prompt) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) throw new Error("Missing API key");

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
      apiKey;

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an API for a voice assistant.

Reply ONLY in valid JSON.
No markdown. No text outside JSON.

Format:

{
  "type": "google_search | youtube_search | youtube_play | calculator_open | instagram_open | facebook_open | weather-show | chat",
  "userInput": "${prompt}",
  "response": "assistant reply"
}

User command: ${prompt}
`
            }
          ]
        }
      ]
    };

    const result = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000
    });

    let raw =
      result.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!raw) throw new Error("Empty Gemini response");

    console.log("🧠 RAW GEMINI:", raw);

    // Remove markdown if present
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    // Extract JSON if extra text exists
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No JSON found");

    const jsonText = raw.slice(start, end + 1);

    const parsed = JSON.parse(jsonText);

    return parsed;

  } catch (error) {
    console.error("❌ Gemini processing error:", error.message);

    return {
      type: "chat",
      userInput: prompt,
      response: "Sorry, I had a problem processing that."
    };
  }
};

module.exports = { geminiResponse };
