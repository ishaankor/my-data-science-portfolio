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
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-ember/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-8">
        
        {/* Top Telemetry Path & Status Tag */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-muted">
              <span className="text-bone">02 // CAREER &amp; EDUCATION</span>
              <span className="text-line">/</span>
              <span className="text-ember">EXPERIENCE PATHWAY</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-line font-mono text-xs text-bone-dim">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>AI &amp; Machine Learning Engineering</span>
            </div>
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
            <div className="rounded-xl border border-line bg-surface/70 p-5 shadow-panel flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center justify-between text-indigo-400 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="font-mono text-[0.65rem] text-indigo-400/80 uppercase font-semibold">AI Engineering</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-bone">Handshake AI</p>
                <p className="font-mono text-xs text-muted mt-1">LLM Eval &amp; Nemotron-12B</p>
              </div>
            </div>

            {/* Card 2: Verizon */}
            <div className="rounded-xl border border-line bg-surface/70 p-5 shadow-panel flex flex-col justify-between hover:border-amber-500/40 transition-colors">
              <div className="flex items-center justify-between text-amber-400 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-amber-400" />
                </div>
                <span className="font-mono text-[0.65rem] text-amber-400/80 uppercase font-semibold">Project Engineering</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-bone">Verizon</p>
                <p className="font-mono text-xs text-muted mt-1">Computer Vision &amp; OpenCV</p>
              </div>
            </div>

            {/* Card 3: UC San Diego */}
            <div className="rounded-xl border border-line bg-surface/70 p-5 shadow-panel flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between text-cyan-400 mb-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="font-mono text-[0.65rem] text-cyan-400/80 uppercase font-semibold">Academic Foundation</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-bone">UC San Diego</p>
                <p className="font-mono text-xs text-muted mt-1">B.S. Cognitive Science (ML)</p>
              </div>
            </div>

            {/* Card 4: Technical Credentials */}
            <div className="rounded-xl border border-line bg-surface/70 p-5 shadow-panel flex flex-col justify-between hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between text-emerald-400 mb-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-mono text-[0.65rem] text-emerald-400/80 uppercase font-semibold">Specializations</span>
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
