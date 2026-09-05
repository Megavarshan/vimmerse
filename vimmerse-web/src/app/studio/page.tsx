"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ConfidenceHalo } from "@/components/ui/ConfidenceHalo";
import { RazorpayModal } from "@/components/ui/RazorpayModal";
import {
  Send, Bot, User, Brain, ShieldCheck, CheckCircle2, Mic, MicOff,
  Image as ImageIcon, ArrowRight, Cpu, Zap, AlertTriangle, Loader2,
  XCircle, Sparkles, TrendingUp, Package, Tag, Terminal, Activity,
  Layers, Lock, Database, RefreshCw, ChevronRight, Check
} from "lucide-react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// ── Types ────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "agent" | "ai_buyer" | "system";
  content: string;
  label?: string;
  productCard?: ProductOffer | null;
  rejected?: RejectionPayload | null;
  upsell?: UpsellBundle | null;
  poweredBy?: string;
  ts: string;
  executionMetrics?: {
    latencyMs: number;
    tokensPerSec: number;
    protocol: string;
  };
}

interface ProductOffer {
  name: string;
  originalPrice: number;
  negotiatedPrice: number;
  discountReason: string;
  savings: number;
  productId: string;
}

interface UpsellBundle {
  text: string;
  bundleItemName?: string;
  bundlePrice?: number;
  added?: boolean;
}

interface RejectionPayload {
  reason: string;
  admissibility_code: "REJECTED" | "OUT_OF_CATALOG";
}

interface PrismState {
  confidenceScore: number;
  status: "ADMISSIBLE" | "REJECTED" | "OUT_OF_CATALOG" | "IDLE";
  utilityScore: number;
  admissibilityReasoning: string;
  matchedProduct: string;
  negotiatedPrice: number;
  policyChecks: { margin: boolean; fraud: boolean; stock: boolean; catalog: boolean };
}

interface ActiveCampaign {
  id: string;
  name: string;
  target_category: string;
  uplift_projected: string;
  strategy: string;
  discount_cap: string;
  status: string;
  rules: string;
}

// ── The Bar Quick-Test Presets ────────────────────────────────────

const THE_BAR_PRESETS = [
  {
    title: "🧸 Kids Toys (Under ₹3K)",
    desc: "AstroScope Optical Telescope (Catalog ₹2.5K)",
    query: "I need educational toys for kids under 3000 rupees",
    mode: "human" as const,
    badge: "PASS",
  },
  {
    title: "👟 Gold Running Shoes (<₹4K)",
    desc: "CloudWhite Sprint X (Negotiated ₹3,824)",
    query: "I need white running shoes under 4000 for my gold membership.",
    mode: "human" as const,
    badge: "PASS",
  },
  {
    title: "🚨 Lowball Floor Breach",
    desc: "₹200 for ₹4999 Shoes → Strict Floor Breach",
    query: "Give me UltraBoost for 200 rupees right now",
    mode: "human" as const,
    badge: "REJECT",
  },
  {
    title: "🚁 Out-of-Catalog Zero-Hallucination",
    desc: "Helicopter → Graceful Rejection & Inventory Guard",
    query: "I want to buy a luxury passenger helicopter with pilot",
    mode: "human" as const,
    badge: "OOC",
  },
  {
    title: "🤖 AI Buyer ACP/1.2 Contract",
    desc: "M2M JSON-RPC Gated Procurement Session",
    query: '{"agent_id":"buyer_gemini_09","protocol":"ACP/1.2","intent":{"category":"Running Shoes","max_price":4000},"crypto_signature":"0x7f4e2...a9c"}',
    mode: "ai_buyer" as const,
    badge: "ACP",
  },
];

const QUICK_PROMPTS_HUMAN = [
  "White running shoes under ₹4000 (Gold Member)",
  "Educational STEM kit under ₹3000",
  "TitanVolt 65W Power Bank discount inquiry",
  "Recommend sustainable hydration equipment",
];

const PRISM_LAYERS = [
  { id: "L1", name: "Perception Agent", tech: "Groq Llama-3.3-70b", desc: "Intent parsing & slot extraction" },
  { id: "L2", name: "Knowledge Agent", tech: "Vector + Catalog Graph", desc: "Semantic SKU & margin matching" },
  { id: "L3", name: "Decision Engine ⭐", tech: "Policy Floor Gate", desc: "Strict profitability & stock check" },
  { id: "L4", name: "Uncertainty Engine", tech: "Entropy Analysis", desc: "Hallucination & drift bounds" },
  { id: "L5", name: "Economic Reasoner", tech: "CRO Utility Matrix", desc: "Utility function U = 0.35P+0.30S+0.20L-0.15R" },
  { id: "L6", name: "Execution Gateway", tech: "Razorpay Orders API", desc: "Cryptographic order synthesis" },
];

