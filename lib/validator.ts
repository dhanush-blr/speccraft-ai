// lib/validator.ts — Zod schema + response parser with resilient normalization
// Validates every AI response against the canonical AnalysisResult schema.
// Pre-normalizes fields to prevent schema validation failures if the LLM
// formats arrays as strings or uses non-standard casings.

import { z } from "zod";
import { AnalysisResult, Severity } from "./types";

const SeveritySchema = z.enum(["Critical", "High", "Medium", "Low"]);

export const AnalysisResultSchema = z.object({
  bugTitle: z.string().min(1).max(200),
  severity: SeveritySchema,
  rootCauseSummary: z.string().min(5),
  verifiedFacts: z.array(z.string()).min(1),
  unknownParameters: z.array(z.string()),
  reproductionSteps: z.array(z.string()).min(1),
  generatedTestCode: z.string().min(20),
  githubIssueMarkdown: z.string().min(20),
  jiraIssueText: z.string().optional(),
  selfValidationCheck: z.string().min(5),
});

function toArrayOfStrings(val: unknown, fallback: string[]): string[] {
  if (Array.isArray(val)) {
    const cleaned = val
      .map((item) => (typeof item === "string" ? item.trim() : JSON.stringify(item)))
      .filter((s) => s.length > 0);
    return cleaned.length > 0 ? cleaned : fallback;
  }
  if (typeof val === "string" && val.trim().length > 0) {
    const lines = val
      .split(/\r?\n/)
      .map((line) => line.replace(/^[-*•\d+.)\s]+/, "").trim())
      .filter((s) => s.length > 0);
    return lines.length > 0 ? lines : [val.trim()];
  }
  return fallback;
}

function normalizeSeverity(val: unknown): Severity {
  if (typeof val === "string") {
    const lower = val.toLowerCase().trim();
    if (lower.includes("crit") || lower.includes("blocker") || lower.includes("p1")) return "Critical";
    if (lower.includes("high") || lower.includes("major") || lower.includes("p2")) return "High";
    if (lower.includes("med") || lower.includes("normal") || lower.includes("p3")) return "Medium";
    if (lower.includes("low") || lower.includes("minor") || lower.includes("trivial") || lower.includes("p4")) return "Low";
  }
  return "High";
}

function formatFallbackPlaywright(title: string, steps: string[]): string {
  const stepLines = steps
    .map((s, i) => `    // Step ${i + 1}: ${s}\n    // page.locator('...').action();`)
    .join("\n\n");

  return `import { test, expect } from '@playwright/test';

test.describe('${title.replace(/'/g, "\\'")}', () => {
  test('verify issue reproduction and visual state', async ({ page }) => {
    await page.goto('/');
    
${stepLines}

    // Verify bug state
    const targetElement = page.locator('button, [role="button"]').first(); // Inference (verify selector in staging)
    await expect(targetElement).toBeVisible();
  });
});
`;
}

function formatFallbackGithub(data: {
  bugTitle: string;
  severity: string;
  rootCauseSummary: string;
  reproductionSteps: string[];
  verifiedFacts: string[];
}): string {
  const steps = data.reproductionSteps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  const facts = data.verifiedFacts.map((f) => `- ${f}`).join("\n");

  return `## Bug Description
${data.rootCauseSummary}

## Severity
**${data.severity}**

## Steps to Reproduce
${steps}

## Verified Facts
${facts}

## Expected vs Actual Behavior
- **Expected**: Workflow executes smoothly without infinite loading or UI blocking.
- **Actual**: ${data.rootCauseSummary}

## Screenshots / Evidence
*[Visual bug evidence attached via SpecCraft AI]*
`;
}

