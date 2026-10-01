'use client';

import React from 'react';
import {
  Cpu,
  GraduationCap,
  Briefcase,
  ShieldCheck,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function WorkHeroHUD() {
  return (
    <section className="relative pt-24 pb-14 overflow-hidden border-b border-line/60">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-8">
        
        {/* Top Telemetry Path & Status Tag */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-muted">
              <span className="text-bone">02 // CAREER &amp; EDUCATION</span>
              <span className="text-line">/</span>
              <span className="text-ember">EXPERIENCE PATHWAY</span>
            </div>

            {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-line font-mono text-xs text-bone-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>AI &amp; Machine Learning Engineering</span>
            </div> */}
          </div>
        </ScrollReveal>

        {/* Main Title & Description */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-bone tracking-tight leading-[1.12]">
              Experience &amp; Background
            </h1>
            <p className="text-bone-dim text-base sm:text-lg leading-relaxed max-w-2xl">
              AI Engineer with experience in frontier LLM evaluation, golden benchmark datasets, computer vision, and machine learning systems.
            </p>
          </div>
        </ScrollReveal>

        {/* Grounded Experience Highlights Grid */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            
            {/* Card 1: Handshake AI */}
            <div className="rounded-xl border border-line bg-surface p-5 shadow-panel flex flex-col justify-between hover:border-line/80 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-ink border border-line flex items-center justify-center text-bone">
                  <Cpu className="w-4 h-4 text-bone-dim" />
                </div>
                <span className="font-mono text-[0.65rem] text-muted uppercase font-semibold">AI Engineering</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-bone">Handshake AI</p>
                <p className="font-mono text-xs text-muted mt-1">LLM Eval &amp; Nemotron-12B</p>
              </div>
            </div>

            {/* Card 2: Verizon */}
            <div className="rounded-xl border border-line bg-surface p-5 shadow-panel flex flex-col justify-between hover:border-line/80 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-ink border border-line flex items-center justify-center text-bone">
                  <Briefcase className="w-4 h-4 text-bone-dim" />
                </div>
                <span className="font-mono text-[0.65rem] text-muted uppercase font-semibold">Project Engineering</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-bone">Verizon</p>
                <p className="font-mono text-xs text-muted mt-1">Computer Vision &amp; OpenCV</p>
              </div>
            </div>

            {/* Card 3: UC San Diego */}
            <div className="rounded-xl border border-line bg-surface p-5 shadow-panel flex flex-col justify-between hover:border-line/80 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-ink border border-line flex items-center justify-center text-bone">
                  <GraduationCap className="w-4 h-4 text-bone-dim" />
                </div>
                <span className="font-mono text-[0.65rem] text-muted uppercase font-semibold">Academic Foundation</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-bone">UC San Diego</p>
                <p className="font-mono text-xs text-muted mt-1">B.S. Cognitive Science (ML)</p>
              </div>
            </div>

            {/* Card 4: Technical Credentials */}
            <div className="rounded-xl border border-line bg-surface p-5 shadow-panel flex flex-col justify-between hover:border-line/80 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-ink border border-line flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-mono text-[0.65rem] text-muted uppercase font-semibold">Specializations</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-bone">Certifications</p>
                <p className="font-mono text-xs text-muted mt-1">MCP, MLOps &amp; Python</p>
              </div>
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