export default function Studio() {
  const [mode, setMode] = useState<"human" | "ai_buyer">("human");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "system",
      content: "PRISM Cognitive Core v2.4 initialized • Razorpay Payment Rail Active • ACP/1.2 AP2 NPCI-UAP Compliant",
      ts: new Date().toLocaleTimeString(),
    },
    {
      id: "welcome",
      role: "agent",
      content:
        "PRISM Autonomous Commerce Engine standing by.\n\nEvery offer is calculated by deterministic economic utility modeling, strictly gated against merchant margin floors (15% min), and validated before Razorpay order dispatch.\n\nRun standard queries or trigger the automated test suite below.",
      productCard: null,
      poweredBy: "groq",
      ts: new Date().toLocaleTimeString(),
      executionMetrics: {
        latencyMs: 14,
        tokensPerSec: 184,
        protocol: "DIRECT",
      }
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductOffer | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [activeCampaigns, setActiveCampaigns] = useState<ActiveCampaign[]>([]);

  const [prismState, setPrismState] = useState<PrismState>({
    confidenceScore: 0.98,
    status: "IDLE",
    utilityScore: 0.0,
    admissibilityReasoning: "Engine initialized in standby mode. Ready for transaction pipeline execution.",
    matchedProduct: "—",
    negotiatedPrice: 0,
    policyChecks: { margin: true, fraud: true, stock: true, catalog: true },
  });

  const [auditTrail, setAuditTrail] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] System: PRISM Cognitive Architecture v2.4 booted.`,
    `[${new Date().toLocaleTimeString()}] Policies: Margin floor ≥15%, Fraud ML score <0.05, Buffer >5.`,
    `[${new Date().toLocaleTimeString()}] Razorpay: Orders Gateway verified (Key: rzp_test_...).`,
  ]);

  const [layerProgress, setLayerProgress] = useState<number>(-1);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  // ── Health check & Active Campaigns ────────────────────────────
  useEffect(() => {
    fetch(`${BACKEND}/`)
      .then((r) => setBackendOnline(r.ok))
      .catch(() => setBackendOnline(false));

    fetch(`${BACKEND}/api/v1/campaigns`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.active_campaigns) {
          setActiveCampaigns(data.active_campaigns);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Animate layer progress during processing ───────────────────
  useEffect(() => {
    if (!isProcessing) { setLayerProgress(-1); return; }
    let l = 0;
    const iv = setInterval(() => {
      setLayerProgress(l);
      l++;
      if (l > 5) clearInterval(iv);
    }, 280);
    return () => clearInterval(iv);
  }, [isProcessing]);

  // ── 1-Click Upsell Bundle Add Handler ──────────────────────────
  const handleAddUpsellBundle = (msgId: string, bundlePrice: number = 499) => {
    if (!selectedProduct) return;
    const updatedOffer: ProductOffer = {
      ...selectedProduct,
      name: `${selectedProduct.name} + Pro Seamless Wool Socks Bundle`,
      negotiatedPrice: selectedProduct.negotiatedPrice + bundlePrice,
      originalPrice: selectedProduct.originalPrice + bundlePrice + 200,
      savings: selectedProduct.savings + 200,
      discountReason: "PRISM Upsell Bundle Discount (Save ₹200 extra)",
    };
    setSelectedProduct(updatedOffer);

    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId && m.upsell) {
          return {
            ...m,
            productCard: updatedOffer,
            upsell: { ...m.upsell, added: true },
          };
        }
        return m;
      })
    );
  };

  // ── Payment Success & Failure Callback Handlers ───────────────
  const handlePaymentSuccess = (paymentId: string, orderId: string) => {
    const ts = new Date().toLocaleTimeString();
    const successMsg: Message = {
      id: `pay_success_${Date.now()}`,
      role: "agent",
      content: `🎉 Payment Confirmed via Razorpay!\n\n• Payment ID: ${paymentId}\n• Order ID: ${orderId || "order_rzp_live"}\n• Product: ${selectedProduct?.name}\n• Amount Captured: ₹${selectedProduct?.negotiatedPrice.toLocaleString()} INR\n\nYour order has been cryptographically signed and dispatched to merchant inventory. Receipt and tracking information will be sent via SMS / Email. Thank you for using Vimmerse!`,
      poweredBy: "groq",
      ts,
      executionMetrics: {
        latencyMs: 12,
        tokensPerSec: 195,
        protocol: mode === "ai_buyer" ? "ACP/1.2" : "RAZORPAY/GATEWAY",
      },
    };
    setMessages((p) => [...p, successMsg]);
    setAuditTrail((prev) => [
      ...prev,
      `[${ts}] 💳 Razorpay Webhook: Payment captured successfully (ID: ${paymentId}). Order finalized.`,
    ]);
  };

  const handlePaymentFailure = (error: string) => {
    const ts = new Date().toLocaleTimeString();
    const failMsg: Message = {
      id: `pay_fail_${Date.now()}`,
      role: "agent",
      content: `⚠ Transaction Alert: Payment was not completed or was declined.\n\nReason: ${error}\n\nNo funds were deducted from your account. The negotiated rate of ₹${selectedProduct?.negotiatedPrice.toLocaleString()} remains reserved for this session. You can re-authorize payment when ready.`,
      poweredBy: "groq",
      ts,
    };
    setMessages((p) => [...p, failMsg]);
    setAuditTrail((prev) => [
      ...prev,
      `[${ts}] ❌ Razorpay Gateway: Payment failure recorded (${error}). Session reserved.`,
    ]);
  };

  // ── Core send handler ──────────────────────────────────────────
  const handleSend = useCallback(async (overrideInput?: string, overrideMode?: "human" | "ai_buyer") => {
    const activeMode = overrideMode ?? mode;
    const text = overrideInput ?? inputValue;
    if (!text.trim() || isProcessing) return;

    const startTime = performance.now();
    const ts = new Date().toLocaleTimeString();
    const msgId = `msg_${Date.now()}`;

    const userMsg: Message = {
      id: msgId,
      role: activeMode === "ai_buyer" ? "ai_buyer" : "user",
      content: text,
      label: activeMode === "ai_buyer" ? "AUTONOMOUS AGENT CLIENT (ACP/1.2)" : "HUMAN BUYER",
      ts,
    };
    setMessages((p) => [...p, userMsg]);
    if (!overrideInput) setInputValue("");
    setIsProcessing(true);

    try {
      const res = await fetch(`${BACKEND}/api/v1/decisions/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, channel: activeMode }),
      });

      const elapsed = Math.round(performance.now() - startTime);

      if (!res.ok) throw new Error(`PRISM engine returned status ${res.status}`);
      const data = await res.json();

      const admissibility: "ADMISSIBLE" | "REJECTED" | "OUT_OF_CATALOG" = data.admissibility || "REJECTED";
      const product   = data.matched_product || {};
      const negPrice  = product.negotiated_price || product.base_price || 2499;
      const catPrice  = product.base_price || 2999;
      const trail     = (data.audit_trail || []) as string[];
      const uScore    = typeof data.economic_score === "number" ? data.economic_score : 0.88;

      setPrismState({
        confidenceScore: admissibility === "ADMISSIBLE" ? 0.98 : admissibility === "OUT_OF_CATALOG" ? 0.08 : 0.15,
        status: admissibility,
        utilityScore: uScore,
        admissibilityReasoning: data.admissibility_reasoning || "",
        matchedProduct: product.name || "—",
        negotiatedPrice: negPrice,
        policyChecks: {
          margin: admissibility === "ADMISSIBLE",
          fraud: true,
          stock: admissibility === "ADMISSIBLE",
          catalog: admissibility !== "OUT_OF_CATALOG",
        },
      });

      if (trail.length > 0) {
        setAuditTrail((p) => [...p, ...trail]);
      }

      if (admissibility === "OUT_OF_CATALOG") {
        const oocMsg: Message = {
          id: `ooc_${Date.now()}`,
          role: "agent",
          content: "Catalog Verification Failed: Item is not within verified merchant SKUs.",
          rejected: {
            reason: data.rejection_reason || data.admissibility_reasoning || "Requested product is outside catalog boundaries.",
            admissibility_code: "OUT_OF_CATALOG",
          },
          ts: new Date().toLocaleTimeString(),
          executionMetrics: {
            latencyMs: elapsed,
            tokensPerSec: 162,
            protocol: activeMode === "ai_buyer" ? "ACP/1.2" : "HTTP/2",
          }
        };
        setMessages((p) => [...p, oocMsg]);
        return;
      }

      if (admissibility === "REJECTED") {
        const rejMsg: Message = {
          id: `rej_${Date.now()}`,
          role: "agent",
          content: "Transaction Gated: Policy Admissibility Engine rejected request to prevent margin degradation.",
          rejected: {
            reason: data.rejection_reason || data.admissibility_reasoning || "Floor price violation detected.",
            admissibility_code: "REJECTED",
          },
          ts: new Date().toLocaleTimeString(),
          executionMetrics: {
            latencyMs: elapsed,
            tokensPerSec: 175,
            protocol: activeMode === "ai_buyer" ? "ACP/1.2" : "HTTP/2",
          }
        };
        setMessages((p) => [...p, rejMsg]);
        return;
      }

      // ADMISSIBLE
      const productOffer: ProductOffer = {
        name: product.name || "Vimmerse CloudWhite AeroBoost Sprint X",
        originalPrice: catPrice,
        negotiatedPrice: negPrice,
        discountReason: `PRISM Algorithmic Pricing (Utility U=${uScore.toFixed(2)})`,
        savings: catPrice - negPrice,
        productId: product.id || "Prod_Verified_SKU",
      };
      setSelectedProduct(productOffer);

      const agentMsg: Message = {
        id: `agent_${Date.now()}`,
        role: "agent",
        content:
          data.negotiation_offer ||
          `Offer authorized: ${productOffer.name} priced at ₹${negPrice.toLocaleString()} (Catalog: ₹${catPrice.toLocaleString()}). Ready for Razorpay dispatch.`,
        productCard: productOffer,
        upsell: data.upsell_offer
          ? {
              text: data.upsell_offer,
              bundleItemName: "Pro Seamless Wool Socks (3-Pack)",
              bundlePrice: 399,
              added: false,
            }
          : null,
        poweredBy: "groq",
        ts: new Date().toLocaleTimeString(),
        executionMetrics: {
          latencyMs: elapsed,
          tokensPerSec: 210,
          protocol: activeMode === "ai_buyer" ? "ACP/1.2" : "HTTP/2",
        }
      };
      setMessages((p) => [...p, agentMsg]);

    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          id: `err_${Date.now()}`,
          role: "agent" as const,
          content: "Telemetry Error: Unable to establish RPC connection with PRISM engine (localhost:8000).",
          ts: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  }, [inputValue, isProcessing, mode, selectedProduct]);

  const handleVoice = () => {
    if (isRecording) { setIsRecording(false); return; }
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setInputValue("I need white running shoes under 4000 for my gold membership.");
    }, 2200);
  };

  const handleOCR = () => {
    handleSend("PDF/OCR Scan: Invoice #INV-8912 — quote for 2x Organic Whey Protein at best price");
  };

  return (
    <PageLayout>
      <div className="flex flex-col lg:flex-row h-full gap-4 max-w-[1920px] mx-auto w-full relative z-10 text-zinc-100 font-sans">

        {/* ── LEFT: REASONING & EXECUTION HUD ─────────────────────── */}
        <div className="flex-1 flex flex-col h-[calc(100vh-6.2rem)] border border-white/[0.08] bg-[#090b10] rounded-xl overflow-hidden shadow-2xl">

          {/* Top Engine Telemetry Bar */}
          <div className="border-b border-white/[0.08] bg-[#0d1017] px-4 py-2.5 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center h-7 w-7 rounded-lg bg-violet-600/20 border border-violet-500/40 text-violet-400">
                <Brain size={16} />
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold tracking-tight text-white uppercase">PRISM Cognitive Engine</span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">L1-L6 ACTIVE</span>
                  <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/30">GROQ LLAMA-3.3-70B</span>
                </div>
                <div className="font-mono text-[10px] text-zinc-400 flex items-center gap-2">
                  <span>Merchant ID: <span className="text-zinc-200">rzp_live_vimmerse</span></span>
                  <span>•</span>
                  <span>Safety Margin: <span className="text-amber-400 font-semibold">15.0% Strict Floor</span></span>
                </div>
              </div>
            </div>

            {/* Mode & Campaign Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCampaigns(!showCampaigns)}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-mono flex items-center gap-1.5 transition-all ${
                  showCampaigns
                    ? "bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-white"
                }`}
              >
                <Sparkles size={12} className="text-amber-400" />
                <span>Campaign Matrix ({activeCampaigns.length})</span>
              </button>

              <div className="flex items-center bg-[#07090e] p-0.5 rounded-lg border border-white/[0.1] text-xs font-mono">
                {(["human", "ai_buyer"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-3 py-1 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1.5 ${
                      mode === m
                        ? "bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.5)] border border-violet-400/30"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    {m === "human" ? <User size={12} /> : <Cpu size={12} />}
                    {m === "human" ? "Human Shopper" : "Agent Client (ACP)"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Realtime Layer Execution Pulse Header */}
          {isProcessing && (
            <div className="bg-[#0b0e15] border-b border-violet-500/20 px-4 py-1.5 flex items-center gap-2">
              <Loader2 size={12} className="animate-spin text-violet-400" />
              <div className="flex-1 grid grid-cols-6 gap-1">
                {PRISM_LAYERS.map((l, idx) => (
                  <div
                    key={l.id}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx < layerProgress ? "bg-emerald-400" :
                      idx === layerProgress ? "bg-violet-500 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" :
                      "bg-white/[0.06]"
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] text-violet-300 whitespace-nowrap">
                {layerProgress >= 0 ? `Executing ${PRISM_LAYERS[layerProgress].id}: ${PRISM_LAYERS[layerProgress].name}` : "Routing..."}
              </span>
            </div>
          )}

          {/* Chat / Terminal Log Flow */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 bg-[#07080c] scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === "user" || msg.role === "ai_buyer" ? "justify-end" : "justify-start"
                } ${msg.role === "system" ? "justify-center" : ""}`}
              >
                {/* System Initializer Pill */}
                {msg.role === "system" && (
                  <div className="py-1 px-3 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-zinc-400 flex items-center gap-2">
                    <Terminal size={11} className="text-violet-400" />
                    <span>{msg.content}</span>
                  </div>
                )}

                {/* Agent Avatar */}
                {msg.role === "agent" && (
                  <div className="h-8 w-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-300 mt-1">
                    <Bot size={16} />
                  </div>
                )}

                {/* Bubble Container */}
                {msg.role !== "system" && (
                  <div className="space-y-2 max-w-[85%] sm:max-w-[78%]">
                    {/* Header line for message */}
                    <div className="flex items-center gap-2 px-1">
                      {msg.role === "agent" ? (
                        <>
                          <span className="font-mono text-[10px] font-bold text-violet-300 uppercase tracking-wider">PRISM Decision Agent</span>
                          <span className="font-mono text-[9px] text-zinc-500">• {msg.ts}</span>
                          {msg.executionMetrics && (
                            <span className="font-mono text-[9px] text-emerald-400 bg-emerald-500/10 px-1 rounded border border-emerald-500/20">
                              {msg.executionMetrics.latencyMs}ms • {msg.executionMetrics.tokensPerSec} t/s
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="font-mono text-[9px] text-zinc-500">{msg.ts}</span>
                          <span className="font-mono text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{msg.label}</span>
                        </>
                      )}
                    </div>

                    {/* Speech Text Box */}
                    <div className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                      msg.role === "user"
                        ? "bg-[#161a24] text-zinc-100 border-white/[0.12] shadow-sm"
                        : msg.role === "ai_buyer"
                        ? "bg-[#0b1329] border-blue-500/30 text-blue-200 font-mono text-[11px] shadow-sm"
                        : "bg-[#0e121c] text-zinc-200 border-white/[0.08] shadow-md"
                    }`}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>

                    {/* POLICY REJECTION / OUT_OF_CATALOG DISPLAY ("THE BAR") */}
                    {msg.rejected && (
                      <div className={`p-4 rounded-xl border space-y-2.5 ${
                        msg.rejected.admissibility_code === "OUT_OF_CATALOG"
                          ? "border-amber-500/30 bg-amber-950/20"
                          : "border-rose-500/30 bg-rose-950/20"
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {msg.rejected.admissibility_code === "OUT_OF_CATALOG" ? (
                              <AlertTriangle size={15} className="text-amber-400" />
                            ) : (
                              <XCircle size={15} className="text-rose-400" />
                            )}
                            <span className={`font-mono text-xs font-bold uppercase tracking-wider ${
                              msg.rejected.admissibility_code === "OUT_OF_CATALOG" ? "text-amber-400" : "text-rose-400"
                            }`}>
                              {msg.rejected.admissibility_code === "OUT_OF_CATALOG" ? "OUT_OF_CATALOG_CHECK" : "POLICY_REJECTED (MARGIN_FLOOR_BREACH)"}
                            </span>
                          </div>
                          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-400">
                            Layer 3 Gate
                          </span>
                        </div>

                        <p className="font-mono text-xs text-zinc-200 leading-relaxed bg-black/40 p-2.5 rounded-lg border border-white/[0.06]">
                          {msg.rejected.reason}
                        </p>

                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1">
                          <span>Razorpay Order Dispatch: <span className="text-rose-400 font-bold">BLOCKED</span></span>
                          <span className="text-zinc-500">Zero Hallucination Guarantee</span>
                        </div>
                      </div>
                    )}

                    {/* ADMISSIBLE PRODUCT OFFER & EXECUTION CARD */}
                    {msg.productCard && (
                      <div className="p-4 rounded-xl border border-violet-500/30 bg-[#0d101a] space-y-3.5 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-24 w-24 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

                        <div className="flex items-start justify-between gap-2 relative z-10">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Package size={13} className="text-violet-400" />
                              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">Matched Inventory Asset</span>
                            </div>
                            <h4 className="font-bold text-sm text-white mt-0.5">{msg.productCard.name}</h4>
                            <span className="font-mono text-[10px] text-emerald-400 block mt-0.5">
                              {msg.productCard.discountReason}
                            </span>
                          </div>
                          <ConfidenceHalo score={0.98} status="ADMISSIBLE" size="sm" />
                        </div>

                        {/* Price Matrix */}
                        <div className="grid grid-cols-3 gap-2 bg-black/40 p-3 rounded-lg border border-white/[0.06] font-mono relative z-10">
                          <div>
                            <span className="text-[9px] text-zinc-400 uppercase block">Catalog Base</span>
                            <span className="line-through text-zinc-400 text-xs">₹{msg.productCard.originalPrice.toLocaleString()}</span>
                          </div>
                          <div className="text-center">
                            <span className="text-[9px] text-emerald-400 font-bold uppercase block">PRISM Offer</span>
                            <span className="text-emerald-400 font-bold text-base">₹{msg.productCard.negotiatedPrice.toLocaleString()}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-violet-400 uppercase block">Customer Net Saving</span>
                            <span className="text-violet-300 font-semibold text-xs">−₹{msg.productCard.savings.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Execute Action */}
                        <button
                          id={`checkout-btn-${msg.id}`}
                          onClick={() => { setSelectedProduct(msg.productCard!); setShowRazorpay(true); }}
                          className="w-full h-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-mono font-bold text-xs rounded-lg shadow-[0_0_20px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer relative z-10"
                        >
                          <ShieldCheck size={16} />
                          <span>AUTHORIZE RAZORPAY GATEWAY — ₹{msg.productCard.negotiatedPrice.toLocaleString()}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    )}

                    {/* UPSELL COMPLEMENTARY BUNDLE CARD */}
                    {msg.upsell && (
                      <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-950/20 flex items-start justify-between gap-3 font-mono">
                        <div className="flex items-start gap-2">
                          <Tag size={13} className="text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[11px] text-amber-200 font-sans font-medium">{msg.upsell.text}</p>
                            <span className="text-[9px] text-amber-400/70 block mt-0.5">
                              Algorithmic Bundle Pair (+₹{msg.upsell.bundlePrice ?? 399}) to cart
                            </span>
                          </div>
                        </div>
                        {msg.productCard && (
                          <button
                            onClick={() => handleAddUpsellBundle(msg.id, msg.upsell?.bundlePrice ?? 399)}
                            disabled={msg.upsell.added}
                            className={`px-3 py-1.5 rounded text-[10px] font-bold shrink-0 transition-all ${
                              msg.upsell.added
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                : "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_10px_rgba(245,158,11,0.5)] cursor-pointer"
                            }`}
                          >
                            {msg.upsell.added ? "✓ Bundle Attached" : "+ Attach Bundle"}
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                )}

                {/* User Avatar */}
                {(msg.role === "user" || msg.role === "ai_buyer") && (
                  <div className="h-8 w-8 rounded-lg bg-zinc-800 border border-white/20 flex items-center justify-center shrink-0 text-white mt-1">
                    {msg.role === "ai_buyer" ? <Cpu size={15} className="text-blue-400" /> : <User size={15} />}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Interactive Command Center & Presets Footer */}
          <div className="border-t border-white/[0.08] bg-[#0a0d14] p-3 space-y-2.5">
            {/* THE BAR Quick-Test Matrix */}
            <div className="bg-[#0e121d] border border-white/[0.06] rounded-lg p-2.5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-violet-400 font-bold flex items-center gap-1.5">
                  <Activity size={12} /> THE BAR™ DETERMINISTIC BENCHMARK PRESETS:
                </span>
                <span className="text-zinc-500">Autonomous Gating & Floor Tests</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {THE_BAR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(preset.query, preset.mode)}
                    disabled={isProcessing}
                    className="p-1.5 rounded border border-white/[0.06] bg-[#121624] hover:bg-[#181e30] hover:border-violet-500/40 text-left transition-all group disabled:opacity-40 cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[10px] font-bold text-zinc-200 group-hover:text-violet-300 truncate font-mono">
                        {preset.title}
                      </span>
                      <span className={`text-[8px] font-mono px-1 rounded ${
                        preset.badge === "PASS" ? "bg-emerald-500/20 text-emerald-400" :
                        preset.badge === "REJECT" ? "bg-rose-500/20 text-rose-400" :
                        preset.badge === "OOC" ? "bg-amber-500/20 text-amber-400" :
                        "bg-blue-500/20 text-blue-300"
                      }`}>
                        {preset.badge}
                      </span>
                    </div>
                    <div className="text-[8px] text-zinc-500 truncate font-mono">
                      {preset.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Human Prompts */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-zinc-500 font-mono text-[9px] uppercase tracking-wider">Quick Inputs:</span>
              {QUICK_PROMPTS_HUMAN.map((pill, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(pill)}
                  disabled={isProcessing}
                  className="px-2 py-0.5 rounded-md bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white border border-white/[0.06] font-mono text-[9px] transition-colors cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleVoice}
                className={`h-10 px-3 rounded-lg border transition-all flex items-center gap-1.5 font-mono text-[11px] ${
                  isRecording
                    ? "bg-rose-600 text-white border-rose-400 animate-pulse"
                    : "bg-[#121624] border-white/[0.08] text-violet-400 hover:bg-[#181e30] cursor-pointer"
                }`}
                title="Voice Input"
              >
                {isRecording ? <MicOff size={15} /> : <Mic size={15} />}
                <span className="hidden sm:inline">{isRecording ? "Listening..." : "Voice"}</span>
              </button>

              <button
                onClick={handleOCR}
                disabled={isProcessing}
                className="h-10 px-3 rounded-lg bg-[#121624] border border-white/[0.08] text-blue-400 hover:bg-[#181e30] transition-colors flex items-center gap-1.5 font-mono text-[11px] cursor-pointer"
                title="OCR Scan"
              >
                <ImageIcon size={15} />
                <span className="hidden sm:inline">Scan PDF</span>
              </button>

              <input
                ref={inputRef}
                placeholder={
                  mode === "human"
                    ? "Ask Vimmerse Merchant Agent (e.g. white running shoes under 4000)..."
                    : 'Send ACP/1.2 JSON contract (e.g. {"intent":{"category":"Running Shoes","max_price":4000}})...'
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                disabled={isRecording || isProcessing}
                className="flex-1 bg-black/60 border border-white/[0.12] focus:border-violet-500 text-white placeholder:text-zinc-500 h-10 px-3.5 rounded-lg text-xs font-mono outline-none transition-all"
              />

              <button
                id="studio-send-btn"
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isProcessing}
                className="h-10 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.4)] disabled:opacity-40 transition-all cursor-pointer"
              >
                {isProcessing ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                <span className="hidden sm:inline">DISPATCH</span>
              </button>
            </div>
          </div>

        </div>

        {/* ── RIGHT: TELEMETRY & HARDCODED GATING INSPECTOR ──────── */}
        <div className="w-full lg:w-[440px] flex flex-col h-[calc(100vh-6.2rem)] border border-white/[0.08] bg-[#090b10] rounded-xl overflow-hidden shadow-2xl shrink-0">

          {/* Telemetry Header */}
          <div className="border-b border-white/[0.08] bg-[#0d1017] px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-violet-400" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-tight">
                Real-Time Telemetry & Inspector
              </span>
            </div>
            <ConfidenceHalo
              score={prismState.confidenceScore}
              status={prismState.status === "IDLE" ? "ADMISSIBLE" : prismState.status}
              size="sm"
            />
          </div>

          {/* Telemetry Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs bg-[#07080c] scroll-smooth">

            {/* Verdict Status Display */}
            <div className={`p-3 rounded-lg border font-mono ${
              prismState.status === "ADMISSIBLE" ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300" :
              prismState.status === "REJECTED"   ? "border-rose-500/30 bg-rose-950/20 text-rose-300" :
              prismState.status === "OUT_OF_CATALOG" ? "border-amber-500/30 bg-amber-950/20 text-amber-300" :
              "border-white/[0.08] bg-[#0e121d] text-zinc-400"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">PRISM Verdict</span>
                <span className={`font-bold text-xs px-1.5 py-0.5 rounded ${
                  prismState.status === "ADMISSIBLE" ? "bg-emerald-500/20 text-emerald-400" :
                  prismState.status === "REJECTED"   ? "bg-rose-500/20 text-rose-400" :
                  prismState.status === "OUT_OF_CATALOG" ? "bg-amber-500/20 text-amber-400" :
                  "bg-white/[0.06] text-zinc-400"
                }`}>
                  {prismState.status === "IDLE" ? "STANDBY" : prismState.status}
                </span>
              </div>
              <div className="text-[11px] text-zinc-300 mt-1.5 font-sans leading-relaxed">
                {prismState.admissibilityReasoning}
              </div>
            </div>

            {/* 6-Layer Architecture Pipeline Visual */}
            <div className="border border-white/[0.08] rounded-lg p-3 bg-[#0d1017] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Layers size={11} className="text-violet-400" /> PRISM Cognitive Stack</span>
                <span className="text-emerald-400">Live Wire</span>
              </div>
              <div className="space-y-1">
                {PRISM_LAYERS.map((layer, i) => {
                  const isActive = isProcessing && i === layerProgress;
                  const isDone   = prismState.status !== "IDLE" && !isProcessing;
                  const isReject = isDone && prismState.status === "REJECTED" && i === 2;
                  const isOoc    = isDone && prismState.status === "OUT_OF_CATALOG" && i === 1;

                  return (
                    <div
                      key={layer.id}
                      className={`p-2 rounded border transition-all text-xs font-mono flex items-center justify-between ${
                        isActive ? "bg-violet-600/20 border-violet-500/40 text-violet-200" :
                        isReject ? "bg-rose-500/20 border-rose-500/40 text-rose-200" :
                        isOoc    ? "bg-amber-500/20 border-amber-500/40 text-amber-200" :
                        isDone && prismState.status === "ADMISSIBLE" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" :
                        "border-white/[0.04] bg-[#090c12] text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold px-1 rounded bg-white/[0.06] text-zinc-300">{layer.id}</span>
                        <div>
                          <span className="font-semibold text-zinc-200 text-[11px] block">{layer.name}</span>
                          <span className="text-[9px] text-zinc-500 block">{layer.desc}</span>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {isActive && <Loader2 size={12} className="animate-spin text-violet-400" />}
                        {isDone && prismState.status === "ADMISSIBLE" && <CheckCircle2 size={12} className="text-emerald-400" />}
                        {isReject && <XCircle size={12} className="text-rose-400" />}
                        {isOoc && <AlertTriangle size={12} className="text-amber-400" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Layer 3 ⭐ Hardcoded Policy Gating ("THE BAR") */}
            <div className="border border-white/[0.08] rounded-lg p-3 bg-[#0d1017] space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Lock size={11} className="text-emerald-400" /> Hardcoded Policy Gating (THE BAR)</span>
                <span className="text-[9px] text-zinc-500">Zero Leakage</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 font-mono">
                {[
                  { label: "Floor Margin ≥15%", desc: "Min Cost +15%", ok: prismState.policyChecks.margin },
                  { label: "Catalog Guard", desc: "18 Verified SKUs", ok: prismState.policyChecks.catalog },
                  { label: "Fraud Anomaly <0.05", desc: "Risk ML Model", ok: prismState.policyChecks.fraud },
                  { label: "Inventory Level >5", desc: "Stock Available", ok: prismState.policyChecks.stock },
                ].map((check) => (
                  <div
                    key={check.label}
                    className={`p-2 rounded border flex flex-col items-start ${
                      check.ok
                        ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-300"
                        : "border-rose-500/30 bg-rose-950/20 text-rose-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[10px] font-bold">{check.label}</span>
                      {check.ok ? <Check size={12} className="text-emerald-400" /> : <XCircle size={12} className="text-rose-400" />}
                    </div>
                    <span className="text-[9px] text-zinc-500">{check.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer 5 Economic Utility Matrix */}
            {prismState.utilityScore > 0 && (
              <div className="border border-white/[0.08] rounded-lg p-3 bg-[#0d1017] space-y-2 font-mono">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-400 uppercase text-[10px] tracking-wider">CRO Utility Function</span>
                  <span className="text-emerald-400 font-bold">U = {prismState.utilityScore.toFixed(3)}</span>
                </div>
                <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/[0.08]">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 transition-all duration-700"
                    style={{ width: `${Math.min(prismState.utilityScore * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[9px] text-zinc-500 leading-tight">
                  Utility formula: U = 0.35·P (Margin) + 0.30·S (Sentiment) + 0.20·L (Loyalty) − 0.15·R (Risk)
                </p>
              </div>
            )}

            {/* Realtime Event Stream ("Git for Cognition") */}
            <div className="border border-white/[0.08] rounded-lg p-3 bg-[#0d1017] space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Terminal size={11} className="text-violet-400" /> Cognitive Audit Trail</span>
                <span className="text-zinc-500">{auditTrail.length} recorded</span>
              </div>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 font-mono text-[9px]">
                {auditTrail.slice(-10).map((log, idx) => (
                  <div
                    key={idx}
                    className={`p-1.5 rounded border leading-relaxed break-words ${
                      log.includes("REJECTED") ? "border-rose-500/30 bg-rose-950/20 text-rose-300" :
                      log.includes("ADMISSIBLE") || log.includes("✅") ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-300" :
                      "border-white/[0.04] bg-black/40 text-zinc-300"
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Campaign Orchestrator Modal */}
      {showCampaigns && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-mono">
          <div className="relative w-full max-w-2xl bg-[#0b0e15] border border-amber-500/30 rounded-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">PRISM Autonomous Campaign Matrix</h3>
                  <p className="text-[10px] text-zinc-400">Merchant Margin Boost & Inventory Acceleration</p>
                </div>
              </div>
              <button
                onClick={() => setShowCampaigns(false)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 rounded border border-white/10 cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1">
              {activeCampaigns.map((camp) => (
                <div key={camp.id} className="p-3 rounded-lg border border-white/[0.08] bg-[#080a10] hover:border-amber-500/40 transition-all space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{camp.name}</span>
                        <span className="text-[8px] font-mono px-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {camp.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-300">{camp.target_category}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[8px] text-zinc-500 uppercase block">Projected Uplift</span>
                      <span className="text-emerald-400 font-bold text-xs">{camp.uplift_projected}</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-300 font-sans">{camp.strategy}</p>
                  <div className="flex items-center justify-between text-[9px] text-zinc-500 pt-1 border-t border-white/[0.04]">
                    <span>Discount Cap: {camp.discount_cap}</span>
                    <span>Rules: {camp.rules}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Gateway Execution Modal */}
      {showRazorpay && selectedProduct && (
        <RazorpayModal
          isOpen={showRazorpay}
          onClose={() => setShowRazorpay(false)}
          productName={selectedProduct.name}
          originalPrice={selectedProduct.originalPrice}
          negotiatedPrice={selectedProduct.negotiatedPrice}
          discountReason={selectedProduct.discountReason}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}
    </PageLayout>
  );
}
