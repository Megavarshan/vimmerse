"use client";
import React, { useEffect } from "react";
import Script from "next/script";
import { PageLayout } from "@/components/layout/PageLayout";
import { Badge } from "@/components/ui/Badge";
import {
  ExternalLink, Globe, Mail, Sparkles, Terminal,
  Cpu, Code2, Database, Cloud, Layers, ShieldCheck, ArrowRight,
  Award, Activity, CheckCircle2, Bot, Rocket, BrainCircuit
} from "lucide-react";

export default function DeveloperPage() {
  // Re-trigger LinkedIn badging script if needed after dynamic routing
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).IN?.parse) {
      (window as any).IN.parse();
    }
  }, []);

  return (
    <PageLayout>
      <Script
        src="https://platform.linkedin.com/badges/js/profile.js"
        strategy="lazyOnload"
      />

      <div className="flex flex-col space-y-8 max-w-6xl mx-auto w-full relative z-10 py-2">

        {/* ── Top Hero Profile Capsule ────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/30 bg-gradient-to-b from-[#0f1322] via-[#0a0d16] to-[#07090f] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 h-80 w-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-80 w-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/[0.08] pb-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-400 p-[2px] shadow-[0_0_30px_rgba(139,92,246,0.35)]">
                  <div className="h-full w-full rounded-2xl bg-[#080a12] flex items-center justify-center font-mono font-bold text-2xl sm:text-3xl text-white">
                    MV
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#080a12]"></span>
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    Mega Varshan
                  </h1>
                  <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                    AI RESEARCH ENGINEER
                  </Badge>
                </div>
                <p className="text-sm sm:text-base text-zinc-300 font-sans font-medium">
                  Expertise across <span className="text-cyan-300">Machine Learning</span>, <span className="text-violet-300">Data Systems</span> & <span className="text-emerald-300">Cloud Technologies</span>
                </p>
                <div className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                  <span>Architect of Vimmerse PRISM Core</span>
                  <span>•</span>
                  <span className="text-amber-400">Razorpay AI Buildathon 2026</span>
                </div>
              </div>
            </div>

            {/* Direct Links */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://megavarshan.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all cursor-pointer"
              >
                <Globe size={14} />
                <span>Visit Portfolio</span>
                <ExternalLink size={12} />
              </a>

              <a
                href="https://in.linkedin.com/in/megavarshan"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#0077b5]/20 hover:bg-[#0077b5]/30 text-blue-300 border border-[#0077b5]/40 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.65 1.65 0 0 0 1.65-1.66 1.65 1.65 0 0 0-1.65-1.66Z" />
                </svg>
                <span>LinkedIn</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Bio & Project Impact */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 pt-2">
            <div className="lg:col-span-7 space-y-4 text-zinc-300 leading-relaxed font-sans text-sm sm:text-base">
              <p>
                I am an <strong>AI Research Engineer</strong> with deep expertise spanning Machine Learning architectures, distributed Big Data pipelines, and modern Cloud technologies. My work centers on architecting autonomous agent runtimes that replace fragile, non-deterministic prompt templates with explainable state machines, mathematical safety bounds, and production-ready financial execution rails.
              </p>
              <p className="text-zinc-400 text-sm">
                In <strong>Vimmerse</strong>, I designed and built the <strong>PRISM Cognitive Decision Architecture (Layers 1 through 6)</strong> specifically for the <em>Razorpay AI Buildathon</em>. The engine introduces <strong>"THE BAR™"</strong>—a deterministic policy admissibility barrier that guarantees online merchants never sell below wholesale cost + 15% profit floor, declines out-of-domain inquiries without hallucinations, and facilitates automated machine-to-machine checkout via Razorpay Orders.
              </p>

              {/* Core Skill Pills */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Cpu size={14} /> Machine Learning
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Agentic workflows, LangGraph state machines, slot extraction, LLM fine-tuning, Groq inference.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <div className="flex items-center gap-1.5 text-violet-300 font-bold">
                    <Database size={14} /> Data Architectures
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Semantic knowledge graphs, vector retrieval (pgvector, Neo4j), token-graph alignment, CRO matrices.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <Cloud size={14} /> Cloud & Rails
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans">
                    Next.js 16 full-stack, FastAPI, Razorpay Payments SDK, webhooks, Docker, scalable SaaS infra.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Official LinkedIn Badge Embed ────────────────────── */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-2xl bg-[#0b0e17] border border-white/[0.1] shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-2 font-mono text-xs text-zinc-400">
                  <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                    <svg className="w-3.5 h-3.5 fill-current text-blue-400" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.65 1.65 0 0 0-1.66 1.66 1.66 1.66 0 0 0 1.66 1.66 1.65 1.65 0 0 0 1.65-1.66 1.65 1.65 0 0 0-1.65-1.66Z" />
                    </svg>
                    Official Verified Profile
                  </span>
                  <span className="text-[10px] text-emerald-400">SYNCED</span>
                </div>

                {/* The User's Exact LinkedIn Embed Container */}
                <div className="flex justify-center p-2 overflow-hidden bg-white/5 rounded-xl border border-white/5">
                  <div
                    className="badge-base LI-profile-badge"
                    data-locale="en_US"
                    data-size="large"
                    data-theme="dark"
                    data-type="HORIZONTAL"
                    data-vanity="megavarshan"
                    data-version="v1"
                  >
                    <a
                      className="badge-base__link LI-simple-link text-xs font-mono text-violet-400 hover:underline"
                      href="https://in.linkedin.com/in/megavarshan?trk=profile-badge"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Megavarshan A (LinkedIn Profile)
                    </a>
                  </div>
                </div>

                {/* Quick Credentials Summary */}
                <div className="p-3 rounded-xl bg-black/40 border border-white/[0.06] font-mono text-[11px] space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Name:</span>
                    <span className="text-white font-semibold">Mega Varshan</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Role:</span>
                    <span className="text-cyan-300">AI Research Engineer</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Portfolio:</span>
                    <a
                      href="https://megavarshan.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
                    >
                      megavarshan.vercel.app <ExternalLink size={10} />
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Hackathon:</span>
                    <span className="text-violet-300">Razorpay AI Buildathon 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Engineering Highlights in Vimmerse ────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wider">
                Vimmerse System Contributions
              </h3>
              <p className="text-xs text-zinc-400 font-sans">
                Engineered from the ground up by Mega Varshan for the Razorpay AI Buildathon
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-[#090b11] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-violet-400 font-bold">
                <BrainCircuit size={15} />
                <span>PRISM 6-Stage Graph</span>
              </div>
              <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                Authored complete LangGraph state machine orchestrating perception, knowledge matching, policy checks, uncertainty analysis, and dynamic discounting.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090b11] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck size={15} />
                <span>THE BAR™ Policy Gating</span>
              </div>
              <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                Implemented strict mathematical floor price protection (<code className="text-emerald-300">Cost × 1.15</code>), budget-aware SKU matching, and zero-hallucination out-of-catalog decline handlers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#090b11] border border-white/[0.08] space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold">
                <Bot size={15} />
                <span>M2M & Razorpay Rails</span>
              </div>
              <p className="text-zinc-400 font-sans text-xs leading-relaxed">
                Enabled ACP/1.2 machine-to-machine contract negotiation and integrated real Razorpay Orders API dispatch with post-payment chat receipts.
              </p>
            </div>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
