import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Check if the request is multipart (image upload)
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    // Image-based analysis
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const prompt =
      "You are a highly accurate medical AI. Analyze the attached medical scan (X-ray or MRI) and provide a structured, patient-friendly report. " +
      "Your response should include: 1) The most likely condition, 2) Confidence (0-100), 3) Severity (mild/moderate/severe), 4) Short description, " +
      "5) Recommendations, 6) When to seek care, 7) Follow-up advice. Respond in English and also provide a Hindi translation. " +
      "If you cannot analyze the image, explain why.";
    const apiKey = process.env.GEMINI_API_KEY;
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    const body = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64 } },
          ],
        },
      ],
    };
    try {
      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      if (apiKey) headers.set("x-goog-api-key", apiKey);
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return NextResponse.json({ analysis: text });
    } catch (error) {
      return NextResponse.json({ error: "Failed to analyze scan." }, { status: 500 });
    }
  } else {
    // Text-based analysis (existing flow)
    const { symptoms, additionalInfo } = await req.json();
    const prompt = `
You are a highly accurate medical assistant. Analyze the following symptoms and provide a structured JSON diagnosis and Indian-style home remedies/cures. Your response MUST be a valid JSON object with the following fields:

{
  "condition": string, // Name of the most likely condition
  "confidence": number, // Confidence level (0-100)
  "severity": "mild" | "moderate" | "severe", // Severity of the condition
  "description": string, // Short description of the diagnosis
  "recommendations": string[], // List of Indian-style home remedies and recommendations
  "whenToSeekCare": string[], // List of warning signs for when to seek medical care
  "followUp": {
    "recommended": boolean, // Whether follow-up is recommended
    "timeframe": string, // Suggested timeframe for follow-up
    "reason": string // Reason for follow-up
  }
}

Symptoms: ${symptoms}
Additional Info: ${additionalInfo || "None"}

Respond ONLY with the JSON object, no extra text or explanation.`;
    const apiKey = process.env.GEMINI_API_KEY;
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };
    try {
      const headers = new Headers();
      headers.set("Content-Type", "application/json");
      if (apiKey) headers.set("x-goog-api-key", apiKey);
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      // Try to parse the JSON from the model's response
      let diagnosis = null;
      try {
        // Find the first JSON object in the text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          diagnosis = JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        diagnosis = null;
      }
      if (diagnosis) {
        return NextResponse.json({ diagnosis });
      } else {
        return NextResponse.json({ error: "Could not parse diagnosis JSON.", raw: text }, { status: 200 });
      }
    } catch (error) {
      return NextResponse.json({ error: "Failed to analyze symptoms." }, { status: 500 });
    }
  }
} 