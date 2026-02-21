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

    // Step 1: Extract VSUs with shared story context for visual continuity
    let vsus: { text: string; imagePrompt: string; keywords: string }[] = [];
    try {
      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a visual storytelling API that converts sentences into connected storyboard panels.

Respond ONLY with valid JSON in this exact structure:
{
  "storyContext": {
    "character": "brief description of the main subject/person (appearance, clothing, age)",
    "setting": "overall location and atmosphere",
    "artStyle": "one consistent art style for all panels (e.g. 'warm cinematic photography', 'soft watercolor illustration', 'cozy children's book illustration')"
  },
  "vsus": [
    {
      "text": "chunk of the original sentence",
      "imagePrompt": "A scene description that MUST reference storyContext character and setting. Describe the specific action/moment happening in this panel. Write as a cinematic shot description.",
      "keywords": "2-3 simple English nouns for photo search"
    }
  ]
}

CRITICAL RULES for imagePrompt:
- Every panel MUST feature the same character from storyContext
- Every panel MUST be set in the same location from storyContext
- Every panel MUST use the exact artStyle from storyContext
- Describe a SPECIFIC MOMENT or ACTION, not just an object
- Write like a film director describing a shot: "Medium shot of [character] [doing action] in [setting], [art style]"
- Panels must feel like sequential frames of the same story`
          },
          {
            role: "user",
            content: `Convert this sentence into a connected visual story with 2-4 storyboard panels:\n\n"${text}"`
          }
        ],
        response_format: { type: "json_object" }
      });

      const responseText = completion.choices[0]?.message?.content;
      if (responseText) {
        const parsed = JSON.parse(responseText);
        const storyContext = parsed.storyContext;

        // Inject storyContext into each VSU's imagePrompt for consistency
        vsus = (parsed.vsus || []).map((vsu: { text: string; imagePrompt: string; keywords: string }) => ({
          ...vsu,
          imagePrompt: `${vsu.imagePrompt}. Art style: ${storyContext?.artStyle ?? "cinematic photorealistic"}. Consistent character: ${storyContext?.character ?? ""}. Setting: ${storyContext?.setting ?? ""}. High quality, story illustration.`,
        }));
      }
    } catch (e) {
      console.error("Failed to generate VSU", e);
      return NextResponse.json({ error: "Failed to process text" }, { status: 500 });
    }

    if (!vsus || !Array.isArray(vsus) || vsus.length === 0) {
      return NextResponse.json({ error: "No semantic units found" }, { status: 500 });
    }

    // Step 2: Generate an image for each VSU concurrently using OpenRouter's gemini-3-pro-image-preview
    const results = await Promise.all(vsus.map(async (vsu) => {
      let imageUrl = "";
      try {
        const imageResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": "VisualLang",
          },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image-preview",
            messages: [{ role: "user", content: vsu.imagePrompt }],
            modalities: ["image"]
          })
        });

        if (!imageResponse.ok) {
          console.error("OpenRouter image API error:", await imageResponse.text());
          throw new Error(`OpenRouter API error: ${imageResponse.status}`);
        }

        const data = await imageResponse.json();
        const base64Url = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (base64Url) {
          imageUrl = base64Url;
        } else {
          throw new Error("No image URL found in response");
        }
      } catch (imageError) {
        console.error("Gemini image failed, falling back to loremflickr:", imageError);
        // Fallback: loremflickr server-side fetch → base64 (avoids CORS)
        try {
          const keyword = encodeURIComponent(
            (vsu as { keywords?: string }).keywords?.split(",")[0]?.trim() || "scene"
          );
          const seed = Math.floor(Math.random() * 10000);
          const flickrRes = await fetch(`https://loremflickr.com/400/400/${keyword}?lock=${seed}`, { redirect: "follow" });
          if (flickrRes.ok) {
            const buf = await flickrRes.arrayBuffer();
            const b64 = Buffer.from(buf).toString("base64");
            const mime = flickrRes.headers.get("content-type") ?? "image/jpeg";
            imageUrl = `data:${mime};base64,${b64}`;
          }
        } catch (fallbackErr) {
          console.error("Fallback image also failed:", fallbackErr);
        }
      }

      return {
        text: vsu.text,
        imageUrl: imageUrl
      };
    }));

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
