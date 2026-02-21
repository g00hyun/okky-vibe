import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Ensure the code runs dynamically, as it depends on user input and external APIs
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required in the request body" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        console.error("OPENROUTER_API_KEY is not set.");
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": "VisualLang",
      }
    });

    // Step 1: Extract Visual Semantic Units (VSU) using OpenRouter
    let vsus: { text: string; imagePrompt: string }[] = [];
    try {
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an API that converts text into Visual Semantic Units (VSUs). 
You MUST respond with valid JSON containing a single object with a "vsus" key. 
The "vsus" key must contain an array of objects. 
Each object must have a "text" string (a meaningful chunk of the original text) and an "imagePrompt" string (a detailed English prompt to generate an image for that text).`
          },
          {
            role: "user",
            content: `Analyze the following text and break it down into meaningful visual semantic units (VSUs).\n\nText: "${text}"`
          }
        ],
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0]?.message?.content;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        vsus = parsed.vsus || [];
      }
    } catch (e) {
      console.error("Failed to generate VSU", e);
      return NextResponse.json({ error: "Failed to process text" }, { status: 500 });
    }

    if (!vsus || !Array.isArray(vsus) || vsus.length === 0) {
      return NextResponse.json({ error: "No semantic units found" }, { status: 500 });
    }

    // Step 2: Generate an image for each VSU concurrently
    // Since OpenRouter doesn't natively do Imagen generation via chat completions, 
    // we use a free placeholder API (pollinations.ai) which generates images from prompt URLs.
    // This allows the MVP to show real images without a second API key.
    const results = vsus.map((vsu) => {
      // Create a deterministic seed based on text to avoid re-generating on every render
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(vsu.imagePrompt)}?width=400&height=400&nologo=true&seed=${seed}`;
      
      return {
        text: vsu.text,
        imageUrl: imageUrl
      };
    });

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
