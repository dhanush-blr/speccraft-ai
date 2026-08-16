"use client";

import { Preset } from "@/lib/types";
import SeverityBadge from "./SeverityBadge";
import { Zap } from "lucide-react";

interface PresetCardProps {
  preset: Preset;
  isActive: boolean;
  onSelect: (preset: Preset) => void;
}

export default function PresetCard({
  preset,
  isActive,
  onSelect,
}: PresetCardProps) {
  return (
    <button
      onClick={() => onSelect(preset)}
      aria-pressed={isActive}
      aria-label={`Load demo preset: ${preset.title}`}
      className={`preset-card w-full text-left group ${isActive ? "active" : ""}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <Zap
            size={12}
            className={`flex-shrink-0 transition-colors ${
              isActive ? "text-[#6388fe]" : "text-[#475569] group-hover:text-[#6388fe]"
            }`}
          />
          <span className="text-[13px] font-semibold text-[#e2e8f0] leading-tight line-clamp-2">
            {preset.title}
          </span>
        </div>
        <SeverityBadge severity={preset.severity} size="sm" />
      </div>
      <p className="text-[11px] text-[#64748b] leading-relaxed line-clamp-2 ml-[20px]">
        {preset.description}
      </p>
      <div className="flex flex-wrap gap-1 mt-2 ml-[20px]">
        {preset.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(99,136,254,0.08)] text-[#6388fe] border border-[rgba(99,136,254,0.15)]"
          >
            #{tag}
          </span>
        ))}
      </div>
    </button>
  );
}
