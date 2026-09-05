import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "megavarshan / vimmerse — Agentic Commerce Intelligence Platform",
  description: "Autonomous AI Merchant Agent Infrastructure with PRISM Cognitive Decision Architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#08090d] selection:bg-violet-500/30 selection:text-violet-200">
      <body
        className={`${inter.variable} ${mono.variable} antialiased bg-[#08090d] text-zinc-100 font-sans tracking-tight`}
      >
        {children}
      </body>
    </html>
  );
}
