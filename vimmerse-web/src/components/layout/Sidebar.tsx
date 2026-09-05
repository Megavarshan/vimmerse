"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Radio, Network, BarChart3, Clock, Sparkles, ArrowUpRight } from 'lucide-react';

const navItems = [
  { name: 'Merchant Brain', href: '/dashboard', icon: LayoutDashboard, badge: 'Live' },
  { name: 'Live Studio', href: '/studio', icon: Radio, badge: 'AI-to-AI' },
  { name: 'Knowledge Graph', href: '/graph', icon: Network, badge: 'Neo4j' },
  { name: 'Decision Explorer', href: '/decisions', icon: Clock, badge: 'Audit' },
  { name: 'Analytics & Sim', href: '/analytics', icon: BarChart3, badge: 'What-If' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 h-[calc(100vh-3.5rem)] border-r border-white/[0.07] bg-[#090b11]/90 flex flex-col hidden md:flex shrink-0 z-20 backdrop-blur-md">
      <div className="flex-1 py-4 px-2 space-y-1">
        <div className="px-3 pb-2 pt-1 flex items-center justify-between">
          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
            Agent Fleet
          </span>
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-zinc-800/80 text-white border border-white/10 shadow-sm'
                  : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  size={15}
                  className={`transition-colors ${
                    isActive ? 'text-violet-400' : 'text-zinc-400 group-hover:text-zinc-300'
                  }`}
                />
                <span className="tracking-tight">{item.name}</span>
              </div>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  isActive
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'bg-white/[0.04] text-zinc-400 group-hover:bg-white/[0.08]'
                }`}
              >
                {item.badge}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Creator / Developer Navigation Card */}
      <div className="mx-2 mb-2 p-3 rounded-lg border border-violet-500/20 bg-[#0e111a] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase text-violet-400 font-bold tracking-wider">
            Engineer
          </span>
          <span className="text-[9px] font-mono px-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            ONLINE
          </span>
        </div>
        <div>
          <h4 className="text-xs font-bold text-white tracking-tight">Mega Varshan</h4>
          <p className="text-[10px] text-zinc-400 leading-tight mt-0.5">
            AI Research Engineer • ML, Data & Cloud
          </p>
        </div>
        <a
          href="https://megavarshan.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-1.5 px-2 rounded bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 hover:text-white border border-violet-500/30 text-[10px] font-mono font-semibold flex items-center justify-center gap-1 transition-all"
        >
          <span>Portfolio</span>
          <ArrowUpRight size={11} />
        </a>
      </div>

      {/* Footer System Diagnostics */}
      <div className="p-3 m-2 rounded-lg border border-white/[0.06] bg-zinc-900/60 text-xs font-mono">
        <div className="flex items-center justify-between text-zinc-300 font-medium mb-1.5">
          <div className="flex items-center gap-1.5 text-violet-300 text-[11px]">
            <Sparkles size={13} />
            <span>PRISM L3 Core</span>
          </div>
          <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/20">
            99.9%
          </span>
        </div>
        <p className="text-[10px] text-zinc-400 leading-tight font-sans">
          Deterministic profit & margin policy gating before transaction dispatch.
        </p>
      </div>
    </aside>
  );
}

