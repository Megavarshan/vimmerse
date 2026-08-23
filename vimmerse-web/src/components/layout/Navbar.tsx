import React from 'react';
import Link from 'next/link';
import { Hexagon, Settings, User } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="glass-panel sticky top-0 z-40 flex h-16 w-full items-center justify-between px-6 border-b border-white/5">
      <div className="flex items-center gap-2">
        <Hexagon className="h-6 w-6 text-[var(--color-electric-violet)]" />
        <Link href="/" className="text-xl font-bold tracking-tighter text-white">
          <span className="text-gradient font-mono">VIMMERSE</span>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-white transition-colors">
          <Settings size={20} />
        </button>
        <div className="h-8 w-8 rounded-full bg-[var(--color-electric-violet)]/20 flex items-center justify-center border border-[var(--color-electric-violet)]/50">
          <User size={16} className="text-white" />
        </div>
      </div>
    </nav>
  );
}
