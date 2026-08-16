"use client";

import { Severity } from "@/lib/types";

interface SeverityBadgeProps {
  severity: Severity;
  size?: "sm" | "md" | "lg";
}

const severityConfig: Record<
  Severity,
  { label: string; className: string; dot: string; icon: string }
> = {
  Critical: {
    label: "CRITICAL",
    className: "badge-critical",
    dot: "bg-red-500",
    icon: "🔴",
  },
  High: {
    label: "HIGH",
    className: "badge-high",
    dot: "bg-orange-500",
    icon: "🟠",
  },
  Medium: {
    label: "MEDIUM",
    className: "badge-medium",
    dot: "bg-yellow-500",
    icon: "🟡",
  },
  Low: {
    label: "LOW",
    className: "badge-low",
    dot: "bg-green-500",
    icon: "🟢",
  },
};

export default function SeverityBadge({
  severity,
  size = "md",
}: SeverityBadgeProps) {
  const config = severityConfig[severity];
  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-4 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold tracking-widest ${config.className} ${sizeClasses[size]}`}
      aria-label={`Severity: ${severity}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </span>
  );
}
