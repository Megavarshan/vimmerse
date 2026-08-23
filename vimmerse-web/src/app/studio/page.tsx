"use client";
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';
import { Send, Bot, User, Brain, Activity, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@radix-ui/react-scroll-area';

export default function Studio() {
  const [messages, setMessages] = useState<any[]>([
    { role: 'agent', content: 'Hello! I am Vimmerse, your AI merchant. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [auditTrail, setAuditTrail] = useState<string[]>([]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMsg = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);
    
    // Simulate cognitive decision process
    setAuditTrail([
      "[10:00:01] Perception: Extracted intent (budget=2500, product='protein')",
      "[10:00:02] Knowledge: Queried Neo4j for 'vegan protein' (price=2700, margin=25%)",
      "[10:00:03] Decision Engine: ADMISSIBLE (Customer budget within negotiation range)",
      "[10:00:04] Uncertainty: Epistemic=0.05, Aleatoric=0.12 (Confidence: High)",
      "[10:00:05] Economic Reasoner: Calculated Utility Score U=0.85",
      "[10:00:06] Negotiation: Generated optimal counter-offer: ₹2250",
      "[10:00:07] Execution: Razorpay Order created (order_12345)"
    ]);

    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'agent', 
        content: 'Based on your loyalty points, I can offer you the Vegan Power Protein for ₹2,250 instead of ₹2,700. Shall I process this via Razorpay?' 
      }]);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <PageLayout>
      <div className="flex h-full gap-6 max-w-[1600px] mx-auto w-full relative z-10">
        
        {/* Customer Interface Simulation */}
        <Card variant="glass" className="flex-1 flex flex-col h-[calc(100vh-8rem)]">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[var(--color-electric-violet)]" />
              Live Commerce Interface
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'agent' && (
                  <div className="h-8 w-8 rounded-full bg-[var(--color-electric-violet)]/20 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-[var(--color-electric-violet)]" />
                  </div>
                )}
                <div className={`p-3 rounded-2xl max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-white text-black rounded-tr-sm' 
                    : 'glass-panel rounded-tl-sm text-white'
                }`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <User size={16} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-full bg-[var(--color-electric-violet)]/20 flex items-center justify-center shrink-0">
                  <Bot size={16} className="text-[var(--color-electric-violet)]" />
                </div>
                <div className="glass-panel p-3 rounded-2xl rounded-tl-sm text-white flex gap-1 items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t border-white/10 pt-4">
            <div className="flex w-full gap-2">
              <Input 
                placeholder="Simulate a customer request..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12 rounded-xl"
              />
              <Button size="icon" className="h-12 w-12 rounded-xl" onClick={handleSend} disabled={!inputValue.trim() || isProcessing}>
                <Send size={18} />
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Cognitive Decision Architecture Dashboard */}
        <Card variant="glass" className="w-[450px] flex flex-col h-[calc(100vh-8rem)]">
          <CardHeader className="border-b border-white/10 pb-4 bg-black/20">
            <CardTitle className="flex items-center gap-2 text-sm text-[var(--color-electric-violet)]">
              <Brain className="h-4 w-4" />
              LangGraph Agent Reasoning
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="p-4 space-y-4">
              {auditTrail.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground text-sm text-center">
                  <Activity className="h-8 w-8 mb-2 opacity-20" />
                  <p>Awaiting customer interaction to trigger<br/>the cognitive decision protocol.</p>
                </div>
              ) : (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                  {auditTrail.map((log, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/20 bg-black text-[var(--color-electric-violet)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow md:mx-auto z-10">
                        {idx === auditTrail.length - 1 ? <CheckCircle2 size={12} className="text-[var(--color-emerald)]" /> : <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-electric-violet)]"></div>}
                      </div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-3 rounded glass-panel border border-white/5 ml-4 md:ml-0 shadow">
                        <p className="text-xs text-white/80 font-mono leading-relaxed break-words">{log}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </PageLayout>
  );
}
