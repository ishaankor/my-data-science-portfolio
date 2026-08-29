'use client';

import React from 'react';
import {
  Terminal,
  Cpu,
  Layers,
  GraduationCap,
  Code2,
  Sparkles,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function WorkHeroHUD({
  isTerminalMode,
  setIsTerminalMode,
}: {
  isTerminalMode: boolean;
  setIsTerminalMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}) {
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
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-bone">02 // CAREER MATRIX & SYSTEM EXPERIENCE</span>
              <span className="text-line">/</span>
              <span className="text-ember">PRODUCTION VERIFIED</span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 font-mono text-xs text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>Available for AI/ML Engineering</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Title & Description with Action Button & Speech Bubble */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-bone tracking-tight leading-[1.12]">
              Work & Systems Engineering
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <p className="text-bone-dim text-base sm:text-lg leading-relaxed max-w-2xl">
                AI Engineer specializing in frontier LLM evaluation, agentic reflection workflows, Model Context Protocol (MCP) integrations, and high-throughput data science pipelines.
              </p>
              
              <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                {/* Speech Bubble Callout pointing right toward the button */}
                <div className="hidden sm:inline-flex relative items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-[0.7rem] font-medium text-indigo-200 shadow-panel backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{isTerminalMode ? 'CLI Active' : 'Try CLI Mode!'}</span>
                  {/* Right-pointing speech bubble arrow */}
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-950/90 border-r border-t border-indigo-500/30 rotate-45" />
                </div>

                <button
                  onClick={() => setIsTerminalMode((prev) => !prev)}
                  className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${
                    isTerminalMode
                      ? 'bg-indigo-500/20 border-indigo-500 text-bone shadow-md shadow-indigo-500/20'
                      : 'bg-surface border-line text-muted hover:border-indigo-500/50 hover:text-bone hover:shadow-md hover:shadow-indigo-500/10'
                  }`}
                  title="Toggle interactive developer terminal mode"
                >
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span>{isTerminalMode ? 'Exit CLI Mode' : 'CLI Terminal Mode'}</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Telemetry Metrics HUD Grid */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            
            {/* Card 1: Degree & GPA */}
            <div className="rounded-xl border border-line bg-surface/70 p-5 shadow-panel flex flex-col justify-between hover:border-cyan-500/40 transition-colors">
              <div className="flex items-center justify-between text-cyan-400 mb-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="font-mono text-[0.65rem] text-cyan-400/80 uppercase font-semibold">UCSD Honors</span>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-bone">3.76</p>
                <p className="font-mono text-xs text-muted mt-1">B.S. Cognitive Science (ML)</p>
              </div>
            </div>

            {/* Card 2: Model Evaluation & Handshake/NVIDIA */}
            <div className="rounded-xl border border-line bg-surface/70 p-5 shadow-panel flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
              <div className="flex items-center justify-between text-indigo-400 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="font-mono text-[0.65rem] text-indigo-400/80 uppercase font-semibold">Frontier AI</span>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-bone">300+</p>
                <p className="font-mono text-xs text-muted mt-1">Tuning Strategies (~95% Acc)</p>
              </div>
            </div>

            {/* Card 3: Agentic Scale (Datafy!) */}
            <div className="rounded-xl border border-line bg-surface/70 p-5 shadow-panel flex flex-col justify-between hover:border-ember/40 transition-colors">
              <div className="flex items-center justify-between text-ember mb-3">
                <div className="w-8 h-8 rounded-lg bg-ember/10 border border-ember/20 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-ember" />
                </div>
                <span className="font-mono text-[0.65rem] text-ember/80 uppercase font-semibold">Datafy! Agent</span>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-bone">25k+</p>
                <p className="font-mono text-xs text-muted mt-1">Weekly Requests (~99% Clean)</p>
              </div>
            </div>

            {/* Card 4: Discord Bot Community Scale */}
            <div className="rounded-xl border border-line bg-surface/70 p-5 shadow-panel flex flex-col justify-between hover:border-purple-500/40 transition-colors">
              <div className="flex items-center justify-between text-purple-400 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-purple-400" />
                </div>
                <span className="font-mono text-[0.65rem] text-purple-400/80 uppercase font-semibold">Scale</span>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-bone">10k+</p>
                <p className="font-mono text-xs text-muted mt-1">Users on Transformi! ML</p>
              </div>
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
