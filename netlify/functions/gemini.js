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
    const model = body.model || "gemini-2.5-flash"; // Default to flash for FHD

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

    // Validate model name - using actual available models from Gemini AI Studio
    const validModels = [
      "gemini-2.5-flash",
      "gemini-3-flash",
      "gemini-2.5-flash-lite",
      "gemini-2.5-flash-tts",
      "gemini-2.5-flash-native-audio-dialog",
      "gemini-robotics-er-1.5-preview",
      "gemma-3-12b",
      "gemma-3-1b",
      "gemma-3-27b",
      "gemma-3-2b",
      "gemma-3-4b"
    ];
    
    const modelName = validModels.includes(model) ? model : "gemini-2.5-flash";
    
    // Construct the API endpoint
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
    
    console.log(`Calling Gemini API with model: ${modelName}`);

    // Prepare request body
    // Note: Standard Gemini text models may not support image generation
    // Try without generationConfig first - if models support images, they'll return inlineData
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    // Only add generationConfig for models that explicitly support image generation
    // Standard text models (gemini-2.5-flash, gemini-3-flash) may not support this
    // If image generation fails, we'll get a clear error message from the API
    if (modelName.includes("image") || modelName.includes("imagen")) {
      requestBody.generationConfig = {
        responseMimeType: "image/png",
      };
    }

    console.log(`Calling Gemini API:`, {
      model: modelName,
      url: apiUrl.replace(apiKey, "KEY_HIDDEN"),
      promptLength: prompt.length,
      hasGenerationConfig: !!requestBody.generationConfig
    });

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Gemini API Error Details:", {
        status: res.status,
        statusText: res.statusText,
        model: modelName,
        error: JSON.stringify(data, null, 2)
      });
      return {
        statusCode: res.status,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        },
        body: JSON.stringify({
          error: "Upstream_API_Error",
          message: data.error?.message || data.error?.status || "API request failed",
          details: data.error || data,
          model: modelName,
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
