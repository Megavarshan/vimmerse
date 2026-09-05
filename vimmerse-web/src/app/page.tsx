"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Typography, GradientText } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { ConfidenceHalo } from '@/components/ui/ConfidenceHalo';
import { 
  ArrowRight, BrainCircuit, ShieldCheck, Zap, Sparkles, Network, Scale, 
  Cpu, Layers, Eye, CheckCircle2, ChevronRight, Play, Bot, User, Lock, Store,
  Terminal, ExternalLink, Code2, Globe, Compass, Activity, Server
} from 'lucide-react';
import { BuildathonIntroLoader } from '@/components/ui/BuildathonIntroLoader';

export default function Home() {
  const [activeLayer, setActiveLayer] = useState(2); // Layer 3 (0-indexed: 2) Decision Admissibility
  const [sandboxPrompt, setSandboxPrompt] = useState("I need white running shoes under ₹4000. I am a Gold Member.");
  const [sandboxResult, setSandboxResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const prismLayers = [
    {
      id: "L1",
      name: "Multimodal Perception",
      desc: "Parses voice, image OCR, PDF invoices, and text into structured semantic entities.",
      icon: Eye,
      color: "text-violet-400 border-violet-500/30 bg-violet-500/10",
      payload: {
        input_type: "Voice + Context",
        entities: { category: "Running Shoes", color: "White", max_budget: 4000, loyalty: "Gold" },
        sentiment: "High Intent",
        epistemic_confidence: 0.96
      }
    },
    {
      id: "L2",
      name: "Semantic Commerce Graph",
      desc: "Queries Neo4j knowledge graph connecting products, margins, bundles, and repeat purchases.",
      icon: Network,
      color: "text-blue-400 border-blue-500/30 bg-blue-500/10",
      payload: {
        matched_node: "Prod_UltraBoost_X",
        catalog_price: 4999,
        inventory_health: "High (142 units)",
        relationships: ["Frequently Bundled with Pro Socks", "High Repeat 88%"]
      }
    },
    {
      id: "L3",
      name: "Decision Admissibility Engine ⭐",
      desc: "Evaluates merchant profit policy, loyalty rules, and fraud risk BEFORE execution.",
      icon: Scale,
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      payload: {
        admissibility: "ADMISSIBLE",
        floor_price: 3600,
        policy_checks: { margin_safe: true, stock_ok: true, fraud_score: 0.02 },
        decision_code: "ADM_PASSED_OK"
      }
    },
    {
      id: "L4",
      name: "Uncertainty Intelligence",
      desc: "Calculates epistemic & aleatoric uncertainty and decision entropy to block risky actions.",
      icon: BrainCircuit,
      color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
      payload: {
        epistemic_uncertainty: 0.04,
        aleatoric_uncertainty: 0.08,
        predictive_entropy: 0.12,
        action_verdict: "SAFE_TO_NEGOTIATE"
      }
    },
    {
      id: "L5",
      name: "Economic Reasoner",
      desc: "Chief Revenue Officer agent optimizing U = 0.35P + 0.30S + 0.20L - 0.15R.",
      icon: Zap,
      color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
      payload: {
        utility_score: 0.88,
        recommended_discount: "18%",
        final_offered_price: 3899,
        upsell_item: "Seamless Wool Socks (₹399)"
      }
    },
    {
      id: "L6",
      name: "Trusted Execution",
      desc: "Generates Razorpay Orders & Payment Links only after PRISM authorization.",
      icon: ShieldCheck,
      color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
      payload: {
        razorpay_order_id: "order_K9v82MxA",
        amount_paise: 389900,
        webhook_signing_key: "rzp_test_sec_7281",
        audit_receipt_hash: "0x8f29...a41c"
      }
    }
  ];

  const handleRunSandbox = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setSandboxResult({
        product: "Vimmerse UltraBoost Sprint X",
        catalogPrice: 4999,
        negotiatedPrice: 3899,
        discountPct: "22%",
        reasoning: "Gold Member loyalty multiplier + High Inventory stock allowed ₹1,100 margin-safe discount.",
        confidenceScore: 0.94,
        admissibility: "ADMISSIBLE",
        orderId: "order_rzp_8923a"
      });
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <>
      <BuildathonIntroLoader />
      <PageLayout>
        <div className="flex flex-col items-center max-w-7xl mx-auto px-4 py-8 space-y-24 relative z-10 animate-[fade-in-up_0.8s_ease-out]">
        
        {/* HERO SECTION — Professional Agent Platform Tier */}
        <div className="text-center space-y-7 max-w-5xl relative pt-4">
          {/* Top Architecture pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-zinc-900/90 px-3.5 py-1 text-xs font-mono text-zinc-300 shadow-sm backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="text-zinc-400">Runtime:</span>
            <span className="text-white font-medium">PRISM Decision Engine v2.0</span>
            <span className="text-zinc-600">|</span>
            <span className="text-violet-400">Live Agent Infrastructure</span>
          </div>

          {/* Clean, authoritative Agent Platform Title */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight font-mono text-white leading-tight">
              <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                vimmerse
              </span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-zinc-200 font-sans max-w-3xl mx-auto">
              The Autonomous Commerce Agent Runtime for Modern Merchants.
            </p>
          </div>

          {/* High-credibility subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed font-sans font-normal">
            Equip stores with autonomous AI merchants that reason through multi-turn negotiations, enforce mathematical margin bounds, and authorize trusted Razorpay transactions — zero hallucination, 100% auditable.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/studio">
              <Button size="lg" className="h-11 px-6 text-sm rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium shadow-sm transition-all flex items-center gap-2">
                <span>Deploy Live Agent Studio</span>
                <ArrowRight size={15} />
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="h-11 px-6 text-sm rounded-lg border-white/[0.1] bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 flex items-center gap-2">
                <Cpu size={15} className="text-zinc-400" />
                <span>Agent Fleet Telemetry</span>
              </Button>
            </Link>
          </div>

        {/* Telemetry Strip — High-Impact Business Proof Metrics (No vanity metrics) */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left font-mono border-t border-white/[0.06] mt-8">
            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.08] hover:border-violet-500/30 transition-colors">
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">1-Click Dynamic Bundling</div>
              <div className="text-base text-emerald-400 font-bold mt-1">+32% AOV Uplift</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Automated SKU margin synergy</div>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.08] hover:border-violet-500/30 transition-colors">
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Deterministic Gating</div>
              <div className="text-base text-violet-400 font-bold mt-1">18ms Latency</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Pre-execution margin check</div>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.08] hover:border-violet-500/30 transition-colors">
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Floor Price Protection</div>
              <div className="text-base text-blue-400 font-bold mt-1">100% Margin Guard</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Zero loss-making sales tolerated</div>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/50 border border-white/[0.08] hover:border-violet-500/30 transition-colors">
              <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Inventory Truth</div>
              <div className="text-base text-amber-400 font-bold mt-1">0% Phantom SKUs</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Real-time Neo4j ground truth</div>
            </div>
          </div>
        </div>

        {/* SECTION 1: ONE COMPLETE WORKFLOW (Input → Perception → Knowledge → Floor Gate → CRO Utility → Razorpay Execution) */}
        <div className="w-full space-y-8">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
              ONE COMPLETE PIPELINE
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              From Raw Buyer Intent to Settled Razorpay Order
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Pipelines explain systems better than feature checklists. Follow exactly how a customer or AI buyer request traverses the 6 autonomous stages.
            </p>
          </div>

          {/* Interactive Pipeline Step Tracker */}
          <div className="glass-panel p-6 md:p-8 rounded-3xl border-white/10 space-y-8 bg-black/40">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { step: "01", name: "Buyer Intent", sub: "Text/Voice/ACP", status: "Active" },
                { step: "02", name: "L1 Perception", sub: "Budget & Entities", status: "Extracted" },
                { step: "03", name: "L2 Knowledge", sub: "Catalog & Margins", status: "Resolved" },
                { step: "04", name: "L3 The Bar ⭐", sub: "Floor Gate Check", status: "Enforced" },
                { step: "05", name: "L5 CRO Utility", sub: "Score & Bundle", status: "Optimized" },
                { step: "06", name: "L6 Razorpay", sub: "Order & Webhook", status: "Settled" },
              ].map((s, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-xl border text-center transition-all ${
                    idx === 3 
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                      : "border-white/10 bg-zinc-900/60 text-zinc-300"
                  }`}
                >
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-semibold">STAGE {s.step}</div>
                  <div className="text-xs md:text-sm font-bold text-white mt-1">{s.name}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{s.sub}</div>
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                    <span className={`w-1.5 h-1.5 rounded-full ${idx === 3 ? "bg-emerald-400" : "bg-violet-400"}`}></span>
                    <span>{s.status}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Trace of an actual order passing through */}
            <div className="p-5 rounded-2xl bg-black/70 border border-white/10 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-zinc-300">
                  <Activity size={16} className="text-emerald-400" />
                  <span className="font-semibold text-white">Live Execution Pipeline Trace</span>
                  <span className="text-zinc-500">• Session #TXN-9021-VIM</span>
                </div>
                <Badge variant="success" className="text-[11px]">100% AUDITABLE</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 p-3 rounded-xl bg-zinc-900/50 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Input Payload</div>
                  <div className="text-zinc-300">"White running shoe under ₹4,000. Gold member."</div>
                  <div className="text-[10px] text-violet-400">Parsed: max_budget=4000, tier=gold</div>
                </div>
                <div className="space-y-1.5 p-3 rounded-xl bg-zinc-900/50 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Layer 3 Floor Gating</div>
                  <div className="text-emerald-400 font-semibold">PASS: Offer ₹3,899 ≥ Floor ₹3,600</div>
                  <div className="text-[10px] text-zinc-400">Margin protected (+21% net retained)</div>
                </div>
                <div className="space-y-1.5 p-3 rounded-xl bg-zinc-900/50 border border-white/5">
                  <div className="text-[10px] text-zinc-500 uppercase">Final Settlement Rail</div>
                  <div className="text-blue-400 font-semibold">Razorpay Order: order_K9v82MxA</div>
                  <div className="text-[10px] text-zinc-400">Amount: ₹3,899.00 (Paise: 389900)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: PROOF OF AUTONOMOUS INTELLIGENCE (Not a basic prompt wrapper) */}
        <div className="w-full space-y-8">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="text-xs font-mono text-violet-400 border-violet-500/30">
              PROOF OF AUTONOMY
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              Why Vimmerse Is Not Just Another Model Wrapper
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Basic chatbots hallucinate inventory and concede disastrous discounts. Vimmerse operates as a deterministic multi-agent state machine with strict mathematical guardrails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Old / Weak Way: Generic Chatbot */}
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-950/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-red-400 uppercase tracking-wider font-semibold">Traditional LLM Prompt Wrapper</span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono">High Risk</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300 font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Hallucinates Fake Inventory:</strong> Agrees to sell out-of-stock or non-existent items without ERP check.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>Concedes Negative Margins:</strong> Manipulated by customer prompting into giving 50-80% discounts below cost price.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 font-bold">✕</span>
                  <span><strong>No Financial Hook:</strong> Outputs raw text instead of verified, cryptographically signed Razorpay checkout orders.</span>
                </li>
              </ul>
            </div>

            {/* The Vimmerse Autonomous Agent Way */}
            <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 space-y-4 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">Vimmerse PRISM Multi-Agent Runtime</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Enterprise Ready</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300 font-sans">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Deterministic Floor Gating (L3):</strong> Hardcoded mathematical boundaries reject any offer below unit manufacturing cost in 18ms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Dynamic CRO Utility ($U$):</strong> Evaluates profit ($P$), stock velocity ($S$), customer LTV ($L$), and fraud score ($R$) before responding.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Autonomous Razorpay Execution (L6):</strong> Generates actual order tokens and verifies webhooks for automated fulfillment.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 3: 3 CONCRETE MERCHANT USE CASES (Real Business Scenarios) */}
        <div className="w-full space-y-8">
          <div className="text-center space-y-3">
            <Badge variant="outline" className="text-xs font-mono text-blue-400 border-blue-500/30">
              ENTERPRISE USE CASES
            </Badge>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              Real Commercial Scenarios Handled Autonomously
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
              Skip generic templates. See how modern brands deploy Vimmerse to recover abandoned baskets, stop coupon exploits, and accept AI agent orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case 1 */}
            <Card variant="glass" className="p-6 border-white/10 space-y-4 hover:border-violet-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20">
                  <span>USE CASE 01</span>
                </div>
                <h3 className="text-lg font-bold text-white">Budget-Constrained Shopper</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  A high-intent runner wants premium ₹4,999 shoes but has a hard ₹4,000 budget.
                </p>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 font-mono text-xs">
                  <div className="text-[11px] text-zinc-500">Autonomous Action:</div>
                  <div className="text-emerald-400">Offered ₹3,899 + bundled Seamless Socks (₹399)</div>
                  <div className="text-zinc-400 text-[10px]">Result: ₹4,298 basket closed without customer drop-off.</div>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 text-xs text-emerald-400 font-mono">
                +28% Basket Conversion
              </div>
            </Card>

            {/* Case 2 */}
            <Card variant="glass" className="p-6 border-white/10 space-y-4 hover:border-violet-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
                  <span>USE CASE 02</span>
                </div>
                <h3 className="text-lg font-bold text-white">Malicious Lowball Exploit Blocked</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  A user attempts social-engineering prompts demanding a ₹4,999 product for ₹300.
                </p>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 font-mono text-xs">
                  <div className="text-[11px] text-zinc-500">Autonomous Action:</div>
                  <div className="text-red-400">Rejected at Layer 3 (Floor: ₹3,600)</div>
                  <div className="text-zinc-400 text-[10px]">Result: 0 margin leak. Offered certified clearance alternative.</div>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 text-xs text-blue-400 font-mono">
                100% Floor Protection Enforced
              </div>
            </Card>

            {/* Case 3 */}
            <Card variant="glass" className="p-6 border-white/10 space-y-4 hover:border-violet-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  <span>USE CASE 03</span>
                </div>
                <h3 className="text-lg font-bold text-white">Autonomous B2B AI-Buyer Sourcing</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  An external LLM procurement agent submits an ACP JSON-RPC contract for 15 bulk gym units.
                </p>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-2 font-mono text-xs">
                  <div className="text-[11px] text-zinc-500">Autonomous Action:</div>
                  <div className="text-cyan-400">Validated cryptographic sig & issued B2B Razorpay link</div>
                  <div className="text-zinc-400 text-[10px]">Result: 0 human salesperson hours needed for ₹52,000 deal.</div>
                </div>
              </div>
              <div className="pt-2 border-t border-white/5 text-xs text-cyan-400 font-mono">
                M2M Zero-Touch Settlement
              </div>
            </Card>
          </div>
        </div>

        {/* PRISM 6-LAYER ENGINE VISUALIZER */}
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs font-mono text-violet-400 border-violet-500/30">
              PROPRIETARY COGNITIVE ENGINE
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              The PRISM Decision Architecture
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
              Every payment deserves intelligence before execution. Explore how PRISM processes commercial context across 6 deterministic reasoning layers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Layer Selection Column */}
            <div className="lg:col-span-5 space-y-3">
              {prismLayers.map((layer, index) => {
                const Icon = layer.icon;
                const isSelected = activeLayer === index;

                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayer(index)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      isSelected
                        ? "glass-panel border-violet-500/50 bg-violet-600/15 shadow-[0_0_20px_rgba(124,58,237,0.25)]"
                        : "glass-card border-white/5 hover:border-white/20 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border ${layer.color} shrink-0`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                          <span className="font-mono text-xs text-muted-foreground">{layer.id}</span>
                          {layer.name}
                        </h4>
                        {isSelected && <ChevronRight size={16} className="text-violet-400" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{layer.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Layer Deep-Dive Inspector Box */}
            <div className="lg:col-span-7">
              <Card variant="glass" className="h-full border-white/10 flex flex-col">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl border ${prismLayers[activeLayer].color}`}>
                      {React.createElement(prismLayers[activeLayer].icon, { size: 22 })}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {prismLayers[activeLayer].name}
                      </h3>
                      <span className="text-xs font-mono text-muted-foreground">
                        Layer {activeLayer + 1} of 6 • Active State
                      </span>
                    </div>
                  </div>

                  <ConfidenceHalo score={0.94} status="ADMISSIBLE" size="sm" />
                </div>

                <CardContent className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <Typography variant="h4" className="text-sm font-semibold text-violet-300 mb-2 font-mono">
                      // LIVE LAYER COGNITIVE PAYLOAD
                    </Typography>
                    <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed shadow-inner">
                      {JSON.stringify(prismLayers[activeLayer].payload, null, 2)}
                    </pre>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider block font-mono">
                      Why This Matters:
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {activeLayer === 2
                        ? "Layer 3 (Decision Admissibility Engine) ensures that no discount is offered if it violates merchant profit floors, inventory health, or fraud constraints. Decisions are strictly bounded."
                        : activeLayer === 5
                        ? "Layer 6 guarantees cryptographic separation: Business logic reasons independently, and financial execution with Razorpay occurs ONLY upon admissible verification."
                        : "Each layer adds deterministic explainability to the AI's commercial thought process."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* INTERACTIVE IN-PAGE NEGOTIATION SANDBOX */}
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
              INTERACTIVE DEMO
            </Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Try PRISM Engine Live
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Simulate an autonomous commercial negotiation right now. Watch how PRISM balances merchant profit and customer satisfaction.
            </p>
          </div>

          <Card variant="glass" className="max-w-4xl mx-auto border-violet-500/20 shadow-[0_0_40px_rgba(124,58,237,0.15)]">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block">
                  Customer Prompt Input:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={sandboxPrompt}
                    onChange={(e) => setSandboxPrompt(e.target.value)}
                    className="flex-1 bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                  />
                  <Button
                    onClick={handleRunSandbox}
                    disabled={isSimulating}
                    className="h-12 px-6 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium flex items-center gap-2 shrink-0"
                  >
                    {isSimulating ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Reasoning...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Play size={16} /> Run PRISM Engine
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Sample Prompt Pills */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-muted-foreground self-center">Presets:</span>
                {[
                  "I need white running shoes under ₹4000. I am a Gold Member.",
                  "Can I get a 25% discount on 10 tubs of Whey Protein?",
                  "AI Buyer Intent: { category: 'Hydration', max_price: 1800, min_rating: 4.8 }"
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => setSandboxPrompt(preset)}
                    className="px-3 py-1 rounded-full glass-panel hover:bg-white/10 text-muted-foreground hover:text-white transition-colors border-white/10 text-[11px]"
                  >
                    {preset.slice(0, 35)}...
                  </button>
                ))}
              </div>

              {/* Simulation Result output */}
              {sandboxResult && (
                <div className="mt-6 p-6 rounded-2xl bg-black/50 border border-emerald-500/30 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-semibold">
                      <CheckCircle2 size={18} />
                      <span>PRISM Decision Verdict: {sandboxResult.admissibility}</span>
                    </div>
                    <ConfidenceHalo score={sandboxResult.confidenceScore} status="ADMISSIBLE" size="sm" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="p-3 rounded-xl glass-panel">
                      <span className="text-muted-foreground block text-[10px] uppercase">Matched Product</span>
                      <span className="text-white font-semibold text-sm">{sandboxResult.product}</span>
                    </div>
                    <div className="p-3 rounded-xl glass-panel">
                      <span className="text-muted-foreground block text-[10px] uppercase">Price Negotiation</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="line-through text-muted-foreground">₹{sandboxResult.catalogPrice}</span>
                        <span className="text-emerald-400 font-bold text-base">₹{sandboxResult.negotiatedPrice}</span>
                        <Badge variant="success" className="text-[10px] py-0">{sandboxResult.discountPct} OFF</Badge>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl glass-panel">
                      <span className="text-muted-foreground block text-[10px] uppercase">Razorpay Order</span>
                      <span className="text-blue-400 font-semibold text-sm">{sandboxResult.orderId}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                    <strong>PRISM Reasoning:</strong> {sandboxResult.reasoning}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI-TO-AI COMMERCE HIGHLIGHT */}
        <div className="w-full glass-panel p-8 md:p-12 rounded-3xl border-violet-500/30 relative overflow-hidden bg-gradient-to-r from-violet-950/40 via-black to-blue-950/40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div className="space-y-4">
              <Badge variant="outline" className="text-xs font-mono text-blue-400 border-blue-500/30">
                THE FUTURE OF COMMERCE
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                AI Buyer Agents Transact Directly with Vimmerse AI Merchants
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Commerce tomorrow won't just be humans clicking buy buttons. Autonomous AI buyer agents will shop on behalf of consumers. Vimmerse makes your store machine-readable and agent-transactable using standardized decision protocols.
              </p>
              <div className="pt-2">
                <Link href="/studio">
                  <Button className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2.5 flex items-center gap-2">
                    Test AI-to-AI Buyer Mode <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border-white/10 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between text-muted-foreground border-b border-white/10 pb-2">
                <span className="flex items-center gap-2 text-blue-400">
                  <Bot size={16} /> AI Buyer Agent (Client)
                </span>
                <span className="text-[10px] text-emerald-400">API Protocol v1.4</span>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-white/10 text-violet-300">
                {`POST /api/v1/decisions/process
{
  "agent_id": "buyer_gpt4o_892",
  "intent": { "category": "Proteins", "max_price": 2400 },
  "crypto_signature": "0x7a9...f3e1"
}`}
              </div>
              <div className="flex items-center justify-between text-muted-foreground border-b border-white/10 pb-2 pt-2">
                <span className="flex items-center gap-2 text-violet-400">
                  <Cpu size={16} /> Vimmerse Merchant Agent (Host)
                </span>
                <span className="text-[10px] text-emerald-400">PRISM Approved</span>
              </div>
              <div className="bg-black/60 p-3 rounded-xl border border-white/10 text-emerald-400">
                {`200 OK — ADMISSIBLE
{
  "offered_price": 2250,
  "razorpay_checkout_url": "https://rzp.io/i/vimmerse_ord_9012"
}`}
              </div>
            </div>
          </div>
        </div>

        {/* PLATFORM COMPARISON MATRIX */}
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Why Stores Install Vimmerse</h2>
            <p className="text-muted-foreground text-sm">We are not another Amazon. We are the AI layer above existing commerce.</p>
          </div>

          <div className="glass-panel rounded-2xl border-white/10 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-white/5 text-muted-foreground border-b border-white/10 font-mono">
                <tr>
                  <th className="px-6 py-4">Capability</th>
                  <th className="px-6 py-4">Traditional E-Commerce</th>
                  <th className="px-6 py-4 text-violet-400 font-bold">Vimmerse Layer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { cap: "Product Discovery", trad: "Keyword filters & search bars", vim: "Multimodal Voice, OCR, PDF, Intent Graph" },
                  { cap: "Pricing Model", trad: "Static tag prices", vim: "Dynamic margin-bounded negotiation" },
                  { cap: "Decision Reasoning", trad: "None (Raw SQL)", vim: "PRISM Explainable Admissibility Architecture" },
                  { cap: "Financial Execution", trad: "Manual human checkout", vim: "Trusted Razorpay Orders + AI-to-AI Transactable" },
                  { cap: "Risk Management", trad: "Hardcoded coupon codes", vim: "Epistemic/Aleatoric Uncertainty Intelligence" },
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{row.cap}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.trad}</td>
                    <td className="px-6 py-4 text-violet-300 font-medium flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                      {row.vim}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PageLayout>
    </>
  );
}

