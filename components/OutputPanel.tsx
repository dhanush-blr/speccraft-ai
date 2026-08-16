"use client";

import { useState } from "react";
import { AnalysisResult } from "@/lib/types";
import SeverityBadge from "./SeverityBadge";
import CopyButton from "./CopyButton";
import {
  Code2,
  GitFork,
  FileText,
  Brain,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ListOrdered,
  Eye,
} from "lucide-react";

type Tab = "playwright" | "github" | "jira" | "rootcause";

interface OutputPanelProps {
  result: AnalysisResult;
}

export default function OutputPanel({ result }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("playwright");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "playwright", label: "Playwright Spec", icon: <Code2 size={14} /> },
    { id: "github", label: "GitHub Issue", icon: <GitFork size={14} /> },
    { id: "jira", label: "Jira Issue", icon: <FileText size={14} /> },
    { id: "rootcause", label: "Root Cause", icon: <Brain size={14} /> },
  ];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-base font-bold text-[#f0f4ff] truncate">
            {result.bugTitle}
          </h2>
          <SeverityBadge severity={result.severity} size="sm" />
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b border-[rgba(99,136,254,0.1)] mb-4 overflow-x-auto"
        role="tablist"
        aria-label="Analysis output tabs"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id ? "tab-active" : "tab-inactive"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-hidden">
        {/* Playwright Panel */}
        {activeTab === "playwright" && (
          <div
            id="panel-playwright"
            role="tabpanel"
            className="h-full flex flex-col max-w-full overflow-hidden animate-fade-in"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#94a3b8] text-xs">
                <Code2 size={12} />
                <span className="font-mono">bug.spec.ts</span>
                <span className="text-[#475569]">· Playwright TypeScript</span>
              </div>
              <CopyButton text={result.generatedTestCode} label="Copy Spec" />
            </div>
            <pre className="code-block flex-1 overflow-y-auto overflow-x-auto max-w-full text-[12.5px] leading-relaxed break-words whitespace-pre-wrap">
              {result.generatedTestCode}
            </pre>
          </div>
        )}

        {/* GitHub Issue Panel */}
        {activeTab === "github" && (
          <div
            id="panel-github"
            role="tabpanel"
            className="h-full flex flex-col max-w-full overflow-hidden animate-fade-in"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#94a3b8] text-xs">
                <GitFork size={12} />
                <span>GitHub Issue Markdown</span>
              </div>
              <CopyButton
                text={result.githubIssueMarkdown}
                label="Copy Markdown"
              />
            </div>
            <pre className="code-block flex-1 overflow-y-auto overflow-x-auto max-w-full text-[12.5px] leading-relaxed whitespace-pre-wrap break-words">
              {result.githubIssueMarkdown}
            </pre>
          </div>
        )}

        {/* Jira Issue Panel */}
        {activeTab === "jira" && (
          <div
            id="panel-jira"
            role="tabpanel"
            className="h-full flex flex-col max-w-full overflow-hidden animate-fade-in"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-[#94a3b8] text-xs">
                <FileText size={12} className="text-[#22d3ee]" />
                <span className="font-semibold text-[#f0f4ff]">Jira Issue Ticket</span>
                <span className="text-[#475569]">· Structured Text</span>
              </div>
              <CopyButton
                text={result.jiraIssueText}
                label="Copy Jira Ticket"
              />
            </div>
            <pre className="code-block flex-1 overflow-y-auto overflow-x-auto max-w-full text-[12.5px] leading-relaxed whitespace-pre-wrap break-words font-mono bg-[#060a14] border border-[rgba(99,136,254,0.15)] rounded-xl p-4 text-[#e2e8f0]">
              {result.jiraIssueText}
            </pre>
          </div>
        )}

        {/* Root Cause Panel */}
        {activeTab === "rootcause" && (
          <div
            id="panel-rootcause"
            role="tabpanel"
            className="h-full overflow-y-auto animate-fade-in space-y-5 pr-1"
          >
            {/* Root Cause Summary */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={14} className="text-[#a78bfa]" />
                <h3 className="text-xs font-bold text-[#a78bfa] uppercase tracking-wider">
                  Root Cause Summary
                </h3>
              </div>
              <p className="text-[13px] text-[#94a3b8] leading-relaxed">
                {result.rootCauseSummary}
              </p>
            </div>

            {/* Verified Facts */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Eye size={14} className="text-[#22d3ee]" />
                <h3 className="text-xs font-bold text-[#22d3ee] uppercase tracking-wider">
                  Verified Visual Facts
                </h3>
                <span className="text-[10px] text-[#475569] ml-auto">
                  {result.verifiedFacts.length} facts
                </span>
              </div>
              <div>
                {result.verifiedFacts.map((fact, i) => (
                  <div key={i} className="fact-item">
                    <CheckCircle2
                      size={13}
                      className="text-[#22d3ee] flex-shrink-0 mt-0.5"
                    />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unknown Parameters */}
            {result.unknownParameters.length > 0 && (
              <div className="glass-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={14} className="text-[#eab308]" />
                  <h3 className="text-xs font-bold text-[#eab308] uppercase tracking-wider">
                    Unknown / Unverified
                  </h3>
                </div>
                <div className="space-y-2">
                  {result.unknownParameters.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-2 items-start text-[13px] text-[#94a3b8] py-1"
                    >
                      <span className="text-[#eab308] flex-shrink-0">?</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reproduction Steps */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <ListOrdered size={14} className="text-[#10b981]" />
                <h3 className="text-xs font-bold text-[#10b981] uppercase tracking-wider">
                  Reproduction Steps
                </h3>
              </div>
              <div>
                {result.reproductionSteps.map((step, i) => (
                  <div key={i} className="step-item">
                    <span className="step-number">{i + 1}</span>
                    <span className="text-[13px] text-[#94a3b8]">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Self-Validation */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={14} className="text-[#6388fe]" />
                <h3 className="text-xs font-bold text-[#6388fe] uppercase tracking-wider">
                  Anti-Hallucination Check
                </h3>
              </div>
              <p className="text-[12px] text-[#64748b] leading-relaxed font-mono">
                {result.selfValidationCheck}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
