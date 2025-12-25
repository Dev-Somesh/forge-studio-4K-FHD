export async function handler(event) {
  // CORS headers for all responses
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  try {
    // Handle CORS preflight
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: ""
      };
    }

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method Not Allowed" })
      };
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "API Key not configured. Please set GEMINI_API_KEY in Netlify environment variables."
        }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const prompt = body.prompt;
    const model = body.model || "gemini-2.5-flash-image"; // Default to image model for FHD

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Prompt is required" }),
      };
    }

    // Validate model name
    // CRITICAL: For image generation, must use image-generation models (ending in -image)
    // Text models (gemini-2.5-flash, gemini-3-flash) can see images but cannot generate them
    const validImageModels = [
      "gemini-2.5-flash-image",      // Free tier - Recommended for FHD image generation
      "imagen-3.0-generate-002",      // Free tier - Alternative for high-fidelity
      "gemini-3-flash-image",         // May require billing for 4K
      "gemini-3-pro-image-preview"    // May require billing for 4K
    ];

    // Also allow text models for text-only operations (like quote generation)
    const validTextModels = [
      "gemini-2.5-flash",             // Text model for quote generation
      "gemini-3-flash"                // Text model
    ];

    const allValidModels = [...validImageModels, ...validTextModels];

    // Use provided model if valid, otherwise default to image model for wallpaper generation
    const modelName = allValidModels.includes(model)
      ? model
      : "gemini-2.5-flash-image"; // Default to image model for wallpaper generation

    // Check if this is an image-generation model
    const isImageModel = validImageModels.includes(modelName) ||
      modelName.includes("image") ||
      modelName.includes("imagen");

    // Construct the API endpoint
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

    console.log(`Calling Gemini API with model: ${modelName}`);

    // Prepare request body
    // Note: Image-generation models (gemini-2.5-flash-image, etc.) automatically return images
    // No need for responseMimeType in generationConfig - that parameter doesn't exist
    // The model itself determines the output format based on the model type
    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    // Image-generation models will automatically return images in the response
    // No special configuration needed - the model type determines the output

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

      // Handle 403 Forbidden - typically indicates billing/permission issues
      if (res.status === 403) {
        const isProModel = modelName.includes("3") || modelName.includes("pro") || modelName.includes("imagen-3");
        const isFreeTierModel = modelName === "gemini-2.5-flash-image";

        let errorMessage;
        if (isProModel) {
          errorMessage = "BILLING_REQUIRED: Gemini 3.0 series or Imagen 3 models require a Google Cloud Project with billing enabled. Free tier API keys cannot access these models. Please upgrade to a billed project or use FHD mode with gemini-2.5-flash-image.";
        } else if (!isFreeTierModel) {
          errorMessage = data.error?.message || "API access forbidden. This model may require billing or is not available on the free tier.";
        } else {
          errorMessage = data.error?.message || "API access forbidden. Check your API key permissions, daily limits (free tier: ~500 images/day), or billing status.";
        }

        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({
            error: "BILLING_REQUIRED",
            message: errorMessage,
            details: data.error || data,
            model: modelName,
            requiresBilling: isProModel,
            suggestion: isProModel ? "Switch to FHD mode (gemini-2.5-flash-image) or enable billing on your Google Cloud Project" : "Check API key permissions or daily limits"
          }),
        };
      }

      // Handle other HTTP errors
      return {
        statusCode: res.status,
        headers,
        body: JSON.stringify({
          error: "Upstream_API_Error",
          message: data.error?.message || data.error?.status || "API request failed",
          details: data.error || data,
          model: modelName,
          httpStatus: res.status,
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error("Function Error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
      }),
    };
  }
}
