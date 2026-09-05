"use client";
import React, { useEffect, useRef } from "react";

export function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Advanced multi-tier particle telemetry nodes
    const particleCount = 42;
    const particles = Array.from({ length: particleCount }, (_, idx) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: idx % 6 === 0 ? 2.6 : Math.random() * 1.5 + 0.8,
      color: idx % 3 === 0
        ? "rgba(139, 92, 246, 0.6)" // Agent Violet
        : idx % 3 === 1
        ? "rgba(6, 182, 212, 0.5)"  // Cyan Packet
        : "rgba(16, 185, 129, 0.45)", // Emerald Verified Node
      glow: idx % 6 === 0,
      pulse: Math.random() * Math.PI,
    }));

    let scanY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle horizontal cyber telemetry scanline
      scanY = (scanY + 0.8) % height;
      const scanGrad = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      scanGrad.addColorStop(0, "rgba(124, 58, 237, 0)");
      scanGrad.addColorStop(0.5, "rgba(124, 58, 237, 0.04)");
      scanGrad.addColorStop(1, "rgba(124, 58, 237, 0)");
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 30, width, 60);

      // Draw particle connections
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 140) * 0.22;
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = dist < 70 ? 1.2 : 0.8;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dynamicR = p.radius + Math.sin(p.pulse) * 0.4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, dynamicR), 0, Math.PI * 2);
        ctx.fillStyle = p.color;

        if (p.glow) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
    />
  );
}
