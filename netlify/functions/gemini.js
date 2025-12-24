import { GoogleGenAI } from "@google/genai";

export async function handler(event) {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    // Parse the incoming request body
    const body = JSON.parse(event.body);
    const { model, contents, config } = body;

    // Get the API key from environment variables (Server-side)
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY missing in server environment");
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "Server configuration error: API Key missing" }) 
      };
    }

    // Initialize the Google GenAI SDK
    const ai = new GoogleGenAI({ apiKey });

    // Call the model
    // We pass the parameters exactly as the App.tsx was constructing them
    const result = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: config
    });

    // The result from the SDK typically contains the response data.
    // We serialize the whole result to JSON.
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // Good for debugging, can start tightening later
      },
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error("Gemini Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message || "Internal Server Error",
        details: error.toString() 
      }),
    };
  }
}