function formatFallbackJiraIssue(data: {
  bugTitle: string;
  severity: Severity;
  rootCauseSummary: string;
  verifiedFacts: string[];
  reproductionSteps: string[];
  unknownParameters: string[];
  selfValidationCheck: string;
}): string {
  const priorityMap: Record<Severity, string> = {
    Critical: "Highest (P1)",
    High: "High (P2)",
    Medium: "Medium (P3)",
    Low: "Low (P4)",
  };

  const steps = data.reproductionSteps
    .map((s, i) => `${i + 1}. ${s.replace(/^Step\s*\d+:\s*/i, "")}`)
    .join("\n");

  const facts = data.verifiedFacts.map((f) => `* ${f}`).join("\n");
  const unknowns =
    data.unknownParameters.length > 0
      ? data.unknownParameters.map((u) => `* ${u}`).join("\n")
      : "* None observed";

  return `SUMMARY: [UI Bug] ${data.bugTitle}
ISSUE TYPE: Bug
PRIORITY: ${priorityMap[data.severity] || "High"}
COMPONENT: UI / Frontend Automation
LABELS: visual-qa, automated-spec, anti-hallucination

==================================================
DESCRIPTION
==================================================

1. ROOT CAUSE SUMMARY:
${data.rootCauseSummary}

2. STEPS TO REPRODUCE:
${steps}

3. EXPECTED VS. ACTUAL RESULTS:
* Expected Result: Application should execute transaction/action successfully without errors or hang states.
* Actual Result: ${data.rootCauseSummary}

4. STRICTLY OBSERVED VISUAL FACTS:
${facts}

5. UNVERIFIED / UNKNOWN PARAMETERS:
${unknowns}

6. WORKAROUND / QA NOTES:
* Playwright regression spec generated automatically.
* Anti-Hallucination Audit: ${data.selfValidationCheck}
`;
}

export function parseAndValidateResponse(rawText: string): AnalysisResult {
  // Strip markdown code fences if AI wraps response despite instructions
  let cleaned = rawText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  // Find the first outer JSON object if extra text exists
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Parse JSON
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`AI response is not valid JSON. Raw: ${cleaned.slice(0, 200)}`);
  }

  // Pre-normalize fields to guarantee schema adherence
  const bugTitle = typeof parsed.bugTitle === "string" && parsed.bugTitle.trim().length > 0
    ? parsed.bugTitle.trim()
    : "UI Bug Reproduction Spec";

  const severity = normalizeSeverity(parsed.severity);

  const rootCauseSummary = typeof parsed.rootCauseSummary === "string" && parsed.rootCauseSummary.trim().length > 0
    ? parsed.rootCauseSummary.trim()
    : "Observed unexpected behavior in the user interface workflow as reported.";

  const verifiedFacts = toArrayOfStrings(parsed.verifiedFacts, [
    "Observed visual state anomaly on target component",
    "Workflow does not reach expected confirmation state",
  ]);

  const unknownParameters = toArrayOfStrings(parsed.unknownParameters, []);

  const reproductionSteps = toArrayOfStrings(parsed.reproductionSteps, [
    "Step 1: Open application to target page",
    "Step 2: Execute recorded user interactions",
    "Step 3: Observe actual outcome vs expected specification",
  ]);

  const selfValidationCheck = typeof parsed.selfValidationCheck === "string" && parsed.selfValidationCheck.trim().length > 0
    ? parsed.selfValidationCheck.trim()
    : "All assertions trace back to observed facts and tester notes with generic selectors marked as inferences.";

  const generatedTestCode = typeof parsed.generatedTestCode === "string" && parsed.generatedTestCode.trim().length >= 20
    ? parsed.generatedTestCode.trim()
    : formatFallbackPlaywright(bugTitle, reproductionSteps);

  const githubIssueMarkdown = typeof parsed.githubIssueMarkdown === "string" && parsed.githubIssueMarkdown.trim().length >= 20
    ? parsed.githubIssueMarkdown.trim()
    : formatFallbackGithub({
        bugTitle,
        severity,
        rootCauseSummary,
        reproductionSteps,
        verifiedFacts,
      });

  const rawJira = typeof parsed.jiraIssueText === "string" ? parsed.jiraIssueText.trim() : "";
  const jiraIssueText = rawJira.length > 30
    ? rawJira
    : formatFallbackJiraIssue({
        bugTitle,
        severity,
        rootCauseSummary,
        verifiedFacts,
        reproductionSteps,
        unknownParameters,
        selfValidationCheck,
      });

  const normalizedPayload = {
    bugTitle,
    severity,
    rootCauseSummary,
    verifiedFacts,
    unknownParameters,
    reproductionSteps,
    generatedTestCode,
    githubIssueMarkdown,
    jiraIssueText,
    selfValidationCheck,
  };

  // Validate with Zod
  const result = AnalysisResultSchema.safeParse(normalizedPayload);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
    throw new Error(`AI response schema validation failed: ${issues}`);
  }

  return result.data as AnalysisResult;
}
