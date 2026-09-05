"use client";
import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { NeuralCanvas } from '@/components/ui/NeuralCanvas';

export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#08090d] bg-cyber-grid text-zinc-100">
      {/* Animated canvas & radial gradient overlay */}
      <NeuralCanvas />
      <div className="fixed inset-0 bg-radial-gradient pointer-events-none z-0" />

      <Navbar />
      <div className="flex flex-1 relative z-10">
        <Sidebar />
        <main className="flex-1 p-5 md:p-8 overflow-y-auto h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}

