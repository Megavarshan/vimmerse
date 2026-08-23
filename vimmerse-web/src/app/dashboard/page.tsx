import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Activity, DollarSign, Users, Target, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  return (
    <PageLayout>
      <div className="flex flex-col space-y-8 max-w-7xl mx-auto w-full relative z-10">
        
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="border-none">Merchant Brain</Typography>
            <Typography variant="muted">Overview of your AI-driven commerce ecosystem.</Typography>
          </div>
          <Badge variant="glow" className="px-4 py-1 text-sm rounded-full">
            <span className="flex h-2 w-2 rounded-full bg-white mr-2 animate-pulse"></span>
            System Online
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-[var(--color-emerald)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹45,231.89</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-[var(--color-emerald)] flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> +20.1%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Conversions</CardTitle>
              <Target className="h-4 w-4 text-[var(--color-electric-violet)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+2350</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-[var(--color-electric-violet)] flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> +180.1%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-[var(--color-razor-blue)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+12,234</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-[var(--color-razor-blue)] flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> +19%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Decisions Optimized</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">89.4%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-orange-500 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> +2.4%</span> since last deploy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions & Graph Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="glass" className="h-[400px]">
            <CardHeader>
              <CardTitle>Recent Cognitive Decisions</CardTitle>
              <CardDescription>Live feed of AI agent negotiations and executions.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center p-3 rounded-lg bg-white/5 border border-white/5">
                    <div className="mr-4 p-2 rounded-full bg-[var(--color-electric-violet)]/20 text-[var(--color-electric-violet)]">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none text-white">Negotiation Successful</p>
                      <p className="text-xs text-muted-foreground">Vegan Protein • User: usr_{9832 + i} • Margin: 24%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">₹2,250.00</p>
                      <p className="text-xs text-[var(--color-emerald)]">Executed via Razorpay</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card variant="glass" className="h-[400px]">
            <CardHeader>
              <CardTitle>Semantic Graph Overview</CardTitle>
              <CardDescription>Knowledge entity relationships and access patterns.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px]">
              {/* Placeholder for the Graph component */}
              <div className="text-center text-muted-foreground">
                <div className="h-32 w-32 mx-auto rounded-full border-2 border-dashed border-[var(--color-electric-violet)]/50 flex items-center justify-center mb-4">
                  <Activity className="h-8 w-8 text-[var(--color-electric-violet)] animate-pulse" />
                </div>
                <p>Knowledge Graph Visualization Online</p>
                <p className="text-xs mt-2">Connecting to Neo4j Graph DB...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
