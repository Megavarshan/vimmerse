"use client";
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ConfidenceHalo } from '@/components/ui/ConfidenceHalo';
import { 
  Network, Database, RefreshCw, ZoomIn, ZoomOut, Search, Filter, 
  Sparkles, Layers, ArrowRight, ShieldCheck, Tag, Box, UserCheck, Bot
} from 'lucide-react';

interface GraphNode {
  id: string;
  label: string;
  type: "product" | "attribute" | "customer" | "agent";
  price?: number;
  margin?: number;
  relationships: string[];
  embeddings: number[];
  provenance: string;
  policy: string;
  x: number;
  y: number;
}

export default function Graph() {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const nodes: GraphNode[] = [
    {
      id: "node_1",
      label: "UltraBoost Running Shoes",
      type: "product",
      price: 4999,
      margin: 28,
      relationships: ["Bundled with Pro Socks", "Sustainable Material", "Gold Member Preferred"],
      embeddings: [0.0841, -0.192, 0.841, 0.231, -0.052, 0.612, 0.384],
      provenance: "Shopify Sync #SH-8912 • Neo4j ID #1042",
      policy: "Floor Margin >= 15% | Max Discount 25%",
      x: 45,
      y: 35
    },
    {
      id: "node_2",
      label: "Pro Seamless Wool Socks",
      type: "product",
      price: 399,
      margin: 45,
      relationships: ["Bundles with UltraBoost", "High Repeat Purchase 88%"],
      embeddings: [0.121, 0.402, -0.219, 0.771, 0.043, -0.182, 0.501],
      provenance: "WooCommerce Sync #WO-3021 • Neo4j ID #1043",
      policy: "Floor Margin >= 20% | Auto-Bundle Eligible",
      x: 70,
      y: 25
    },
    {
      id: "node_3",
      label: "Vegan Power Protein (2kg)",
      type: "product",
      price: 2700,
      margin: 32,
      relationships: ["Plant-Based Tag", "Frequently Reordered (30 Days)", "AI Buyer Popular"],
      embeddings: [-0.342, 0.812, 0.004, -0.512, 0.912, 0.221, -0.104],
      provenance: "Custom DB Catalog • Neo4j ID #1044",
      policy: "Floor Margin >= 18% | Subscribe & Save Enabled",
      x: 30,
      y: 65
    },
    {
      id: "node_4",
      label: "Sustainable & Recycled",
      type: "attribute",
      relationships: ["Applies to UltraBoost Shoes", "Applies to Smart Bottle"],
      embeddings: [0.912, 0.042, 0.312, 0.104, -0.612, 0.412, 0.082],
      provenance: "ESG Compliance Graph Entity",
      policy: "Boost Utility Score U by +0.10 for eco-shoppers",
      x: 20,
      y: 30
    },
    {
      id: "node_5",
      label: "Gold Loyalty Customer Segment",
      type: "customer",
      relationships: ["Matches User usr_8921", "Unlocks +5% Negotiation Cap"],
      embeddings: [0.512, -0.312, 0.902, 0.412, 0.124, -0.052, 0.812],
      provenance: "Klaviyo / Shopify Segment Sync",
      policy: "Loyalty Multiplier 1.25x active",
      x: 60,
      y: 60
    },
    {
      id: "node_6",
      label: "Autonomous AI Buyer Agent #91",
      type: "agent",
      relationships: ["Transacted 14 Orders", "Protocol v1.4 Transactable"],
      embeddings: [0.002, 0.991, -0.412, 0.219, 0.512, -0.812, 0.341],
      provenance: "Agent-to-Agent Network Identity #AG-91",
      policy: "Automated Instant Admissibility Check",
      x: 80,
      y: 70
    }
  ];

  const filteredNodes = nodes.filter(n => {
    const matchesFilter = filterType === "all" || n.type === filterType;
    const matchesSearch = n.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <PageLayout>
      <div className="flex flex-col space-y-6 max-w-7xl mx-auto w-full relative z-10 h-full">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Semantic Knowledge Graph</h1>
              <Badge variant="outline" className="text-xs font-mono border-violet-500/30 text-violet-300">
                PRISM GRAPH CORE (IN-MEMORY + OPTIONAL NEO4J)
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Deterministic semantic commerce graph connecting SKUs, cost floors, loyalty tiers, bundle affinities, and AI agent relationships. Operates out-of-the-box in-memory with optional Neo4j Docker sync.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 text-xs font-mono border-white/15">
              <Database className="mr-2 h-4 w-4 text-blue-400" /> Export / Sync Graph
            </Button>
            <Button className="h-10 bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <RefreshCw className="mr-2 h-4 w-4" /> Re-index Graph
            </Button>
          </div>
        </div>

        {/* Filter Controls & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {["all", "product", "attribute", "customer", "agent"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition-all border ${
                  filterType === t
                    ? "bg-violet-600/30 text-violet-300 border-violet-500/40 font-bold"
                    : "glass-panel border-white/10 text-muted-foreground hover:text-white"
                }`}
              >
                {t} {t === "all" ? `(${nodes.length})` : ""}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search graph nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full bg-black/40 border border-white/15 rounded-xl py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>

        {/* Interactive Graph Canvas Grid & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[550px]">
          
          {/* Visual Interactive Graph Box */}
          <Card variant="glass" className="lg:col-span-8 flex flex-col relative overflow-hidden border-white/10 min-h-[500px]">
            <CardContent className="flex-1 p-6 relative flex items-center justify-center">
              
              {/* Background Graph Mesh */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <line x1="45%" y1="35%" x2="70%" y2="25%" stroke="#7C3AED" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="45%" y1="35%" x2="20%" y2="30%" stroke="#10B981" strokeWidth="2" />
                <line x1="45%" y1="35%" x2="60%" y2="60%" stroke="#2563EB" strokeWidth="2" />
                <line x1="30%" y1="65%" x2="80%" y2="70%" stroke="#F59E0B" strokeWidth="2" />
                <line x1="60%" y1="60%" x2="80%" y2="70%" stroke="#7C3AED" strokeWidth="2" />
              </svg>

              {/* Render Draggable / Clickable Nodes */}
              <div className="absolute inset-0">
                {filteredNodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  let bgClass = "bg-violet-600/20 border-violet-500 text-violet-300";
                  let Icon = Box;

                  if (node.type === "attribute") {
                    bgClass = "bg-emerald-600/20 border-emerald-500 text-emerald-300";
                    Icon = Tag;
                  } else if (node.type === "customer") {
                    bgClass = "bg-blue-600/20 border-blue-500 text-blue-300";
                    Icon = UserCheck;
                  } else if (node.type === "agent") {
                    bgClass = "bg-amber-600/20 border-amber-500 text-amber-300";
                    Icon = Bot;
                  }

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-2xl border backdrop-blur-xl cursor-pointer transition-all duration-300 flex items-center gap-3 ${bgClass} ${
                        isSelected
                          ? "ring-4 ring-violet-500/50 scale-110 shadow-[0_0_30px_rgba(124,58,237,0.5)] z-20"
                          : "hover:scale-105 opacity-90 hover:opacity-100 z-10"
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-black/40 border border-white/10">
                        <Icon size={18} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block truncate max-w-[140px] font-mono">
                          {node.label}
                        </span>
                        <span className="text-[9px] uppercase font-mono tracking-wider text-muted-foreground">
                          {node.type}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="absolute bottom-4 left-4 font-mono text-[10px] text-muted-foreground glass-panel px-3 py-1.5 rounded-xl">
                Click any node to inspect 384-dim embeddings & PRISM merchant policy rules.
              </div>
            </CardContent>
          </Card>

          {/* Node Inspector Side Drawer */}
          <Card variant="glass" className="lg:col-span-4 border-white/10 flex flex-col justify-between">
            <CardHeader className="border-b border-white/10 pb-4 bg-black/30">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                <Sparkles className="h-4 w-4 text-violet-400" />
                Node Inspector Drawer
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 flex-1 overflow-y-auto space-y-6">
              {selectedNode ? (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div>
                    <Badge variant="outline" className="text-[10px] font-mono uppercase mb-2">
                      {selectedNode.type} Entity
                    </Badge>
                    <h3 className="text-xl font-bold text-white font-mono">{selectedNode.label}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{selectedNode.provenance}</p>
                  </div>

                  {selectedNode.price && (
                    <div className="glass-panel p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                      <span className="text-muted-foreground">Catalog Price / Margin:</span>
                      <span className="text-emerald-400 font-bold">
                        ₹{selectedNode.price.toLocaleString()} ({selectedNode.margin}% Margin)
                      </span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                      Connected Relationships
                    </span>
                    <div className="space-y-1.5">
                      {selectedNode.relationships.map((rel, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-white/90 flex items-center gap-2">
                          <ArrowRight size={14} className="text-violet-400 shrink-0" />
                          <span>{rel}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                      Merchant Policy Rule
                    </span>
                    <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-300 font-mono">
                      {selectedNode.policy}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                      Vector Embedding Sample (384-Dim)
                    </span>
                    <pre className="p-3 rounded-xl bg-black/60 border border-white/10 text-[10px] font-mono text-emerald-400 overflow-x-auto">
                      {JSON.stringify(selectedNode.embeddings, null, 1)}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-3 py-12">
                  <Network className="h-12 w-12 text-violet-400/40 animate-pulse" />
                  <p className="text-xs max-w-xs font-mono">
                    Select any entity node from the Neo4j graph canvas to inspect commercial metadata.
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

