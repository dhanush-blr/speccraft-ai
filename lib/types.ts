// lib/types.ts — Canonical type definitions for SpecCraft AI
// All types are co-located here to ensure a single source of truth.

export type Severity = "Critical" | "High" | "Medium" | "Low";

export type MimeType =
  | "image/png"
  | "image/jpeg"
  | "image/webp"
  | "image/gif"
  | "image/svg+xml";

export interface AnalyzeRequest {
  imageBase64: string; // base64 string, no data: URI prefix — max 4MB decoded
  mimeType: MimeType;
  testerNotes: string; // max 2000 chars, sanitized server-side
  presetId?: string;
}

export interface AnalysisResult {
  bugTitle: string;
  severity: Severity;
  rootCauseSummary: string;
  verifiedFacts: string[];
  unknownParameters: string[];
  reproductionSteps: string[];
  generatedTestCode: string;
  githubIssueMarkdown: string;
  jiraIssueText: string;
  selfValidationCheck: string;
}

export interface AnalyzeError {
  error: string;
  code:
    | "PAYLOAD_TOO_LARGE"
    | "INVALID_INPUT"
    | "AI_PARSE_ERROR"
    | "RATE_LIMITED"
    | "INTERNAL_ERROR";
  partialResult?: Partial<AnalysisResult>;
}

export interface Preset {
  id: string;
  title: string;
  severity: Severity;
  description: string;
  testerNotes: string;
  imageBase64: string; // embedded base64 SVG — no network calls
  mimeType: MimeType;
  tags: string[];
}

export type AnalyzeResponse = AnalysisResult | AnalyzeError;

export function isAnalyzeError(res: AnalyzeResponse): res is AnalyzeError {
  return "error" in res;
}
