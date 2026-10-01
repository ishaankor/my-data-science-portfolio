'use client';

import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ProjectsHeroHUD() {
  return (
    <section className="relative pt-24 pb-14 overflow-hidden border-b border-line/60">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-8">
        
        {/* Top Telemetry Path */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-muted">
              <span className="text-bone">01 // PROJECT BUILDS</span>
              <span className="text-line">/</span>
              <span className="text-ember">FEATURED HIGHLIGHTS</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Title & Description */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-bone tracking-tight leading-[1.12]">
              Things I&apos;ve built, end to end.
            </h1>
            <p className="text-bone-dim text-base sm:text-lg leading-relaxed max-w-2xl">
              Production AI applications, agentic platforms, and automation systems shipped and documented end-to-end.
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
