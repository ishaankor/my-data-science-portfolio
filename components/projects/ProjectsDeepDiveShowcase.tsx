'use client';

import React from 'react';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ProjectsDeepDiveShowcase() {
  return (
    <div className="space-y-24 mb-16">
      
      {/* Top Section Header */}
      <ScrollReveal direction="up" delay={0.05}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-muted">
            <span className="text-bone">01 // PROJECT BUILDS</span>
            <span className="text-line">/</span>
            <span className="text-ember">FEATURED HIGHLIGHTS</span>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1}>
        <div className="space-y-4">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-bone tracking-tight leading-[1.08] sm:whitespace-nowrap">
            Things I&apos;ve built, end to end.
          </h2>

          <p className="text-bone-dim text-base sm:text-lg leading-relaxed max-w-2xl">
            Production AI applications, agentic platforms, and automation systems shipped and documented end-to-end.
          </p>
        </div>
      </ScrollReveal>

      {/* Project Rows */}
      <div className="space-y-28">

        {/* ---------------- PROJECT 01: DATAFY (Interactive Web Data Canvas) ---------------- */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Real Web Product Preview Frame */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <a
                href="https://datafy.ishaankoradia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-line/80 bg-ink/95 shadow-2xl overflow-hidden group hover:border-ember/60 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Window Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#0d131f] border-b border-line/60">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-2 bg-ink/70 px-3 py-1 rounded-md border border-line/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/favicons/datafy.png" alt="Datafy Favicon" className="w-3.5 h-3.5 rounded-sm shrink-0 object-contain" />
                    <span className="font-mono text-[0.7rem] text-muted group-hover:text-ember transition-colors flex items-center gap-1">
                      datafy.ishaankoradia.com
                      <ExternalLink className="w-2.5 h-2.5 inline" />
                    </span>
                  </div>
                  <div className="w-6" />
                </div>

                {/* Real High-Resolution Project Photo */}
                <div className="relative overflow-hidden bg-ink aspect-[16/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/favicons/datafy-cover.png"
                    alt="Datafy! Editorial AI Data Canvas"
                    className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </a>
            </div>

            {/* Content Details Right */}
            <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
              <div className="font-mono text-xs text-muted flex items-center gap-3">
                <span className="font-bold text-bone">01</span>
                <span>2026</span>
                <span className="text-muted/60">—</span>
                <span className="text-bone-dim">AI Data Canvas</span>
              </div>

              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/favicons/datafy.png" alt="Datafy" className="w-8 h-8 rounded-lg border border-line/80 p-0.5 bg-surface shrink-0" />
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-bone tracking-tight">
                  Datafy AI Copilot
                </h3>
              </div>

              <p className="font-mono text-xs text-muted">
                AI data canvas for deep research &amp; interactive charts
              </p>

              <p className="text-bone-dim text-sm sm:text-[0.95rem] leading-relaxed">
                AI data canvas transforming CSV uploads into interactive charts, statistical grids, and executive briefs with instant schema inferencing and an inline AI assistant.
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {['Next.js', 'TypeScript', 'FastAPI', 'PostgreSQL RLS', 'Recharts', 'AI Curator'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-surface border border-line text-bone-dim text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-6 pt-3 font-mono text-xs">
                <a
                  href="https://datafy.ishaankoradia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember hover:underline font-semibold inline-flex items-center gap-1.5 group"
                >
                  <span>Live App</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="https://github.com/ishaankor/Datafy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-bone transition-colors inline-flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source</span>
                </a>

                <a
                  href="https://datafy.ishaankoradia.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-bone transition-colors inline-flex items-center gap-1"
                >
                  <span>Docs</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </ScrollReveal>


        {/* ---------------- PROJECT 02: RIGSCOUTER-AI (Real Landing Page Right) ---------------- */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Content Details Left */}
            <div className="lg:col-span-6 space-y-5">
              <div className="font-mono text-xs text-muted flex items-center gap-3">
                <span className="font-bold text-bone">02</span>
                <span>2026</span>
                <span className="text-muted/60">—</span>
                <span className="text-bone-dim">Deal Intelligence</span>
              </div>

              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/favicons/rigscouter.png" alt="RigScouter-AI" className="w-8 h-8 rounded-lg border border-line/80 p-0.5 bg-surface shrink-0" />
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-bone tracking-tight">
                  RigScouter-AI Deal Intelligence
                </h3>
              </div>

              <p className="font-mono text-xs text-muted">
                Autonomous PC hardware deal scouting &amp; real-time SSE price radar
              </p>

              <p className="text-bone-dim text-sm sm:text-[0.95rem] leading-relaxed">
                Autonomous hardware deal intelligence engine combining multi-retailer web scraping across Amazon and eBay, real-time Server-Sent Events (SSE) price feeds, and algorithmic Groq AI deal scoring.
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {['Next.js 15', 'TypeScript', 'Supabase RLS', 'Prisma', 'Groq AI', 'SSE Radar', 'Multi-Scraper'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-surface border border-line text-bone-dim text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-6 pt-3 font-mono text-xs">
                <a
                  href="https://github.com/ishaankor/RigScouter-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember hover:underline font-semibold inline-flex items-center gap-1.5 group"
                >
                  <span>Source Code</span>
                  <Github className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="https://github.com/ishaankor/RigScouter-AI#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-bone transition-colors inline-flex items-center gap-1"
                >
                  <span>Docs</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Real Project Landing Page Frame Right */}
            <div className="lg:col-span-6">
              <a
                href="https://github.com/ishaankor/RigScouter-AI"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-line/80 bg-ink/95 shadow-2xl overflow-hidden group hover:border-cyan-500/60 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Window Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#0d131f] border-b border-line/60">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-2 bg-ink/70 px-3 py-1 rounded-md border border-line/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/favicons/rigscouter.png" alt="RigScouter Favicon" className="w-3.5 h-3.5 rounded-sm shrink-0 object-contain" />
                    <span className="font-mono text-[0.7rem] text-muted group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                      rigscouter.ishaankoradia.com
                      <ExternalLink className="w-2.5 h-2.5 inline" />
                    </span>
                  </div>
                  <div className="w-6" />
                </div>

                {/* Real Landing Page Photo */}
                <div className="relative overflow-hidden bg-ink aspect-[16/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/favicons/rigscouter-cover.png"
                    alt="RigScouter-AI Autonomous Hardware Deal Intelligence"
                    className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </a>
            </div>

          </div>
        </ScrollReveal>


        {/* ---------------- PROJECT 03: ISHAANBOT MCP (Real Landing Page Left) ---------------- */}
        <ScrollReveal direction="up" delay={0.25}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Real Project Landing Page Frame Left */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <a
                href="https://ishaankoradia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-line/80 bg-ink/95 shadow-2xl overflow-hidden group hover:border-ember/60 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Window Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#0d131f] border-b border-line/60">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center gap-2 bg-ink/70 px-3 py-1 rounded-md border border-line/50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/favicons/mcp-favicon.svg" alt="Model Context Protocol Favicon" className="w-3.5 h-3.5 rounded-sm shrink-0 object-contain" />
                    <span className="font-mono text-[0.7rem] text-muted group-hover:text-ember transition-colors flex items-center gap-1">
                      ishaankoradia.com
                      <ExternalLink className="w-2.5 h-2.5 inline" />
                    </span>
                  </div>
                  <div className="w-6" />
                </div>

                {/* Real Landing Page Workspace Photo */}
                <div className="relative overflow-hidden bg-ink aspect-[16/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/favicons/mcp-cover.png"
                    alt="Model Context Protocol AI Assistant Workspace"
                    className="w-full h-full object-cover object-center transform group-hover:scale-[1.03] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
                </div>
              </a>
            </div>

            {/* Content Details Right */}
            <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
              <div className="font-mono text-xs text-muted flex items-center gap-3">
                <span className="font-bold text-bone">03</span>
                <span>2025</span>
                <span className="text-muted/60">—</span>
                <span className="text-bone-dim">Agentic Assistant</span>
              </div>

              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/favicons/mcp-favicon.svg" alt="Model Context Protocol" className="w-8 h-8 rounded-lg border border-line/80 p-0.5 bg-surface shrink-0" />
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-bone tracking-tight">
                  IshaanBot MCP AI Assistant
                </h3>
              </div>

              <p className="font-mono text-xs text-muted">
                Modular LLM assistant &amp; systems platform powered by MCP
              </p>

              <p className="text-bone-dim text-sm sm:text-[0.95rem] leading-relaxed">
                Agentic digital twin powered by Model Context Protocol (MCP) with 15+ composable tools, FastAPI streaming inference, RAG memory, and live Spotify playback telemetry.
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {['Model Context Protocol', 'FastAPI', 'Python', 'Docker', 'Gemini API', 'RAG Memory', 'Spotify API'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-surface border border-line text-bone-dim text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-6 pt-3 font-mono text-xs">
                <a
                  href="https://ishaankoradia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember hover:underline font-semibold inline-flex items-center gap-1.5 group"
                >
                  <span>Live App</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="https://github.com/ishaankor/my-personal-website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-bone transition-colors inline-flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source</span>
                </a>

                <a
                  href="https://github.com/ishaankor/my-personal-website#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-bone transition-colors inline-flex items-center gap-1"
                >
                  <span>Docs</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

          </div>
        </ScrollReveal>

      </div>

    </div>
  );
}
