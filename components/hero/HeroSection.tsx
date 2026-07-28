'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const Hero3DCanvas = dynamic(() => import('./Hero3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[320px] flex items-center justify-center">
      <div className="flex items-center gap-2 font-mono text-xs text-muted">
        <span className="h-2 w-2 animate-ping rounded-full bg-ember" />
        loading 3D scene...
      </div>
    </div>
  ),
});

export default function HeroSection() {
  const [terminalLineIndex, setTerminalLineIndex] = useState(0);

  const terminalLines = [
    '$ python3 -m pipeline.train --model xgboost',
    '-> Loading 50,000+ scraped records from PostgreSQL...',
    '-> Evaluating validation ROC-AUC: 0.942',
    '-> Deploying real-time inference API endpoint...',
    '✓ System ready at https://api.ishaankoradia.com',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTerminalLineIndex((prev) => (prev + 1) % terminalLines.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [terminalLines.length]);

  return (
    <section className="relative isolate overflow-hidden pt-28 lg:pt-24 lg:pb-24 pb-16 min-h-dvh flex items-center">
      
      {/* Ember Glow Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 -z-10 h-[42rem] w-[42rem] -translate-y-1/2 translate-x-1/3 rounded-full bg-ember/10 blur-[140px]"
      />

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        
        {/* Left Column: Text & Terminal Box matching sunnypatel.net */}
        <div>
          {/* Status Badge */}
          <div className="flex items-center gap-3 font-mono text-xs text-muted">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-ember" />
            </span>
            <span>Open to data science & software roles</span>
          </div>

          {/* Main Headline */}
          <h1 className="mt-7 text-balance font-display text-[2.8rem] sm:text-[3.8rem] lg:text-[4.5rem] font-semibold leading-[0.98] tracking-[-0.035em] text-bone">
            I build data products, analytics & models from screen to <span className="text-ember">systems.</span>
          </h1>

          {/* Bio text */}
          <p className="mt-7 max-w-md text-[1.02rem] sm:text-lg leading-relaxed text-bone-dim">
            I build full-stack data software <em className="font-medium not-italic text-ember">people actually use</em>, from automated scraping pipelines and ML recommenders down to interactive 3D web visualizations.
          </p>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-md border border-ember/50 bg-ember/10 px-5 py-3 text-sm text-bone transition-colors duration-300 hover:border-ember hover:bg-ember/20"
            >
              <span>See the work</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/resume"
              className="group inline-flex items-center gap-1.5 px-2 py-3 text-sm text-muted transition-colors hover:text-bone"
            >
              <span>Résumé</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Terminal Session Card matching sunnypatel.net */}
          <div className="mt-10 max-w-sm">
            <div className="rounded-xl border border-line bg-surface/70 p-4 font-mono text-[0.74rem] leading-relaxed shadow-panel backdrop-blur-sm">
              <div className="mb-3 flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#262b30]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#262b30]" />
                <span className="h-2.5 w-2.5 rounded-full bg-ember/70" />
                <span className="ml-2 text-[0.65rem] uppercase tracking-[0.2em] text-muted">session</span>
              </div>
              <div className="overflow-hidden space-y-1">
                <p className="text-bone flex items-center gap-1.5 truncate">
                  <span className="text-ember font-bold">&gt;</span>
                  <span>{terminalLines[terminalLineIndex]}</span>
                  <span className="inline-block h-3.5 w-[0.5ch] animate-pulse bg-ember" />
                </p>
                <p className="text-muted text-[0.68rem] truncate">
                  {terminalLines[(terminalLineIndex + 1) % terminalLines.length]}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive 3D WebGL Canvas */}
        <div className="relative h-[380px] sm:h-[480px] lg:h-[540px] w-full rounded-2xl border border-line/60 bg-surface/40 overflow-hidden shadow-float">
          <Hero3DCanvas />
        </div>

      </div>
    </section>
  );
}
