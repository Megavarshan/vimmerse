import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Typography, GradientText } from '@/components/ui/Typography';
import { ArrowRight, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';

export default function Home() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        
        {/* Hero Section */}
        <div className="space-y-6 max-w-4xl relative z-10">
          <div className="inline-flex items-center rounded-full border border-[var(--color-electric-violet)]/30 bg-[var(--color-electric-violet)]/10 px-3 py-1 text-sm font-medium text-[var(--color-electric-violet)] mb-4">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-electric-violet)] mr-2 animate-pulse"></span>
            PRISM Cognitive Engine v2.0 Live
          </div>
          
          <Typography variant="h1" className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Immerse Intelligence <br className="hidden md:block" />
            <GradientText>into Commerce</GradientText>
          </Typography>
          
          <Typography variant="lead" className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            The Agentic Commerce Intelligence Layer. Transforming existing stores into autonomous AI merchants capable of reasoning, negotiation, and secure financial execution.
          </Typography>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/studio">
              <Button size="lg" className="h-12 px-8 text-lg rounded-full">
                Launch Merchant Brain <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl w-full relative z-10">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-[var(--color-electric-violet)]/20 flex items-center justify-center text-[var(--color-electric-violet)]">
              <BrainCircuit size={24} />
            </div>
            <Typography variant="h4">Cognitive Reasoning</Typography>
            <Typography variant="muted">Multi-layered decision architecture that understands context, not just keywords.</Typography>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-[var(--color-razor-blue)]/20 flex items-center justify-center text-[var(--color-razor-blue)]">
              <Zap size={24} />
            </div>
            <Typography variant="h4">Dynamic Negotiation</Typography>
            <Typography variant="muted">Real-time intelligent pricing based on inventory, loyalty, and margin rules.</Typography>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-[var(--color-emerald)]/20 flex items-center justify-center text-[var(--color-emerald)]">
              <ShieldCheck size={24} />
            </div>
            <Typography variant="h4">Secure Execution</Typography>
            <Typography variant="muted">Flawless integration with Razorpay. Business logic never touches the payment layer.</Typography>
          </div>
        </div>

      </div>
    </PageLayout>
  );
}
