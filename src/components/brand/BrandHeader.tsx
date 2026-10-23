"use client";

import { ShieldCheck, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";
import React from "react";
import { AnimatedLogoReveal } from "./AnimatedLogoReveal";

export function BrandHeader() {
  return (
    <header className="w-full border-b border-subtle bg-brand-obsidian/80 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <AnimatedLogoReveal variant="full" />
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-pill bg-brand-obsidian border border-subtle text-xs font-mono text-brand-gray-400">
            <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            <span>YT-DLP 2026.3 • SUPABASE SECURE</span>
          </div>

          <a
            href="https://github.com/migu3lls/yt_downloader"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-pill text-xs font-medium bg-white/5 hover:bg-white/10 text-white border border-subtle transition-all duration-200"
          >
            <Terminal className="w-3.5 h-3.5 text-brand-green" />
            <span className="hidden md:inline">Open Source</span>
          </a>
        </div>
      </div>
    </header>
  );
}
