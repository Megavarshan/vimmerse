"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Hexagon, ShieldCheck, Cpu, Store, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between px-5 border-b border-white/[0.07] bg-[#090b11]/85 backdrop-blur-md">
      {/* Brand & Platform Architecture identifier */}
      <div className="flex items-center gap-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center group-hover:border-violet-500/50 transition-colors shadow-inner">
            <Hexagon className="h-4 w-4 text-violet-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tracking-tight text-white font-mono">
              vimmerse
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/[0.08]">
              v2.0
            </span>
          </div>
        </Link>

        <div className="h-4 w-[1px] bg-white/[0.08] hidden sm:block" />

        {/* Engine Operational Status */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900/80 border border-white/[0.06] text-[11px] font-mono text-zinc-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-zinc-400">Engine:</span>
          <span className="text-emerald-400 font-medium">PRISM Gated</span>
        </div>
      </div>

      {/* Right Controls & Telemetry */}
      <div className="flex items-center gap-2.5 text-xs font-mono">
        {/* Connected Integration */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900/60 border border-white/[0.06] text-zinc-400 text-[11px]">
          <Store size={13} className="text-zinc-400" />
          <span>Shopify: <strong className="text-zinc-200 font-medium">NeoStore</strong></span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>

        {/* Razorpay Gateway Node */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px]">
          <ShieldCheck size={13} className="text-blue-400" />
          <span>Razorpay Rails</span>
        </div>

        {/* ── DEVELOPER PROFILE BAR ─────────────────────────── */}
        <div className="relative group">
          <a
            href="https://megavarshan.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900/90 border border-violet-500/30 hover:border-violet-500 text-zinc-200 transition-all text-[11px] shadow-sm group-hover:bg-zinc-800"
          >
            <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-[9px] font-bold text-white shrink-0 shadow-sm">
              M
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-white">Mega Varshan</span>
              <span className="text-[9px] text-violet-300 hidden md:inline">• AI Research Engineer</span>
            </div>
            <ArrowUpRight size={12} className="text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          {/* Hover Card / Tooltip details */}
          <div className="absolute right-0 top-full mt-2 w-72 p-3.5 rounded-xl bg-[#0e111a] border border-violet-500/30 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-auto">
            <div className="space-y-2 text-xs font-sans">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div>
                  <h4 className="font-bold text-white text-sm">Mega Varshan</h4>
                  <p className="text-[10px] text-violet-400 font-mono font-medium">AI Research Engineer</p>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CREATOR
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Expertise across Machine Learning, Big Data architectures, and Cloud Technologies. Architect of Vimmerse PRISM Cognitive Commerce Core.
              </p>
              <a
                href="https://megavarshan.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-1.5 py-1.5 px-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Visit megavarshan.vercel.app</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Fast Action CTA */}
        <Link
          href="/studio"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all text-xs shadow-sm hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          <span>Live Studio</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>
    </header>
  );
}

