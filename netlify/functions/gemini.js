export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { 
        statusCode: 405, 
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Method Not Allowed" })
      };
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return {
        statusCode: 500,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        },
        body: JSON.stringify({ 
          error: "API Key not configured. Please set GEMINI_API_KEY in Netlify environment variables." 
        }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;
    const model = body.model || "gemini-2.5-flash-image"; // Default to flash for FHD

    if (!prompt) {
      return {
        statusCode: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        },
        body: JSON.stringify({ error: "Prompt is required" }),
      };
    }

    // Validate model name
    const validModels = [
      "gemini-2.5-flash-image",
      "gemini-3-pro-image-preview",
      "gemini-2.5-flash",
      "gemini-pro"
    ];
    
    const modelName = validModels.includes(model) ? model : "gemini-2.5-flash-image";
    
    // Construct the API endpoint
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
    
    console.log(`Calling Gemini API with model: ${modelName}`);

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Gemini API Error:", {
        status: res.status,
        statusText: res.statusText,
        error: data
      });
      return {
        statusCode: res.status,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        },
        body: JSON.stringify({
          error: "Upstream_API_Error",
          message: data.error?.message || "API request failed",
          details: data,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Function Error:", err);
    return {
      statusCode: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
      body: JSON.stringify({ 
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
      }),
    };
  }
}
