"use client";
import React, { useEffect, useState } from 'react';

interface BuildathonIntroLoaderProps {
  onComplete?: () => void;
}

export function BuildathonIntroLoader({ onComplete }: BuildathonIntroLoaderProps) {
  const [displayText, setDisplayText] = useState("");
  const [isResolved, setIsResolved] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSlidingUp, setIsSlidingUp] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const targetText = "megavarshan / vimmerse";

  useEffect(() => {
    let index = 0;
    let timer: NodeJS.Timeout;

    // Steady, authentic typewriter typing speed
    const typingInterval = setInterval(() => {
      index++;
      setDisplayText(targetText.slice(0, index));
      
      const currentPct = Math.min(100, Math.round((index / targetText.length) * 100));
      setProgress(currentPct);

      if (index >= targetText.length) {
        clearInterval(typingInterval);
        setIsResolved(true);

        // Hold smoothly for 500ms after finishing typing, then slide up from bottom to top
        timer = setTimeout(() => {
          setIsSlidingUp(true);

          setTimeout(() => {
            setIsDone(true);
            if (onComplete) onComplete();
          }, 800);
        }, 550);
      }
    }, 75); // 75ms per character — smooth, deliberate, authentic cadence

    return () => {
      clearInterval(typingInterval);
      clearTimeout(timer);
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07070a] text-white transition-transform duration-800 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        isSlidingUp ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* Background Cybernetic Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.12),transparent_70%)]" />
      
      {/* Fine grid lines like razorpay buildathon */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "32px 32px"
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Terminal Header tag */}
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10 text-[11px] font-mono tracking-widest text-violet-300/80 uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span>INITIALIZING COMMERCE RUNTIME</span>
        </div>

        {/* Clean Typewriter Text Display */}
        <div className="text-2xl sm:text-4xl md:text-5xl font-mono font-bold tracking-wider sm:tracking-widest flex items-center select-none min-h-[3.5rem]">
          {(() => {
            const slashIndex = displayText.indexOf("/");
            if (slashIndex === -1) {
              return (
                <span className="text-zinc-400 font-light">
                  {displayText}
                </span>
              );
            }
            const beforeSlash = displayText.slice(0, slashIndex).trimEnd();
            const afterSlash = displayText.slice(slashIndex + 1).trimStart();
            return (
              <>
                <span className="text-zinc-400 font-light">{beforeSlash}</span>
                <span className={`mx-2 sm:mx-3 font-normal transition-all duration-300 ${
                  isResolved ? "text-violet-400 drop-shadow-[0_0_12px_rgba(139,92,246,0.8)]" : "text-violet-500"
                }`}>
                  /
                </span>
                <span className={`font-black transition-colors duration-300 ${
                  isResolved ? "text-white drop-shadow-[0_0_20px_rgba(167,139,250,0.5)]" : "text-zinc-100"
                }`}>
                  {afterSlash}
                </span>
              </>
            );
          })()}

          {/* Monospace Blinking Cursor */}
          <span className="inline-block w-2 sm:w-2.5 h-6 sm:h-8 ml-2 bg-violet-400 animate-[pulse_0.6s_infinite] align-middle" />
        </div>

        {/* Progress & Status Line */}
        <div className="mt-8 flex flex-col items-center gap-2 font-mono text-xs text-zinc-400">
          <div className="w-48 sm:w-64 h-1 bg-zinc-800/80 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between w-48 sm:w-64 text-[10px] text-zinc-500">
            <span>PRISM KERNEL</span>
            <span className="font-semibold text-violet-400">{progress}%</span>
          </div>
        </div>

        {/* Subtle replay button once loaded in case user wants to see it again */}
        <p className="mt-6 text-[11px] font-sans text-zinc-600 tracking-wide">
          Every payment deserves intelligence before execution
        </p>
      </div>

      {/* Upward shutter reveal bottom bar indicator */}
      <div className="absolute bottom-6 font-mono text-[10px] text-zinc-600 tracking-widest uppercase flex items-center gap-2">
        <span className="inline-block animate-bounce">▲</span>
        <span>OPENING DASHBOARD</span>
      </div>
    </div>
  );
}
