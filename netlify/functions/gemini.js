export async function handler(event) {
  // 1. Basic Setup
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Server Error: GEMINI_API_KEY is missing in environment variables");
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Server Configuration Error: API Key missing" }) 
    };
  }

  try {
    // 2. Parse Payload
    const { model, contents, config } = JSON.parse(event.body);

    console.log(`[Proxy] Requesting model: ${model}`);

    // 3. Construct REST API Call (Bypassing SDK to avoid bundler issues)
    // Using v1beta as it supports the newer 2.0/3.0 models usually
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    // 4. Map 'config' (SDK term) to 'generationConfig' (API term)
    // Ensure we handle imageConfig correctly if present
    const payload = {
      contents: contents,
      generationConfig: config || {}
    };

    // 5. Execute Request
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // 6. Handle API Errors gracefully
    if (!response.ok) {
      console.error("[Proxy] Upstream API Error:", JSON.stringify(data));
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          error: "Upstream API Error", 
          details: data 
        })
      };
    }

    // 7. Success
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error("[Proxy] Internal Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Internal Server Logic Failed", 
        details: error.message 
      })
    };
  }
}
