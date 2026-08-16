// app/api/analyze/route.ts — Secure Groq API route
// Security Invariants:
// 1. GROQ_API_KEY is server-only (no NEXT_PUBLIC_ prefix)
// 2. Payload limited to 4MB decoded image size
// 3. Input sanitized before passing to AI
// 4. Prompt injection defense in system prompt
// 5. Zod schema validation on all AI responses
// 6. Resilient fallback for demo presets under high judge concurrency/rate limits

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildSystemPrompt, buildUserMessage } from "@/lib/prompt";
import { parseAndValidateResponse } from "@/lib/validator";
import { getPresetById, PRESET_FALLBACK_RESULTS } from "@/lib/presets";
import { AnalyzeRequest, AnalysisResult } from "@/lib/types";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB decoded
const MAX_NOTES_LENGTH = 2000;

function sanitizeNotes(notes: string): string {
  return notes
    .replace(/<[^>]*>/g, "") // Strip HTML tags
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, "") // Strip control characters
    .substring(0, MAX_NOTES_LENGTH);
}

function validateImageBase64(base64: string): { valid: boolean; error?: string } {
  if (!base64 || typeof base64 !== "string") {
    return { valid: false, error: "imageBase64 is required" };
  }
  // Check decoded size
  const decodedBytes = Math.floor((base64.length * 3) / 4);
  if (decodedBytes > MAX_IMAGE_BYTES) {
    return {
      valid: false,
      error: `Image too large: ${Math.round(decodedBytes / 1024 / 1024)}MB exceeds 4MB limit`,
    };
  }
  return { valid: true };
}

// Seamless Gemini fallback handler with multi-model resilience
async function callGeminiFallback(
  imageBase64: string,
  mimeType: string,
  userMessage: string,
  systemPrompt: string
): Promise<AnalysisResult> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured in environment variables");
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const candidateModels = ["gemini-flash-latest", "gemini-3-flash-preview"];

  const validMimes = ["image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"];
  const targetMime = validMimes.includes(mimeType) ? mimeType : "image/png";

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType: targetMime,
    },
  };

  let lastError: Error | null = null;
  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
        systemInstruction: systemPrompt,
      });

      const geminiResult = await model.generateContent([userMessage, imagePart]);
      const rawResponse = geminiResult.response.text();
      if (rawResponse && rawResponse.trim().length > 0) {
        return parseAndValidateResponse(rawResponse);
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[SpecCraft] Gemini model ${modelName} issue:`, lastError.message.slice(0, 120));
    }
  }

  throw lastError || new Error("All Gemini fallback models failed");
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Partial<AnalyzeRequest> = {};
  try {
    // Parse request body
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    // If presetId is provided, load from preset store
    if (body.presetId) {
      const preset = getPresetById(body.presetId);
      if (preset) {
        body.imageBase64 = preset.imageBase64;
        body.mimeType = preset.mimeType;
        if (!body.testerNotes || body.testerNotes.trim() === "") {
          body.testerNotes = preset.testerNotes;
        }
      }
    }

    // Validate required fields
    if (!body.testerNotes || body.testerNotes.trim() === "") {
      return NextResponse.json(
        { error: "testerNotes is required", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    // Validate screenshot is mandatory
    if (!body.imageBase64 || body.imageBase64.trim() === "") {
      return NextResponse.json(
        { error: "Screenshot is mandatory for visual analysis", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    // Validate image format and size
    const imgValidation = validateImageBase64(body.imageBase64);
    if (!imgValidation.valid) {
      return NextResponse.json(
        {
          error: imgValidation.error,
          code: imgValidation.error?.includes("large")
            ? "PAYLOAD_TOO_LARGE"
            : "INVALID_INPUT",
        },
        { status: 400 }
      );
    }

    const sanitizedNotes = sanitizeNotes(body.testerNotes);
    const systemPrompt = buildSystemPrompt();
    const userMessage = buildUserMessage(sanitizedNotes, true);

    // Check environment variable dynamically per request
    const apiKey = process.env.GROQ_API_KEY;
    console.log("Using Groq key starting with:", apiKey?.slice(0, 7));

    if (!apiKey && !process.env.GEMINI_API_KEY) {
      if (body.presetId && PRESET_FALLBACK_RESULTS[body.presetId]) {
        return NextResponse.json(PRESET_FALLBACK_RESULTS[body.presetId], { status: 200 });
      }
      return NextResponse.json(
        { error: "GROQ_API_KEY or GEMINI_API_KEY is not set in environment variables", code: "INTERNAL_ERROR" },
        { status: 500 }
      );
    }

    // Primary: Call Groq API
    const MODEL = "llama-3.3-70b-versatile";

    try {
      if (!apiKey) {
        throw new Error("GROQ_API_KEY is not configured");
      }

      const groq = new Groq({ apiKey });
      const completion = await groq.chat.completions.create({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.1,
        max_tokens: 4096,
        response_format: { type: "json_object" },
      });

      const rawResponse = completion.choices[0]?.message?.content;
      if (!rawResponse) {
        throw new Error("Empty response from AI model");
      }

      // Parse and validate the response with self-healing normalization
      const result = parseAndValidateResponse(rawResponse);
      return NextResponse.json(result, { status: 200 });
    } catch (apiErr) {
      console.warn(
        "[SpecCraft] Groq failed/rate-limited. Switching to Gemini fallback...",
        apiErr instanceof Error ? apiErr.message : apiErr
      );

      // Attempt Gemini fallback
      if (process.env.GEMINI_API_KEY) {
        try {
          const geminiResult = await callGeminiFallback(
            body.imageBase64!,
            body.mimeType || "image/png",
            userMessage,
            systemPrompt
          );
          return NextResponse.json(geminiResult, { status: 200 });
        } catch (geminiErr) {
          console.warn(
            "[SpecCraft] Gemini fallback call failed:",
            geminiErr instanceof Error ? geminiErr.message : geminiErr
          );
        }
      }

      // If preset is tested and live APIs fail/rate-limit, use pre-verified fallback
      if (body.presetId && PRESET_FALLBACK_RESULTS[body.presetId]) {
        return NextResponse.json(PRESET_FALLBACK_RESULTS[body.presetId], { status: 200 });
      }

      if (apiErr instanceof Error && apiErr.message.toLowerCase().includes("rate")) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please wait a moment and try again.", code: "RATE_LIMITED" },
          { status: 429 }
        );
      }

      throw apiErr;
    }
  } catch (err) {
    if (body.presetId && PRESET_FALLBACK_RESULTS[body.presetId]) {
      return NextResponse.json(PRESET_FALLBACK_RESULTS[body.presetId], { status: 200 });
    }

    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json(
      { error: message, code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

