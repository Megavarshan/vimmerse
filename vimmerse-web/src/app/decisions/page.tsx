"use client";
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfidenceHalo } from '@/components/ui/ConfidenceHalo';
import { 
  Clock, Search, Filter, Download, ArrowRight, ShieldCheck, ChevronRight, 
  BrainCircuit, Database, Cpu, Eye, FileText, CheckCircle2, AlertTriangle, XCircle
} from 'lucide-react';

interface DecisionRecord {
  id: string;
  time: string;
  query: string;
  modality: "Voice" | "Text" | "OCR/Invoice" | "AI-to-AI JSON";
  type: string;
  action: string;
  status: "ADMISSIBLE" | "REJECTED" | "CLARIFY";
  utilityScore: number;
  epistemic: number;
  aleatoric: number;
  offeredPrice: number;
  catalogPrice: number;
  razorpayOrder: string;
  layers: {
    l1_perception: string;
    l2_knowledge: string;
    l3_admissibility: string;
    l4_uncertainty: string;
    l5_economic: string;
    l6_execution: string;
  };
}

export default function Decisions() {
  const [selectedDecision, setSelectedDecision] = useState<DecisionRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const records: DecisionRecord[] = [
    {
      id: "dec_9f82h3",
      time: "16:22:15",
      query: "I need white running shoes under ₹4000 for my Gold membership.",
      modality: "Voice",
      type: "Price Negotiation",
      action: "Counter Offer (₹3,899)",
      status: "ADMISSIBLE",
      utilityScore: 0.88,
      epistemic: 0.04,
      aleatoric: 0.08,
      catalogPrice: 4999,
      offeredPrice: 3899,
      razorpayOrder: "order_rzp_9841",
      layers: {
        l1_perception: "Extracted: category='Running Shoes', color='White', max_price=4000, loyalty='Gold'",
        l2_knowledge: "Neo4j matched 'UltraBoost Sprint X' (Price ₹4999, Inventory: 142 units, Margin: 28%)",
        l3_admissibility: "PASSED: Offered price ₹3899 >= Floor price ₹3600 (Margin 22% >= Floor 15%)",
        l4_uncertainty: "Epistemic=0.04, Aleatoric=0.08 -> SAFE_TO_NEGOTIATE",
        l5_economic: "Utility U = 0.35(0.78) + 0.30(0.95) + 0.20(0.85) - 0.15(0.02) = 0.88",
        l6_execution: "Generated Razorpay Order 'order_rzp_9841' with cryptographic webhook key"
      }
    },
    {
      id: "dec_2m9k1L",
      time: "16:14:02",
      query: "POST /api/v1/decisions/process { category: 'Proteins', max_price: 2400 }",
      modality: "AI-to-AI JSON",
      type: "AI Buyer Negotiation",
      action: "Contract Issued (₹2,250)",
      status: "ADMISSIBLE",
      utilityScore: 0.92,
      epistemic: 0.02,
      aleatoric: 0.05,
      catalogPrice: 2700,
      offeredPrice: 2250,
      razorpayOrder: "order_rzp_9840",
      layers: {
        l1_perception: "Agent-to-Agent Protocol v1.4 Payload parsed from client 'buyer_gpt4o_91'",
        l2_knowledge: "Neo4j matched 'Vegan Power Protein 2kg' (Price ₹2700, Inventory: High)",
        l3_admissibility: "PASSED: Floor margin 18% maintained with ₹2,250 contract price",
        l4_uncertainty: "Epistemic=0.02, Aleatoric=0.05 -> HIGH_CONFIDENCE",
        l5_economic: "Utility U = 0.92 (High repeat purchase probability)",
        l6_execution: "Issued automated Razorpay Payment Link valid for 15 mins"
      }
    },
    {
      id: "dec_p49vX1",
      time: "15:58:40",
      query: "Can I buy 10x Seamless Wool Socks for ₹150 per pair?",
      modality: "Text",
      type: "Bulk B2B Discount",
      action: "Declined (Margin Breach)",
      status: "REJECTED",
      utilityScore: 0.14,
      epistemic: 0.12,
      aleatoric: 0.22,
      catalogPrice: 3500,
      offeredPrice: 1500,
      razorpayOrder: "NONE (Rejected)",
      layers: {
        l1_perception: "Extracted: product='Wool Socks', qty=10, requested_unit_price=150 (Total ₹1500)",
        l2_knowledge: "Catalog Price ₹3500, Cost Price ₹2100 (Floor Price ₹2450)",
        l3_admissibility: "REJECTED: Requested price ₹1500 violates floor margin (Negative margin -28%)",
        l4_uncertainty: "Predictive Entropy High (0.78) -> UNALLOWABLE_TRANSACTION",
        l5_economic: "Utility U = 0.14 -> Rejected due to margin destruction",
        l6_execution: "Blocked at Layer 3. No Razorpay order generated."
      }
    },
    {
      id: "dec_b72nC9",
      time: "15:30:11",
      query: "Is the Smart Hydration Flask dishwasher safe?",
      modality: "Text",
      type: "Product Knowledge Query",
      action: "Info Provided",
      status: "ADMISSIBLE",
      utilityScore: 0.75,
      epistemic: 0.01,
      aleatoric: 0.03,
      catalogPrice: 1499,
      offeredPrice: 1499,
      razorpayOrder: "N/A (Info query)",
      layers: {
        l1_perception: "Extracted: product='Smart Hydration Flask', property='dishwasher_safe'",
        l2_knowledge: "Neo4j entity attribute matched: dishwasher_safe=true (BPA-free stainless steel)",
        l3_admissibility: "PASSED: Information request poses 0 financial risk",
        l4_uncertainty: "Entropy 0.01 (Exact match in graph)",
        l5_economic: "Utility U = 0.75 (Customer support resolution)",
        l6_execution: "Returned factual answer directly"
      }
    }
  ];

  const filteredRecords = records.filter(r => {
    const matchesFilter = filterStatus === "ALL" || r.status === filterStatus;
    const matchesSearch = 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.query.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vimmerse_audit_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <PageLayout>
      <div className="flex flex-col space-y-6 max-w-7xl mx-auto w-full relative z-10 h-full">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Decision Explorer</h1>
              <Badge variant="outline" className="text-xs font-mono border-violet-500/30 text-violet-300">
                GIT FOR AI COGNITION
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Replayable audit trail of every PRISM layer reasoning step, vector retrieval, and Razorpay authorization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleExportJSON} variant="outline" className="h-10 text-xs font-mono border-white/15 gap-2">
              <Download size={14} /> Export Audit Log (JSON)
            </Button>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {["ALL", "ADMISSIBLE", "REJECTED", "CLARIFY"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border ${
                  filterStatus === st
                    ? "bg-violet-600/30 text-violet-300 border-violet-500/40 font-bold"
                    : "glass-panel border-white/10 text-muted-foreground hover:text-white"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter by Decision ID or Query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full bg-black/40 border border-white/15 rounded-xl py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Table & Detailed Snapshot Drawer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[500px]">
          
          {/* Audit Trail Table */}
          <Card variant="glass" className="lg:col-span-7 border-white/10 overflow-hidden flex flex-col">
            <CardHeader className="border-b border-white/10 py-3 bg-black/20">
              <CardTitle className="text-xs font-mono uppercase text-muted-foreground flex items-center justify-between">
                <span>Cognitive Decisions Feed ({filteredRecords.length})</span>
                <span>Select row to inspect PRISM payload</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="p-0 overflow-y-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="uppercase bg-white/5 text-muted-foreground font-mono text-[10px] sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="px-4 py-3">Time & ID</th>
                    <th className="px-4 py-3">Modality</th>
                    <th className="px-4 py-3">Query / Intent</th>
                    <th className="px-4 py-3">Verdict</th>
                    <th className="px-4 py-3 text-right">Econ Score (U)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredRecords.map((r) => {
                    const isSelected = selectedDecision?.id === r.id;
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedDecision(r)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-violet-600/20 border-l-4 border-l-violet-500" : "hover:bg-white/5"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span className="text-violet-300 font-bold block">{r.id}</span>
                          <span className="text-[10px] text-muted-foreground">{r.time}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-white/10 text-white text-[10px]">
                            {r.modality}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-sans text-white/90 truncate max-w-[180px]">
                          {r.query}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={r.status === "ADMISSIBLE" ? "success" : "destructive"}
                            className="text-[10px]"
                          >
                            {r.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-400">
                          {r.utilityScore.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Deep Cognitive State Snapshot Inspector */}
          <Card variant="glass" className="lg:col-span-5 border-white/10 flex flex-col justify-between">
            <CardHeader className="border-b border-white/10 pb-4 bg-black/30">
              <CardTitle className="text-sm font-bold text-white flex items-center justify-between font-mono">
                <span className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-violet-400" />
                  State Snapshot Drawer
                </span>
                {selectedDecision && <ConfidenceHalo score={selectedDecision.utilityScore} status={selectedDecision.status} size="sm" />}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 flex-1 overflow-y-auto space-y-6">
              {selectedDecision ? (
                <div className="space-y-6 animate-in fade-in duration-200 font-mono text-xs">
                  
                  {/* Top Overview */}
                  <div className="glass-panel p-4 rounded-xl space-y-2 border-white/10">
                    <div className="flex justify-between items-center text-muted-foreground text-[10px]">
                      <span>DECISION RECORD: {selectedDecision.id}</span>
                      <span>{selectedDecision.time}</span>
                    </div>
                    <p className="text-white font-sans text-sm">{selectedDecision.query}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px]">
                      <span>Catalog: ₹{selectedDecision.catalogPrice}</span>
                      <span className="text-emerald-400 font-bold">Offer: ₹{selectedDecision.offeredPrice}</span>
                      <span className="text-blue-400">{selectedDecision.razorpayOrder}</span>
                    </div>
                  </div>

                  {/* 6 PRISM Layer Step Breakdown */}
                  <div className="space-y-3">
                    <span className="text-xs font-semibold text-white uppercase tracking-wider block">
                      6-Layer PRISM Cognitive Breakdown
                    </span>

                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 space-y-1">
                        <span className="text-violet-400 font-bold block text-[10px]">L1 — Multimodal Perception</span>
                        <p className="text-white/80 text-[11px]">{selectedDecision.layers.l1_perception}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 space-y-1">
                        <span className="text-blue-400 font-bold block text-[10px]">L2 — Semantic Knowledge Graph</span>
                        <p className="text-white/80 text-[11px]">{selectedDecision.layers.l2_knowledge}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-1">
                        <span className="text-emerald-400 font-bold block text-[10px]">L3 — Decision Admissibility Engine ⭐</span>
                        <p className="text-white/80 text-[11px]">{selectedDecision.layers.l3_admissibility}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 space-y-1">
                        <span className="text-amber-400 font-bold block text-[10px]">L4 — Uncertainty Intelligence</span>
                        <p className="text-white/80 text-[11px]">{selectedDecision.layers.l4_uncertainty}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-1">
                        <span className="text-purple-400 font-bold block text-[10px]">L5 — Economic Reasoner</span>
                        <p className="text-white/80 text-[11px]">{selectedDecision.layers.l5_economic}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 space-y-1">
                        <span className="text-cyan-400 font-bold block text-[10px]">L6 — Trusted Execution</span>
                        <p className="text-white/80 text-[11px]">{selectedDecision.layers.l6_execution}</p>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-3 py-12">
                  <Clock className="h-12 w-12 text-violet-400/40 animate-pulse" />
                  <p className="text-xs max-w-xs font-mono">
                    Select any decision entry from the timeline table to inspect the complete 6-layer cognitive state vector.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </PageLayout>
  );
}

