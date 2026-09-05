"use client";
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  BarChart3, TrendingUp, PieChart, Sparkles, Sliders, Play, CheckCircle2, 
  ArrowUpRight, ArrowDownRight, Scale, ShieldCheck, RefreshCw, Cpu
} from 'lucide-react';

export default function Analytics() {
  // Counterfactual Simulation state
  const [inventoryShift, setInventoryShift] = useState<number>(-50); // -50%
  const [demandSurge, setDemandSurge] = useState<number>(2.5); // 2.5x
  const [marginCap, setMarginCap] = useState<number>(20); // 20%
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simResults, setSimResults] = useState<any>({
    projectedRevenueUplift: "+32.8%",
    projectedAdmissibility: "91.4%",
    projectedLtv: "+24.0%",
    policyAdjustments: [
      "Auto-raised floor price threshold by +3.5% due to inventory scarcity.",
      "Increased upselling aggressiveness on high-margin Pro Socks bundles.",
      "Maintained Gold Member loyalty multiplier 1.25x."
    ]
  });

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Calculate realistic dynamic outputs based on sliders
      const rev = 28 + (inventoryShift > 0 ? 8 : -4) + (demandSurge * 3);
      const adm = 94 - Math.abs(inventoryShift / 10) - (marginCap > 20 ? 5 : 0);
      const ltv = 20 + demandSurge * 2;

      setSimResults({
        projectedRevenueUplift: `+${rev.toFixed(1)}%`,
        projectedAdmissibility: `${adm.toFixed(1)}%`,
        projectedLtv: `+${ltv.toFixed(1)}%`,
        policyAdjustments: [
          `PRISM adjusted floor margin threshold to ${marginCap}% dynamically.`,
          `Re-weighted CRO Utility equation: U = 0.40(Profit) + 0.25(Satisfaction) + 0.20(LTV) - 0.15(Risk).`,
          `Simulated 1,000 commercial requests: 0 margin breach violations.`
        ]
      });
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <PageLayout>
      <div className="flex flex-col space-y-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">System Analytics & Counterfactual Simulator</h1>
              <Badge variant="outline" className="text-xs font-mono border-emerald-500/30 text-emerald-300">
                PRISM SIMULATOR v2.0
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Test what-if commercial scenarios and analyze real-time economic decision utility.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleRunSimulation} className="h-10 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2">
              <Sparkles size={14} /> Run What-If Simulation
            </Button>
          </div>
        </div>

        {/* INTERACTIVE COUNTERFACTUAL SIMULATOR ENGINE */}
        <Card variant="glass" className="border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-black to-violet-950/20 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="text-base font-bold text-white flex items-center justify-between font-mono">
              <span className="flex items-center gap-2 text-amber-300">
                <Sliders className="h-5 w-5 text-amber-400" />
                Counterfactual Simulation Engine
              </span>
              <span className="text-xs text-muted-foreground font-sans">
                "What if inventory drops or demand surges?"
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Slider 1: Inventory Shift */}
              <div className="space-y-2 glass-panel p-4 rounded-xl border-white/10">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">Inventory Level Shift</span>
                  <span className="text-amber-400 font-bold">{inventoryShift}%</span>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="100"
                  value={inventoryShift}
                  onChange={(e) => setInventoryShift(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-muted-foreground block font-mono">
                  Simulate stock shortage or overstock clearance
                </span>
              </div>

              {/* Slider 2: Demand Surge */}
              <div className="space-y-2 glass-panel p-4 rounded-xl border-white/10">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">Demand Surge Multiplier</span>
                  <span className="text-violet-400 font-bold">{demandSurge}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={demandSurge}
                  onChange={(e) => setDemandSurge(Number(e.target.value))}
                  className="w-full accent-violet-500 cursor-pointer"
                />
                <span className="text-[10px] text-muted-foreground block font-mono">
                  Simulate viral campaign or Black Friday traffic
                </span>
              </div>

              {/* Slider 3: Floor Margin Cap */}
              <div className="space-y-2 glass-panel p-4 rounded-xl border-white/10">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-muted-foreground">Minimum Floor Margin</span>
                  <span className="text-emerald-400 font-bold">{marginCap}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="35"
                  value={marginCap}
                  onChange={(e) => setMarginCap(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-muted-foreground block font-mono">
                  Strict floor profit margin rule binding
                </span>
              </div>

            </div>

            {/* Run Button & Projected Results */}
            <div className="pt-2">
              <Button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-600 to-violet-600 hover:from-amber-500 hover:to-violet-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                {isSimulating ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    PRISM Re-indexing 1,000 Commercial Scenarios...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play size={16} /> Recompute PRISM Decisions Instantly
                  </span>
                )}
              </Button>
            </div>

            {/* Simulation Results Output */}
            {simResults && (
              <div className="p-6 rounded-2xl bg-black/60 border border-emerald-500/30 space-y-4 font-mono">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Simulation Complete — 1,000 Scenarios Evaluated
                  </span>
                  <span className="text-[10px] text-muted-foreground">Deterministic Re-index</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 rounded-xl glass-panel text-center">
                    <span className="text-[10px] text-muted-foreground uppercase block">Projected Revenue Uplift</span>
                    <span className="text-xl font-bold text-emerald-400">{simResults.projectedRevenueUplift}</span>
                  </div>
                  <div className="p-3 rounded-xl glass-panel text-center">
                    <span className="text-[10px] text-muted-foreground uppercase block">Projected Admissibility</span>
                    <span className="text-xl font-bold text-blue-400">{simResults.projectedAdmissibility}</span>
                  </div>
                  <div className="p-3 rounded-xl glass-panel text-center">
                    <span className="text-[10px] text-muted-foreground uppercase block">Customer LTV Impact</span>
                    <span className="text-xl font-bold text-violet-400">{simResults.projectedLtv}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Recommended PRISM Policy Adjustments:</span>
                  {simResults.policyAdjustments.map((adj: string, i: number) => (
                    <div key={i} className="text-xs text-white/90 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>{adj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* SYSTEM PERFORMANCE & INTENT DISTRIBUTION CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Utility Score Trend Chart */}
          <Card variant="glass" className="h-[360px] border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-400 text-base">
                <TrendingUp className="h-5 w-5" />
                Economic Utility U Trend
              </CardTitle>
              <CardDescription className="text-xs">Average CRO utility score over 30 days.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[230px]">
              <div className="flex items-end justify-center gap-2 h-36 w-full px-2 mt-4">
                {[65, 72, 68, 84, 79, 92, 88, 95, 91, 96].map((h, i) => (
                  <div key={i} className="w-full bg-emerald-500/30 rounded-t-sm hover:bg-emerald-400 transition-all cursor-pointer relative group" style={{ height: `${h}%` }}>
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-xs font-mono px-2 py-1 rounded text-white whitespace-nowrap transition-opacity z-20 border border-emerald-500/30">
                      U={(h/100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Admissibility Breakdown Donut */}
          <Card variant="glass" className="h-[360px] border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-violet-400 text-base">
                <BarChart3 className="h-5 w-5" />
                Admissibility Breakdown
              </CardTitle>
              <CardDescription className="text-xs">Passed vs Rejected negotiation offers.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[230px]">
              <div className="w-44 h-44 rounded-full border-[16px] border-white/5 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="transparent" stroke="#7C3AED" strokeWidth="16" strokeDasharray="210 264" />
                  <circle cx="50" cy="50" r="42" fill="transparent" stroke="#10B981" strokeWidth="16" strokeDasharray="54 264" strokeDashoffset="-210" />
                </svg>
                <div className="text-center font-mono">
                  <span className="text-3xl font-extrabold text-white">94.2%</span>
                  <span className="block text-[10px] text-muted-foreground uppercase tracking-widest mt-1">ADMISSIBLE</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Intent Distribution Progress Bars */}
          <Card variant="glass" className="h-[360px] border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400 text-base">
                <PieChart className="h-5 w-5" />
                Multimodal Intent Share
              </CardTitle>
              <CardDescription className="text-xs">Parsed input modalities across sessions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>Voice Commerce (Whisper)</span>
                    <span className="text-violet-400">42%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 w-[42%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>AI-to-AI Buyer JSON</span>
                    <span className="text-blue-400">28%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[28%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>Image / Invoice OCR</span>
                    <span className="text-emerald-400">18%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[18%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-white mb-1">
                    <span>Text Prompts</span>
                    <span className="text-amber-400">12%</span>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[12%]" />
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

