"use client";
import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';

export default function Analytics() {
  return (
    <PageLayout>
      <div className="flex flex-col space-y-6 max-w-7xl mx-auto w-full relative z-10 h-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">System Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into cognitive performance and economic utility metrics.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="glass" className="h-[350px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--color-emerald)]">
                <TrendingUp className="h-5 w-5" />
                Utility Score (U) Trends
              </CardTitle>
              <CardDescription>Average economic utility over 30 days.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[220px]">
              <div className="flex items-end justify-center gap-2 h-32 w-full px-4 mt-8">
                {[40, 60, 45, 70, 50, 85, 90, 75, 80, 95].map((h, i) => (
                  <div key={i} className="w-full bg-[var(--color-emerald)]/30 rounded-t-sm hover:bg-[var(--color-emerald)] transition-all cursor-pointer relative group" style={{ height: `${h}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs px-2 py-1 rounded text-white whitespace-nowrap transition-opacity">
                      U={h/100}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="h-[350px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--color-electric-violet)]">
                <BarChart3 className="h-5 w-5" />
                Admissibility Rates
              </CardTitle>
              <CardDescription>Accepted vs Rejected AI negotiations.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[220px]">
              <div className="w-48 h-48 rounded-full border-[16px] border-white/5 relative flex items-center justify-center">
                {/* SVG Pie Chart simulation */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--color-electric-violet)" strokeWidth="16" strokeDasharray="210 264" />
                  <circle cx="50" cy="50" r="42" fill="transparent" stroke="var(--color-emerald)" strokeWidth="16" strokeDasharray="54 264" strokeDashoffset="-210" />
                </svg>
                <div className="text-center">
                  <span className="text-3xl font-bold text-white">79%</span>
                  <span className="block text-xs text-muted-foreground uppercase tracking-widest mt-1">Admissible</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card variant="glass" className="h-[350px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--color-razor-blue)]">
                <PieChart className="h-5 w-5" />
                Intent Distribution
              </CardTitle>
              <CardDescription>Parsed intents across all sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                <div>
                  <div className="flex justify-between text-sm mb-1 text-white">
                    <span>Negotiation</span>
                    <span>45%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-razor-blue)] w-[45%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1 text-white">
                    <span>Product Query</span>
                    <span>30%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-razor-blue)]/70 w-[30%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1 text-white">
                    <span>Support/Refund</span>
                    <span>15%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-razor-blue)]/50 w-[15%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1 text-white">
                    <span>Other</span>
                    <span>10%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-razor-blue)]/30 w-[10%]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
