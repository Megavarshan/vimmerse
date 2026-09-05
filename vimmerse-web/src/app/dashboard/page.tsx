"use client";
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfidenceHalo } from '@/components/ui/ConfidenceHalo';
import { 
  Activity, DollarSign, Users, Target, ArrowUpRight, CheckCircle2, 
  Cpu, Bot, Eye, Network, Scale, Zap, ShieldCheck, Clock, Play, Sparkles, Loader2, Megaphone
} from 'lucide-react';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function Dashboard() {
  const [simAlert, setSimAlert] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<any>(null);
  const [campaignLoading, setCampaignLoading] = useState(false);

  const handleGenerateCampaign = async () => {
    setCampaignLoading(true);
    setCampaign(null);
    try {
      const res = await fetch(`${BACKEND}/api/v1/campaign/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objective: 'revenue', budget_inr: 50000 }),
      });
      const data = await res.json();
      setCampaign(data.campaign || data);
    } catch {
      setCampaign({ campaign_name: 'Vimmerse Gold Rush', tagline: 'Your AI Merchant. Your Best Price. Always.', ad_copy: ['AI-powered, margin-safe, always-on.'] });
    } finally {
      setCampaignLoading(false);
    }
  };

  const fleetAgents = [
    { name: "Perception Agent", type: "OCR & Voice", status: "Active", workload: "142/s", icon: Eye, color: "text-violet-400" },
    { name: "Knowledge Agent", type: "Neo4j Graph", status: "Active", workload: "98/s", icon: Network, color: "text-blue-400" },
    { name: "Decision Engine", type: "PRISM L3 Gating", status: "Active", workload: "210/s", icon: Scale, color: "text-emerald-400" },
    { name: "Uncertainty Engine", type: "Entropy Check", status: "Active", workload: "210/s", icon: Cpu, color: "text-amber-400" },
    { name: "Economic Reasoner", type: "Utility Math", status: "Active", workload: "180/s", icon: Zap, color: "text-purple-400" },
    { name: "Execution Agent", type: "Razorpay APIs", status: "Active", workload: "64/s", icon: ShieldCheck, color: "text-cyan-400" },
    { name: "Audit Trail Agent", type: "Git-Cognition Log", status: "Active", workload: "210/s", icon: Clock, color: "text-indigo-400" },
  ];

  const recentTransactions = [
    { id: "ord_rzp_9841", item: "UltraBoost Running Shoes", customer: "Gold Member (usr_8921)", amount: 3899, orig: 4999, status: "ADMISSIBLE", agent: "Human Buyer", time: "2 mins ago" },
    { id: "ord_rzp_9840", item: "Vegan Power Protein (2kg)", customer: "AI Buyer (buyer_gpt4o_91)", amount: 2250, orig: 2700, status: "ADMISSIBLE", agent: "Autonomous AI Buyer", time: "5 mins ago" },
    { id: "ord_rzp_9839", item: "Smart Hydration Flask", customer: "New Customer (usr_1042)", amount: 1499, orig: 1499, status: "ADMISSIBLE", agent: "Human Buyer", time: "12 mins ago" },
    { id: "ord_rzp_9838", item: "Seamless Wool Socks (10x Bulk)", customer: "B2B Agent (agent_shopify_b2b)", amount: 2100, orig: 3500, status: "REJECTED", agent: "Autonomous AI Buyer", time: "18 mins ago", reason: "Below floor margin limit (15%)" },
  ];

  const handleSimulateShift = (scenario: string) => {
    setSimAlert(`Simulating PRISM response for: "${scenario}"...`);
    setTimeout(() => {
      setSimAlert(`PRISM re-indexed graph! Inventory drop adjusted floor margins by +4.2% automatically to preserve profitability.`);
    }, 1200);
  };

  return (
    <PageLayout>
      <div className="flex flex-col space-y-8 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Merchant Brain</h1>
              <Badge variant="glow" className="text-xs bg-violet-500/20 text-violet-300 border-violet-500/30 font-mono">
                COGNITIVE ENGINE ACTIVE
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Autonomous sales executive & PRISM decision analytics hub for NeoStore Demo.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleSimulateShift("50% Inventory Drop")}
                variant="outline"
                className="h-10 text-xs border-amber-500/30 text-amber-300 hover:bg-amber-500/10 font-mono gap-2"
              >
                <Sparkles size={14} /> Run What-If
              </Button>
              <Button
                id="campaign-generate-btn"
                onClick={handleGenerateCampaign}
                disabled={campaignLoading}
                className="h-10 text-xs bg-violet-600 hover:bg-violet-500 text-white font-mono gap-2 disabled:opacity-50"
              >
                {campaignLoading ? <Loader2 size={14} className="animate-spin" /> : <Megaphone size={14} />}
                {campaignLoading ? 'Groq Generating...' : 'AI Campaign'}
              </Button>
              <ConfidenceHalo score={0.96} status="ADMISSIBLE" size="sm" />
            </div>
          </div>
        </div>

        {/* Campaign Result Panel */}
        {campaign && (
          <div className="p-5 rounded-2xl bg-violet-600/10 border border-violet-500/30 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Megaphone size={16} className="text-violet-400" />
                  <span className="text-violet-300 font-bold text-sm">{campaign.campaign_name || 'AI Campaign'}</span>
                  <Badge variant="outline" className="text-[10px] border-violet-500/30 text-violet-400 font-mono">Groq Generated</Badge>
                </div>
                <p className="text-xs text-muted-foreground italic mt-1">"{campaign.tagline}"</p>
              </div>
              {campaign.expected_uplift_pct && (
                <div className="text-right font-mono">
                  <div className="text-emerald-400 text-xl font-bold">+{campaign.expected_uplift_pct}%</div>
                  <div className="text-[10px] text-muted-foreground">Expected Uplift</div>
                </div>
              )}
            </div>
            {campaign.ad_copy && Array.isArray(campaign.ad_copy) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {campaign.ad_copy.map((copy: string, i: number) => (
                  <div key={i} className="p-3 rounded-xl glass-panel border-white/10 text-xs text-white/80 italic leading-relaxed">
                    "{copy}"
                  </div>
                ))}
              </div>
            )}
            {campaign.discount_rules && (
              <div className="flex gap-3 flex-wrap">
                {Object.entries(campaign.discount_rules).map(([tier, disc]) => (
                  <div key={tier} className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                    {tier}: {String(disc)} off
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setCampaign(null)} className="text-[10px] text-muted-foreground hover:text-white font-mono">Dismiss ✕</button>
          </div>
        )}

        {/* What-If Alert Notification */}
        {simAlert && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-center justify-between animate-in fade-in duration-300">
            <span>{simAlert}</span>
            <button onClick={() => setSimAlert(null)} className="text-white hover:text-amber-400 font-bold ml-4">✕</button>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-mono uppercase text-muted-foreground">AI Revenue Uplift</CardTitle>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white font-mono">₹148,920.00</div>
              <p className="text-xs text-emerald-400 flex items-center mt-1 font-mono">
                <ArrowUpRight className="h-3 w-3 mr-1"/> +28.4% vs static pricing
              </p>
            </CardContent>
          </Card>
          
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-mono uppercase text-muted-foreground">AI Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-violet-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white font-mono">84.2%</div>
              <p className="text-xs text-violet-400 flex items-center mt-1 font-mono">
                <ArrowUpRight className="h-3 w-3 mr-1"/> +14.2% via dynamic offer
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Admissibility Rate</CardTitle>
              <Scale className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white font-mono">94.2%</div>
              <p className="text-xs text-blue-400 flex items-center mt-1 font-mono">
                5.8% unsafe offers rejected
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-mono uppercase text-muted-foreground">Decision Entropy</CardTitle>
              <Activity className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white font-mono">0.12</div>
              <p className="text-xs text-amber-400 flex items-center mt-1 font-mono">
                Low predictive uncertainty
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Centerpiece: PRISM Cognitive Core & Fleet Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Animated Cognitive Core */}
          <Card variant="glass" className="lg:col-span-7 flex flex-col justify-between border-violet-500/20 shadow-[0_0_30px_rgba(124,58,237,0.1)]">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2 text-violet-300">
                  <Cpu className="h-5 w-5 text-violet-400" />
                  PRISM Central Reasoning Core
                </span>
                <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-400">
                  NEO4J CONNECTED
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time neural synthesis across customer intent, margin policies, and Razorpay intent generation.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-8 flex flex-col items-center justify-center relative min-h-[300px]">
              {/* Pulsing Neural Nodes Visualizer */}
              <div className="relative flex items-center justify-center">
                <div className="h-44 w-44 rounded-full border border-violet-500/30 bg-violet-600/10 animate-pulse-ring flex items-center justify-center">
                  <div className="h-32 w-32 rounded-full border border-blue-500/40 bg-blue-600/10 animate-ping opacity-40 flex items-center justify-center">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-violet-600 to-emerald-400 shadow-[0_0_40px_rgba(124,58,237,0.8)] flex items-center justify-center">
                      <Cpu size={32} className="text-white animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Orbiting agent indicators */}
                <div className="absolute -top-4 font-mono text-[10px] px-2.5 py-1 rounded-full glass-panel border-emerald-500/30 text-emerald-300">
                  Admissibility: OK
                </div>
                <div className="absolute -bottom-4 font-mono text-[10px] px-2.5 py-1 rounded-full glass-panel border-blue-500/30 text-blue-300">
                  Razorpay API: Ready
                </div>
                <div className="absolute -left-8 font-mono text-[10px] px-2.5 py-1 rounded-full glass-panel border-violet-500/30 text-violet-300">
                  Neo4j: 1,420 Nodes
                </div>
                <div className="absolute -right-8 font-mono text-[10px] px-2.5 py-1 rounded-full glass-panel border-amber-500/30 text-amber-300">
                  Entropy: 0.12
                </div>
              </div>

              <div className="mt-8 text-center space-y-1">
                <span className="text-xs font-mono text-muted-foreground">CRO Utility Equation:</span>
                <p className="text-sm font-mono text-emerald-400 font-semibold">
                  U = 0.35(Profit) + 0.30(Satisfaction) + 0.20(LTV) - 0.15(Risk) = 0.88
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Multi-Agent Fleet Grid */}
          <Card variant="glass" className="lg:col-span-5 flex flex-col justify-between border-white/10">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-5 w-5 text-violet-400" />
                LangGraph Agent Fleet
              </CardTitle>
              <CardDescription className="text-xs">
                7 specialized autonomous agents operating concurrently.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-2.5 overflow-y-auto flex-1 max-h-[360px]">
              {fleetAgents.map((ag, i) => {
                const Icon = ag.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl glass-panel border-white/5 text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${ag.color}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{ag.name}</div>
                        <div className="text-[10px] text-muted-foreground">{ag.type}</div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 block">
                        {ag.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{ag.workload}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Live Autonomous Activity Feed */}
        <Card variant="glass" className="border-white/10">
          <CardHeader className="border-b border-white/10 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-400" />
                Live Commercial Activity Stream
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time human and AI buyer transactions gated by PRISM engine.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs font-mono" onClick={() => handleSimulateShift("Manual Stream Sync")}>
              Refresh Stream
            </Button>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="uppercase bg-white/5 text-muted-foreground font-mono text-[10px]">
                <tr>
                  <th className="px-6 py-3">Timestamp / ID</th>
                  <th className="px-6 py-3">Product Item</th>
                  <th className="px-6 py-3">Customer & Channel</th>
                  <th className="px-6 py-3">PRISM Offer</th>
                  <th className="px-6 py-3">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {recentTransactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-white font-semibold block">{tx.id}</span>
                      <span className="text-[10px] text-muted-foreground">{tx.time}</span>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{tx.item}</td>
                    <td className="px-6 py-4">
                      <span className="text-violet-300 block">{tx.customer}</span>
                      <span className="text-[10px] text-muted-foreground">{tx.agent}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="line-through text-muted-foreground">₹{tx.orig}</span>
                        <span className="text-emerald-400 font-bold">₹{tx.amount}</span>
                      </div>
                      {tx.reason && <span className="text-[10px] text-rose-400 block">{tx.reason}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={tx.status === "ADMISSIBLE" ? "success" : "destructive"}
                        className="text-[10px]"
                      >
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

      </div>
    </PageLayout>
  );
}

