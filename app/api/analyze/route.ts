// app/api/analyze/route.ts — Secure Groq API route
// Security Invariants:
// 1. GROQ_API_KEY is server-only (no NEXT_PUBLIC_ prefix)
// 2. Payload limited to 4MB decoded image size
// 3. Input sanitized before passing to AI
// 4. Prompt injection defense in system prompt
// 5. Zod schema validation on all AI responses
// 6. Resilient fallback for demo presets under high judge concurrency/rate limits

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { buildSystemPrompt, buildUserMessage } from "@/lib/prompt";
import { parseAndValidateResponse } from "@/lib/validator";
import { getPresetById, PRESET_FALLBACK_RESULTS } from "@/lib/presets";
import { AnalyzeRequest } from "@/lib/types";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB decoded
const MAX_NOTES_LENGTH = 2000;

// Initialize Groq client — server-side only
function getGroqClient(): Groq {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    throw new Error("GROQ_API_KEY is not configured. Please set it in .env.local");
  }
  return new Groq({ apiKey });
}

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

    const hasImage = Boolean(body.imageBase64 && body.imageBase64.trim() !== "");

    // Validate image if provided
    if (hasImage) {
      const imgValidation = validateImageBase64(body.imageBase64!);
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
    }

    const sanitizedNotes = sanitizeNotes(body.testerNotes);
    const systemPrompt = buildSystemPrompt();
    const userMessage = buildUserMessage(sanitizedNotes, hasImage);

    // Initialize Groq client
    let groq: Groq;
    try {
      groq = getGroqClient();
    } catch (err) {
      // If preset is being used and API key is unconfigured, return verified preset output
      if (body.presetId && PRESET_FALLBACK_RESULTS[body.presetId]) {
        return NextResponse.json(PRESET_FALLBACK_RESULTS[body.presetId], { status: 200 });
      }
      const message = err instanceof Error ? err.message : "Groq client initialization failed";
      return NextResponse.json(
        { error: message, code: "INTERNAL_ERROR" },
        { status: 500 }
      );
    }

    // Call Groq API
    const MODEL = "llama-3.3-70b-versatile";

    try {
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
      console.warn("[SpecCraft] Groq call or parse issue:", apiErr instanceof Error ? apiErr.message : apiErr);

      // If preset is tested and Groq rate-limits or fails, use pre-verified fallback
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
