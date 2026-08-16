# findings.md — Research & Discoveries

**Updated:** 2026-08-16

---

## Groq SDK Findings

- **Package:** `groq-sdk` (official Groq npm package)
- **Vision Model:** `llama-3.2-11b-vision-preview` — accepts base64 image_url format
- **Text Fallback:** `llama-3.3-70b-versatile` — for text-only analysis
- **Image Format in API:** Must use `{ type: "image_url", image_url: { url: "data:image/jpeg;base64,..." } }`
- **Rate Limits:** Free tier allows reasonable requests for demo purposes
- **JSON Mode:** Groq supports `response_format: { type: "json_object" }` for deterministic JSON output

## Next.js 14 App Router Constraints

- **Server Components vs Client Components:** API routes are always server-side; page.tsx with hooks must be `"use client"`
- **Hydration Safety:** Dynamic content (confetti, clipboard) must be gated behind `useEffect` + `typeof window !== 'undefined'`
- **Environment Variables:** Variables without `NEXT_PUBLIC_` prefix are server-only — this is the security mechanism

## Vercel Compatibility

- **No native binaries:** Playwright is NOT installed — only generated as text output
- **Serverless function size:** groq-sdk is lightweight, well within Vercel limits
- **Edge runtime:** NOT used — standard Node.js runtime for Groq SDK compatibility

## Security Research

- **Base64 size check:** A 4MB image = ~5.5MB base64 string. Check `Buffer.byteLength(base64, 'base64') > 4_194_304`
- **Prompt injection vectors:** User can attempt to override system prompt via testerNotes. Mitigate with explicit system boundary declaration.
- **gitignore critical entries:** `.env`, `.env.local`, `.env*.local`, `.env.development.local`, `.env.test.local`, `.env.production.local`

## Tailwind CSS Dark Mode

- Using `class` strategy (not `media`) for explicit dark mode control
- CSS custom properties for color tokens enable smooth theming
