# LLM.md — SpecCraft AI Project Constitution

**Version:** 1.0.0  
**Author:** System Pilot (B.L.A.S.T. Protocol)  
**Status:** ACTIVE LAW — do not modify without updating version

---

## 1. PROJECT IDENTITY

**Name:** SpecCraft AI  
**Tagline:** Autonomous Visual QA to Playwright Studio  
**Mission:** Convert UI bug screenshots into runnable Playwright test specs and GitHub Issue reports using Groq multimodal AI, with strict Anti-Hallucination enforcement.

---

## 2. JSON DATA SCHEMA (CANONICAL)

### 2.1 API Request Schema

```typescript
interface AnalyzeRequest {
  imageBase64: string;      // base64-encoded image (max 4MB decoded), no data: prefix
  mimeType: "image/png" | "image/jpeg" | "image/webp" | "image/gif";
  testerNotes: string;      // max 2000 chars, sanitized
  presetId?: string;        // optional preset identifier
}
```

### 2.2 API Response Schema (CANONICAL OUTPUT)

```typescript
interface AnalysisResult {
  bugTitle: string;                    // ≤ 80 chars, concise bug name
  severity: "Critical" | "High" | "Medium" | "Low";
  rootCauseSummary: string;            // 2–3 sentences, strictly fact-based
  verifiedFacts: string[];             // strictly observed visual facts only
  unknownParameters: string[];         // missing info — not invented
  reproductionSteps: string[];         // numbered steps to reproduce
  generatedTestCode: string;           // complete Playwright TypeScript .spec.ts
  githubIssueMarkdown: string;         // formatted GitHub Issue markdown
  jiraIssueText: string;               // formatted Jira Issue text
  selfValidationCheck: string;         // AI self-validation result
}
```

### 2.3 API Error Response Schema

```typescript
interface AnalyzeError {
  error: string;         // human-readable error message
  code: "PAYLOAD_TOO_LARGE" | "INVALID_INPUT" | "AI_PARSE_ERROR" | "RATE_LIMITED" | "INTERNAL_ERROR";
  partialResult?: Partial<AnalysisResult>;
}
```

---

## 3. SECURITY INVARIANTS (LAW — NEVER VIOLATE)

1. **ZERO SECRET LEAKS**: `GROQ_API_KEY` lives ONLY in `.env.local` (gitignored). Never in client code.
2. **NO `NEXT_PUBLIC_` PREFIX**: The API key must never be prefixed with `NEXT_PUBLIC_`.
3. **SERVER-SIDE ONLY**: Groq SDK initializes exclusively inside `app/api/*/route.ts`.
4. **4MB PAYLOAD LIMIT**: Reject any `imageBase64` string whose decoded size exceeds 4,194,304 bytes.
5. **INPUT SANITIZATION**: Strip HTML tags, null bytes, and control characters from `testerNotes`.
6. **PROMPT BOUNDARY ENFORCEMENT**: System prompt includes explicit instruction-injection prevention.
7. **NO HARDCODED KEYS**: grep-scan before every commit — no `gsk_` or key-like strings in source.

---

## 4. ANTI-HALLUCINATION RULES (EMBEDDED IN SYSTEM PROMPT)

```
SCOPE: Use ONLY information explicitly visible in the provided screenshot.
STRICT PROHIBITION: DO NOT invent CSS selectors, API codes, or UI elements not visible.

MANDATORY 4-STEP PROCESS:
Step 1 — Extract: List only visually verified facts from the image.
Step 2 — Gap: List what is unknown or not determinable from the image.
Step 3 — Generate: Write Playwright assertions ONLY from Step 1 verified facts.
Step 4 — Validate: Self-check output for invented details. Flag any inference as:
         // Inference (verify selector in staging)

UNCERTAINTY RULE: If a selector cannot be confirmed visually, use:
  button:has-text("Submit") // Inference (verify selector in staging)
```

---

## 5. ARCHITECTURAL INVARIANTS

1. **Groq Model Priority**: `llama-3.2-11b-vision-preview` (primary) → `llama-3.3-70b-versatile` (text fallback)
2. **Zod Validation**: Every AI JSON response is validated against `AnalysisResult` schema before being returned.
3. **No Chromium in Bundle**: Playwright is output text only — never imported or executed server-side.
4. **Preset Self-Sufficiency**: Presets include embedded base64 SVG images — no external network calls.
5. **Hydration Safety**: All client-state managed in `useEffect` + `useState`, no server/client mismatch.

---

## 6. TECH STACK

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + custom CSS variables |
| AI | Groq SDK (`groq-sdk`) |
| Vision Model | llama-3.2-11b-vision-preview |
| Validation | Zod |
| Icons | lucide-react |
| Animation | canvas-confetti |
| Deployment | Vercel |

---

## 7. MAINTENANCE LOG

| Date | Change | Author |
|------|--------|--------|
| 2026-08-16 | v1.0.0 — Initial constitution | System Pilot |
