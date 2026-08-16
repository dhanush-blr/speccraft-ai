# task_plan.md — SpecCraft AI Execution Checklist

**Protocol:** B.L.A.S.T.  
**Updated:** 2026-08-16

---

## Phase 1: B — Blueprint ✅

- [x] Read B.L.A.S.T.md and Anti_Hallucinations_Rules.md
- [x] Define JSON Data Schema in LLM.md
- [x] Define Security Invariants in LLM.md
- [x] Embed Anti-Hallucination rules in LLM.md
- [x] Create task_plan.md (this file)
- [x] Create findings.md
- [x] Create progress.md
- [ ] Create .gitignore (IMMEDIATE — before any git init)
- [ ] Create .env.example with safe placeholders

---

## Phase 2: L — Link

- [ ] Create .env.local with GROQ_API_KEY placeholder
- [ ] Install groq-sdk dependency
- [ ] Build minimal API handshake test route
- [ ] Verify Groq API responds with valid JSON

---

## Phase 3: A — Architect

- [ ] Define lib/types.ts with AnalysisResult, AnalyzeRequest, AnalyzeError
- [ ] Build lib/presets.ts with 3 demo scenarios + embedded base64 images
- [ ] Build lib/groq.ts — server-side Groq client initialization
- [ ] Build lib/prompt.ts — system prompt with Anti-Hallucination rules
- [ ] Build lib/validator.ts — Zod schema + response parser
- [ ] Build app/api/analyze/route.ts with:
  - [ ] 4MB payload guard
  - [ ] Input sanitization
  - [ ] Prompt injection prevention
  - [ ] Groq API call with retry
  - [ ] Zod validation of response
  - [ ] Error boundaries

---

## Phase 4: S — Stylize

- [ ] Build app/globals.css — design system, CSS custom properties
- [ ] Build app/layout.tsx — fonts, meta, dark mode
- [ ] Build components/DropZone.tsx — drag & drop upload
- [ ] Build components/PresetCard.tsx — demo preset cards
- [ ] Build components/SeverityBadge.tsx — colored severity indicator
- [ ] Build components/CopyButton.tsx — clipboard copy with toast
- [ ] Build components/OutputPanel.tsx — tabbed output display
- [ ] Build app/page.tsx — full split-pane dashboard
  - [ ] Left panel: upload, notes, presets
  - [ ] Right panel: tabbed output
  - [ ] Loading skeleton
  - [ ] Canvas confetti on success

---

## Phase 5: T — Trigger & Verify

- [ ] Run npm run build → 0 errors
- [ ] Self-annealing: fix any TypeScript errors
- [ ] Re-run npm run build → clean pass
- [ ] Security check: verify .env.local not tracked by git
- [ ] Sample API test with preset data
- [ ] Write README.md — hackathon-ready
- [ ] Write findings.md — research notes
- [ ] Write progress.md — build log

---

## Success Criteria

- [ ] `npm run build` exits 0 with 0 errors
- [ ] All 3 preset demos load and analyze without API key (using mock mode)
- [ ] API key is never visible in browser network tab JS bundles
- [ ] Copy buttons work for all output tabs
- [ ] Canvas confetti fires on successful analysis
- [ ] Vercel deploy link is ready
