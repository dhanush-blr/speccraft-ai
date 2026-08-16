"use client";

import { useState, useCallback, useRef } from "react";
import { AnalysisResult, isAnalyzeError, Preset, MimeType } from "@/lib/types";
import { PRESETS } from "@/lib/presets";
import DropZone from "@/components/DropZone";
import PresetCard from "@/components/PresetCard";
import OutputPanel from "@/components/OutputPanel";
import {
  Zap,
  Sparkles,
  AlertCircle,
  FlaskConical,
  GitFork,
  Shield,
  ChevronRight,
  Loader2,
  FileSearch,
  Terminal,
  Code2,
  Brain,
  FileText,
} from "lucide-react";

type AppState = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<MimeType>("image/png");
  const [testerNotes, setTesterNotes] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
  const [appState, setAppState] = useState<AppState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);
  const confettiFired = useRef(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // Dynamically import canvas-confetti to avoid SSR issues
  const fireConfetti = useCallback(async () => {
    if (confettiFired.current) return;
    confettiFired.current = true;
    try {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5, x: 0.6 },
        colors: ["#6388fe", "#a78bfa", "#22d3ee", "#10b981", "#f0f4ff"],
        disableForReducedMotion: true,
      });
    } catch {
      // Confetti is a progressive enhancement — fail silently
    }
    setTimeout(() => {
      confettiFired.current = false;
    }, 3000);
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const handlePresetSelect = useCallback((preset: Preset) => {
    setSelectedPreset(preset);
    setImageBase64(preset.imageBase64);
    setMimeType(preset.mimeType);
    setTesterNotes(preset.testerNotes);
    setResult(null);
    setErrorMessage("");
    setAppState("idle");
    showToast(`✓ Loaded: ${preset.title}`);
  }, [showToast]);

  const handleImageLoaded = useCallback((base64: string, mime: string) => {
    setImageBase64(base64);
    setMimeType(mime as MimeType);
    setSelectedPreset(null);
  }, []);

  const handleClearImage = useCallback(() => {
    setImageBase64(null);
    setSelectedPreset(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!imageBase64 || !imageBase64.trim()) {
      setErrorMessage("Screenshot is mandatory for visual analysis. Please upload an image or select a preset.");
      setAppState("error");
      showToast("⚠ Screenshot is mandatory for visual analysis.");
      return;
    }
    if (!testerNotes.trim()) {
      setErrorMessage("Please add tester notes describing the bug.");
      setAppState("error");
      showToast("⚠ Please add tester notes describing the bug.");
      return;
    }

    setAppState("loading");
    setResult(null);
    setErrorMessage("");

    try {
      const body: Record<string, string> = {
        testerNotes,
        mimeType,
      };
      if (imageBase64) body.imageBase64 = imageBase64;
      if (selectedPreset) body.presetId = selectedPreset.id;

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || isAnalyzeError(data)) {
        setErrorMessage(data.error || "Analysis failed. Please try again.");
        setAppState("error");
        return;
      }

      setResult(data as AnalysisResult);
      setAppState("success");
      await fireConfetti();

      // Scroll to output on mobile
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setErrorMessage(msg);
      setAppState("error");
    }
  }, [testerNotes, imageBase64, mimeType, selectedPreset, fireConfetti, showToast]);

  const hasScreenshot = Boolean(imageBase64 && imageBase64.trim().length > 0);
  const hasNotes = Boolean(testerNotes && testerNotes.trim().length > 0);
  const isLoading = appState === "loading";
  const canAnalyze = hasScreenshot && hasNotes && !isLoading;

  const helperText =
    !hasScreenshot && !hasNotes
      ? "Add tester notes and screenshot to generate spec"
      : !hasScreenshot
      ? "Upload a screenshot or pick a preset to continue"
      : !hasNotes
      ? "Add tester notes describing the bug to continue"
      : null;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Mesh background */}
      <div className="mesh-bg" aria-hidden="true" />

      {/* Main layout */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="border-b border-[rgba(99,136,254,0.1)] bg-[rgba(8,12,20,0.8)] backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4f6ef7] to-[#7c3aed] flex items-center justify-center shadow-lg shadow-[rgba(99,136,254,0.3)]">
                <FlaskConical size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-[15px] font-bold gradient-text">SpecCraft AI</h1>
                <p className="text-[10px] text-[#475569] leading-none mt-0.5">Visual QA → Playwright Studio</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(99,136,254,0.08)] border border-[rgba(99,136,254,0.2)] text-[11px] text-[#6388fe]">
                <Shield size={10} />
                Anti-Hallucination Active
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] text-[11px] text-[#10b981]">
                <Zap size={10} />
                Groq Powered
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
                className="w-8 h-8 rounded-lg border border-[rgba(99,136,254,0.2)] flex items-center justify-center text-[#64748b] hover:text-[#6388fe] hover:border-[rgba(99,136,254,0.4)] transition-all"
              >
                <GitFork size={15} />
              </a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-[1400px] mx-auto px-6 pt-10 pb-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(99,136,254,0.08)] border border-[rgba(99,136,254,0.2)] text-[12px] text-[#6388fe] mb-6 animate-fade-in">
            <Sparkles size={12} />
            AI Tester 3X Hackathon · Visual QA to Playwright
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight gradient-text mb-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Screenshot → Test Spec
            <br />
            <span className="text-[#f0f4ff]">in Seconds.</span>
          </h2>
          <p className="text-[#64748b] text-sm sm:text-base max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Upload a UI bug screenshot, add context, and get a production-ready
            Playwright <code className="font-mono text-[#6388fe] text-[13px]">.spec.ts</code>, GitHub Issue, and root cause analysis — all powered by Groq AI with Anti-Hallucination guarantees.
          </p>
        </section>

        {/* Main Split-Pane */}
        <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 pb-10 w-full">
          <div className="grid grid-cols-1 xl:grid-cols-[480px_1fr] gap-5 items-start">
            {/* ── LEFT PANEL ────────────────────────────── */}
            <div className="space-y-4">
              {/* Screenshot Upload */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FileSearch size={15} className="text-[#6388fe]" />
                  <h3 className="text-[13px] font-bold text-[#e2e8f0] uppercase tracking-wider">
                    Bug Screenshot
                  </h3>
                  <span className="text-[10px] text-[#475569] ml-auto">Supports PNG, JPG, WebP (Max 4MB)</span>
                </div>
                <DropZone
                  onImageLoaded={handleImageLoaded}
                  onError={(msg) => showToast(`⚠ ${msg}`)}
                  currentImageSrc={
                    imageBase64 && imageBase64.trim().length > 0
                      ? `data:${mimeType};base64,${imageBase64}`
                      : null
                  }
                  onClear={handleClearImage}
                />
              </div>

              {/* Tester Notes */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Terminal size={15} className="text-[#a78bfa]" />
                  <h3 className="text-[13px] font-bold text-[#e2e8f0] uppercase tracking-wider">
                    Tester Notes
                  </h3>
                  <span className="text-[10px] text-[#475569] ml-auto">
                    {testerNotes.length}/2000
                  </span>
                </div>
                <textarea
                  id="tester-notes"
                  value={testerNotes}
                  onChange={(e) => setTesterNotes(e.target.value.slice(0, 2000))}
                  placeholder="Describe the bug: steps to reproduce, expected vs. actual behavior, browser/device, error messages..."
                  maxLength={2000}
                  rows={5}
                  aria-label="Tester notes describing the bug"
                  className="w-full bg-[#060a14] border border-[rgba(99,136,254,0.15)] rounded-xl p-3 text-[13px] text-[#94a3b8] placeholder-[#334155] focus:outline-none focus:border-[rgba(99,136,254,0.5)] focus:ring-1 focus:ring-[rgba(99,136,254,0.3)] transition-all duration-200 resize-none font-mono leading-relaxed"
                />
              </div>

              {/* Instant Demo Presets */}
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={15} className="text-[#22d3ee]" />
                  <h3 className="text-[13px] font-bold text-[#e2e8f0] uppercase tracking-wider">
                    Instant Demo Presets
                  </h3>
                  <span className="text-[10px] text-[#22d3ee] ml-auto border border-[rgba(34,211,238,0.2)] px-1.5 py-0.5 rounded-full">
                    1-click
                  </span>
                </div>
                <p className="text-[11px] text-[#475569] mb-3">
                  No upload needed — try these pre-loaded bug scenarios:
                </p>
                <div className="space-y-2">
                  {PRESETS.map((preset) => (
                    <PresetCard
                      key={preset.id}
                      preset={preset}
                      isActive={selectedPreset?.id === preset.id}
                      onSelect={handlePresetSelect}
                    />
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="space-y-2">
                <button
                  id="analyze-btn"
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  aria-label="Analyze bug and generate test spec"
                  title={helperText || undefined}
                  className={`btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed ${
                    canAnalyze ? "animate-pulse-glow" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Analyzing with Groq AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Analyze Bug & Generate Spec</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
                {helperText && !isLoading && (
                  <p className="text-[11px] text-[#94a3b8] text-center flex items-center justify-center gap-1.5 animate-fade-in">
                    <AlertCircle size={12} className="text-[#6388fe] flex-shrink-0" />
                    {helperText}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {appState === "error" && errorMessage && (
                <div
                  role="alert"
                  className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] animate-fade-in"
                >
                  <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 text-[12px] font-semibold mb-1">Analysis Failed</p>
                    <p className="text-[#94a3b8] text-[12px]">{errorMessage}</p>
                    {errorMessage.includes("GROQ_API_KEY") && (
                      <p className="text-[11px] text-[#64748b] mt-2">
                        → Add your key to{" "}
                        <code className="font-mono text-[#6388fe]">.env.local</code>:{" "}
                        <code className="font-mono text-[#64748b]">
                          GROQ_API_KEY=gsk_...
                        </code>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT PANEL ───────────────────────────── */}
            <div
              ref={outputRef}
              className="glass-card p-5 min-h-[600px] flex flex-col overflow-hidden max-w-full break-words"
            >
              {appState === "idle" && (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 py-16">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[rgba(99,136,254,0.15)] to-[rgba(167,139,250,0.1)] border border-[rgba(99,136,254,0.15)] flex items-center justify-center animate-float">
                    <FlaskConical size={34} className="text-[#6388fe]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#e2e8f0] mb-2">
                      Your Analysis Will Appear Here
                    </h3>
                    <p className="text-[#475569] text-[13px] max-w-sm mx-auto">
                      Upload a screenshot or select a demo preset, then click{" "}
                      <strong className="text-[#6388fe]">Analyze Bug</strong> to generate your Playwright spec.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-lg">
                    {[
                      { icon: <Code2 size={16} />, label: "Playwright Spec", color: "text-[#6388fe]" },
                      { icon: <GitFork size={16} />, label: "GitHub Issue", color: "text-[#a78bfa]" },
                      { icon: <FileText size={16} />, label: "Jira Ticket", color: "text-[#22d3ee]" },
                      { icon: <Brain size={16} />, label: "Root Cause", color: "text-[#10b981]" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="p-3 rounded-xl border border-[rgba(99,136,254,0.1)] bg-[rgba(99,136,254,0.03)] flex flex-col items-center gap-2"
                      >
                        <span className={item.color}>{item.icon}</span>
                        <span className="text-[10px] text-[#475569] text-center leading-tight">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {appState === "loading" && (
                <div className="flex-1 flex flex-col items-center justify-center gap-6 py-16 animate-fade-in">
                  <div className="relative w-20 h-20">
                    <div className="w-20 h-20 rounded-full border-2 border-[rgba(99,136,254,0.1)] absolute" />
                    <div className="w-20 h-20 rounded-full border-2 border-transparent border-t-[#6388fe] absolute animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FlaskConical size={28} className="text-[#6388fe]" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-semibold text-[#e2e8f0] mb-1">
                      Groq AI is analyzing...
                    </p>
                    <p className="text-[12px] text-[#475569]">
                      Running 4-step Anti-Hallucination reasoning
                    </p>
                  </div>
                  <div className="w-full max-w-xs space-y-3">
                    {[
                      "Extracting verified visual facts",
                      "Mapping unknown parameters",
                      "Generating Playwright assertions",
                      "Self-validation check",
                    ].map((step, i) => (
                      <div key={step} className="flex items-center gap-3">
                        <div className="skeleton w-4 h-4 rounded-full flex-shrink-0" style={{ animationDelay: `${i * 0.3}s` }} />
                        <div className="skeleton h-3 rounded flex-1" style={{ animationDelay: `${i * 0.2}s` }} />
                        <span className="text-[10px] text-[#334155]">{`Step ${i + 1}`}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {appState === "success" && result && (
                <OutputPanel result={result} />
              )}

              {appState === "error" && (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 py-16 animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center">
                    <AlertCircle size={28} className="text-red-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-semibold text-red-400 mb-1">
                      Analysis Failed
                    </p>
                    <p className="text-[12px] text-[#475569] max-w-xs">
                      Check the error message on the left panel and verify your Groq API key is set in <code className="font-mono text-[#6388fe]">.env.local</code>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[rgba(99,136,254,0.08)] bg-[rgba(8,12,20,0.5)] py-5">
          <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#334155]">
            <p>
              Built with{" "}
              <span className="text-[#6388fe]">♥</span> for the AI Tester 3X Hackathon ·{" "}
              <span className="gradient-text font-semibold">SpecCraft AI</span>
            </p>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[#475569]">
                <Shield size={10} />
                Anti-Hallucination
              </span>
              <span className="flex items-center gap-1 text-[#475569]">
                <Zap size={10} />
                Groq Llama 3.3 / Vision
              </span>

              <span className="flex items-center gap-1 text-[#475569]">
                <Code2 size={10} />
                Next.js 14
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Toast */}
      {toast && (
        <div role="status" aria-live="polite" className="toast">
          {toast}
        </div>
      )}
    </div>
  );
}
