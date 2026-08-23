import React from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function Decisions() {
  return (
    <PageLayout>
      <div className="flex flex-col space-y-6 max-w-6xl mx-auto w-full relative z-10 h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Decision Explorer</h1>
            <p className="text-muted-foreground mt-1">Audit trail of all cognitive operations and autonomous decisions.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search logs or IDs..." className="pl-9 w-64 glass-panel border-white/10" />
            </div>
            <button className="glass-panel p-2 rounded-md hover:bg-white/10 transition-colors border-white/10">
              <Filter className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <Card variant="glass" className="flex-1 overflow-hidden flex flex-col">
          <CardHeader className="border-b border-white/5 py-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-[var(--color-electric-violet)]" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-white/5 text-muted-foreground sticky top-0 backdrop-blur-md">
                <tr>
                  <th scope="col" className="px-6 py-3 font-medium border-b border-white/5">Timestamp</th>
                  <th scope="col" className="px-6 py-3 font-medium border-b border-white/5">Decision ID</th>
                  <th scope="col" className="px-6 py-3 font-medium border-b border-white/5">Intent Type</th>
                  <th scope="col" className="px-6 py-3 font-medium border-b border-white/5">Action Taken</th>
                  <th scope="col" className="px-6 py-3 font-medium border-b border-white/5">Admissibility</th>
                  <th scope="col" className="px-6 py-3 font-medium border-b border-white/5 text-right">Econ Score (U)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'dec_9f82h3', time: '10:05:22', type: 'Negotiation', action: 'Offer Created', status: 'ADMISSIBLE', u: '0.85' },
                  { id: 'dec_2m9k1L', time: '09:42:10', type: 'Refund Req', action: 'Auto-Approved', status: 'ADMISSIBLE', u: '0.62' },
                  { id: 'dec_p49vX1', time: '09:15:05', type: 'Bulk Order', action: 'Escalated', status: 'REJECTED', u: '0.12' },
                  { id: 'dec_b72nC9', time: '08:50:33', type: 'Price Query', action: 'Info Provided', status: 'ADMISSIBLE', u: '0.45' },
                  { id: 'dec_x83mK2', time: '08:22:11', type: 'Negotiation', action: 'Counter-Offer', status: 'ADMISSIBLE', u: '0.78' },
                  { id: 'dec_a19dL5', time: '07:59:45', type: 'Negotiation', action: 'Declined (Margin)', status: 'REJECTED', u: '0.21' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{row.time}</td>
                    <td className="px-6 py-4 font-mono text-xs text-[var(--color-electric-violet)]">{row.id}</td>
                    <td className="px-6 py-4 text-white/90">{row.type}</td>
                    <td className="px-6 py-4 text-white/90">{row.action}</td>
                    <td className="px-6 py-4">
                      <Badge variant={row.status === 'ADMISSIBLE' ? 'success' : 'destructive'} className="text-[10px] px-2 py-0 h-5">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-white/90">{row.u}</td>
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
