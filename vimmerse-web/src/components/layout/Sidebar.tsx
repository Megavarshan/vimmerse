import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Radio, Network, BarChart3, Clock } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Live Studio', href: '/studio', icon: Radio },
  { name: 'Knowledge Graph', href: '/graph', icon: Network },
  { name: 'Decision Explorer', href: '/decisions', icon: Clock },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Sidebar() {
  return (
    <aside className="glass-panel w-64 h-[calc(100vh-4rem)] border-r border-white/5 flex flex-col hidden md:flex">
      <div className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-white transition-all group"
            >
              <Icon size={18} className="group-hover:text-[var(--color-electric-violet)] transition-colors" />
              {item.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
