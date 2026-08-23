import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Network, Database, RefreshCw, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Graph() {
  return (
    <PageLayout>
      <div className="flex flex-col space-y-6 max-w-7xl mx-auto w-full relative z-10 h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Semantic Knowledge Graph</h1>
            <p className="text-muted-foreground mt-1">Real-time visualization of Neo4j product and customer relationships.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-9">
              <Database className="mr-2 h-4 w-4" /> Sync Neo4j
            </Button>
            <Button className="h-9 bg-[var(--color-electric-violet)] hover:bg-[var(--color-electric-violet)]/90 text-white border-none shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Layout
            </Button>
          </div>
        </div>

        <Card variant="glass" className="flex-1 flex flex-col min-h-[600px] relative overflow-hidden border-white/10">
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <button className="glass-panel p-2 rounded-md hover:bg-white/10 transition-colors">
              <ZoomIn className="h-4 w-4 text-white" />
            </button>
            <button className="glass-panel p-2 rounded-md hover:bg-white/10 transition-colors">
              <ZoomOut className="h-4 w-4 text-white" />
            </button>
            <button className="glass-panel p-2 rounded-md hover:bg-white/10 transition-colors">
              <Maximize className="h-4 w-4 text-white" />
            </button>
          </div>
          
          <CardContent className="flex-1 p-0 flex items-center justify-center relative">
             {/* Mock Graph Background for Demo */}
             <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                backgroundSize: '32px 32px'
             }}></div>
             
             <div className="text-center z-10">
                <Network className="h-16 w-16 mx-auto text-[var(--color-electric-violet)] mb-4 animate-pulse opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">Graph Visualization Pending</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  The interactive React Flow graph will display here, rendering nodes (Products, Customers, Inventory) and edges (Purchased, Viewed, Correlated) from Neo4j.
                </p>
             </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
