"use client";
import React from "react";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

interface ConfidenceHaloProps {
  score?: number; // 0 to 1
  status?: "ADMISSIBLE" | "CLARIFY" | "REJECTED" | "OUT_OF_CATALOG";
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function ConfidenceHalo({
  score = 0.92,
  status = "ADMISSIBLE",
  label = "Confidence",
  size = "md",
}: ConfidenceHaloProps) {
  let badgeColor = "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
  let dotColor = "bg-emerald-400";
  let Icon = ShieldCheck;

  if (status === "CLARIFY" || (score >= 0.5 && score < 0.8)) {
    badgeColor = "border-amber-500/20 bg-amber-500/10 text-amber-400";
    dotColor = "bg-amber-400";
    Icon = AlertTriangle;
  } else if (status === "REJECTED" || score < 0.5) {
    badgeColor = "border-rose-500/20 bg-rose-500/10 text-rose-400";
    dotColor = "bg-rose-400";
    Icon = ShieldAlert;
  }

  const percent = Math.round(score * 100);

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-[11px] font-mono tracking-tight transition-all duration-300 ${badgeColor}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span className="text-zinc-400">{label}:</span>
      <span className="font-bold text-zinc-100">{percent}%</span>
      <span className="text-[9px] px-1 py-0.2 rounded bg-white/[0.06] text-zinc-300 uppercase">
        {status}
      </span>
    </div>
  );
}
