'use client';

import React, { useState } from 'react';
import { ExternalLink, Github, ArrowUpRight, Cpu, ChevronDown } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import LiveProjectPreview from './LiveProjectPreview';
import ProjectArchitectureDrawer, {
  FLAGSHIP_BLUEPRINTS,
} from './ProjectArchitectureDrawer';

type FlagshipId = 'datafy' | 'rigscouter' | 'ishaanbot';

export default function ProjectsDeepDiveShowcase() {
  const [openArch, setOpenArch] = useState<Record<FlagshipId, boolean>>({
    datafy: false,
    rigscouter: false,
    ishaanbot: false,
  });

  const toggleArch = (id: FlagshipId) => {
    setOpenArch((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-20">
      {/* ---------------- PROJECT 01: DATAFY (Interactive Web Data Canvas) ---------------- */}
      <ScrollReveal direction="up" delay={0.15}>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Real Web Product Preview Frame */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <a
                href="https://datafy.ishaankoradia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-line/80 bg-ink/95 shadow-2xl overflow-hidden group hover:border-orange-500/60 transition-all duration-300 transform hover:-translate-y-1"
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
                    <img
                      src="/favicons/datafy.png"
                      alt="Datafy Favicon"
                      className="w-3.5 h-3.5 rounded-sm shrink-0 object-contain"
                    />
                    <span className="font-mono text-[0.7rem] text-muted group-hover:text-orange-400 transition-colors flex items-center gap-1">
                      datafy.ishaankoradia.com
                      <ExternalLink className="w-2.5 h-2.5 inline" />
                    </span>
                  </div>
                  <div className="w-6" />
                </div>

                {/* Live Dynamic Landing Page Viewport */}
                <div className="relative overflow-hidden bg-ink aspect-[16/9]">
                  <LiveProjectPreview
                    liveUrl="https://datafy.ishaankoradia.com"
                    title="Datafy"
                    aspectRatio="16/9"
                  />
                </div>
              </a>
            </div>

            {/* Content Details Right */}
            <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-xs text-muted flex items-center gap-3">
                  <span className="font-bold text-bone">01</span>
                  <span>2026</span>
                  <span className="text-muted/60">—</span>
                  <span className="text-bone-dim">AI-Assisted Canvas</span>
                </div>

                {/* Quantitative Statistic Tag */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-orange-500/10 text-orange-300 border border-orange-500/25 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                  <span>+25,000 weekly requests</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/favicons/datafy.png"
                  alt="Datafy"
                  className="w-8 h-8 rounded-lg border border-line/80 p-0.5 bg-surface shrink-0"
                />
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-bone tracking-tight">
                  Datafy.
                </h3>
              </div>

              <p className="font-mono text-xs text-muted">
                AI data canvas for deep research &amp; interactive charts
              </p>

              <p className="text-bone-dim text-sm sm:text-[0.95rem] leading-relaxed">
                AI data canvas transforming CSV uploads into interactive charts, statistical grids, and executive briefs via a single-pass LangGraph execution node and sandboxed Python REPL.
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {[
                  'React & TypeScript',
                  'FastAPI',
                  'LangGraph',
                  'Pandas REPL',
                  'Recharts',
                  'OpenRouter Failover',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-surface border border-line text-bone-dim text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Links + Architecture Toggle */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-3 font-mono text-xs">
                <a
                  href="https://datafy.ishaankoradia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:underline font-semibold inline-flex items-center gap-1.5 group"
                >
                  <span>Live App</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <button
                  type="button"
                  onClick={() => toggleArch('datafy')}
                  aria-expanded={openArch.datafy}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${openArch.datafy
                    ? 'border-orange-400/70 bg-orange-500/15 text-bone font-semibold'
                    : 'border-line bg-surface hover:border-orange-500/50 text-bone-dim hover:text-bone'
                    }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
                  <span>Architecture &amp; Tradeoffs</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${openArch.datafy ? 'rotate-180 text-orange-400' : 'text-muted'
                      }`}
                    aria-hidden="true"
                  />
                </button>

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

          <ProjectArchitectureDrawer
            isOpen={openArch.datafy}
            blueprint={FLAGSHIP_BLUEPRINTS.datafy}
          />
        </div>
      </ScrollReveal>

      {/* Subtle Line Break between Project 01 & 02 */}
      <div className="relative py-2 sm:py-4" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-line/80 to-transparent w-full" />
      </div>

      {/* ---------------- PROJECT 02: RIGSCOUTER-AI (Real Landing Page Right with Animated Live Ticker) ---------------- */}
      <ScrollReveal direction="up" delay={0.2}>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Content Details Left */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-xs text-muted flex items-center gap-3">
                  <span className="font-bold text-bone">02</span>
                  <span>2026</span>
                  <span className="text-muted/60">—</span>
                  <span className="text-bone-dim">Deal Intelligence</span>
                </div>

                {/* Quantitative Statistic Tag */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>&lt; 20ms real-time deal latency</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/favicons/rigscouter.png"
                  alt="RigScouter-AI"
                  className="w-8 h-8 rounded-lg border border-line/80 p-0.5 bg-surface shrink-0 object-contain"
                />
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-bone tracking-tight">
                  RigScouter-AI
                </h3>
              </div>

              <p className="font-mono text-xs text-muted">
                Autonomous PC hardware deal scouting &amp; real-time SSE price radar
              </p>

              <p className="text-bone-dim text-sm sm:text-[0.95rem] leading-relaxed">
                Autonomous hardware deal intelligence engine combining multi-retailer web scraping across Amazon and eBay, canonical silicon SKU normalization, Server-Sent Events (SSE) price feeds, and quantitative 0–100 Groq AI deal scoring.
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {[
                  'Next.js 15',
                  'TypeScript',
                  'Supabase RLS',
                  'Prisma',
                  'Groq AI',
                  'SSE Radar',
                  'Multi-Scraper',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-surface border border-line text-bone-dim text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Links + Architecture Toggle */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-3 font-mono text-xs">
                <a
                  href="https://rigscouter.ishaankoradia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline font-semibold inline-flex items-center gap-1.5 group"
                >
                  <span>Live App</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <button
                  type="button"
                  onClick={() => toggleArch('rigscouter')}
                  aria-expanded={openArch.rigscouter}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${openArch.rigscouter
                    ? 'border-cyan-400/70 bg-cyan-500/15 text-bone font-semibold'
                    : 'border-line bg-surface hover:border-cyan-500/50 text-bone-dim hover:text-bone'
                    }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>Architecture &amp; Tradeoffs</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${openArch.rigscouter ? 'rotate-180 text-cyan-400' : 'text-muted'
                      }`}
                    aria-hidden="true"
                  />
                </button>

                <a
                  href="https://github.com/ishaankor/RigScouter-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-bone transition-colors inline-flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source</span>
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

            {/* Real Project Landing Page Frame Right with Live Animated Ticker */}
            <div className="lg:col-span-6">
              <a
                href="https://rigscouter.ishaankoradia.com"
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
                    <img
                      src="/favicons/rigscouter.png"
                      alt="RigScouter Favicon"
                      className="w-3.5 h-3.5 rounded-sm shrink-0 object-contain"
                    />
                    <span className="font-mono text-[0.7rem] text-muted group-hover:text-cyan-400 transition-colors flex items-center gap-1">
                      rigscouter.ishaankoradia.com
                      <ExternalLink className="w-2.5 h-2.5 inline" />
                    </span>
                  </div>
                  <div className="w-6" />
                </div>

                {/* Live Dynamic Landing Page Viewport */}
                <div className="relative overflow-hidden bg-ink aspect-[16/9]">
                  <LiveProjectPreview
                    liveUrl="https://rigscouter.ishaankoradia.com"
                    title="RigScouter-AI"
                    aspectRatio="16/9"
                  />
                </div>
              </a>
            </div>
          </div>

          <ProjectArchitectureDrawer
            isOpen={openArch.rigscouter}
            blueprint={FLAGSHIP_BLUEPRINTS.rigscouter}
          />
        </div>
      </ScrollReveal>

      {/* Subtle Line Break between Project 02 & 03 */}
      <div className="relative py-2 sm:py-4" aria-hidden="true">
        <div className="h-px bg-gradient-to-r from-transparent via-line/80 to-transparent w-full" />
      </div>

      {/* ---------------- PROJECT 03: ISHAANBOT MCP (Real Landing Page Left) ---------------- */}
      <ScrollReveal direction="up" delay={0.25}>
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Real Project Landing Page Frame Left */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <a
                href="https://ishaankoradia.com?chat=open"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl border border-line/80 bg-ink/95 shadow-2xl overflow-hidden group hover:border-emerald-500/60 transition-all duration-300 transform hover:-translate-y-1"
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
                    <img
                      src="/favicons/favicon.ico"
                      alt="Model Context Protocol Favicon"
                      className="w-3.5 h-3.5 rounded-sm shrink-0 object-contain"
                    />
                    <span className="font-mono text-[0.7rem] text-muted group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                      ishaankoradia.com
                      <ExternalLink className="w-2.5 h-2.5 inline" />
                    </span>
                  </div>
                  <div className="w-6" />
                </div>

                {/* Live Dynamic Landing Page Viewport */}
                <div className="relative overflow-hidden bg-ink aspect-[16/9]">
                  <LiveProjectPreview
                    liveUrl="https://ishaankoradia.com?chat=open"
                    title="IshaanBot"
                    aspectRatio="16/9"
                  />
                </div>
              </a>
            </div>

            {/* Content Details Right */}
            <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-xs text-muted flex items-center gap-3">
                  <span className="font-bold text-bone">03</span>
                  <span>2025</span>
                  <span className="text-muted/60">—</span>
                  <span className="text-bone-dim">MCP Agent Platform</span>
                </div>

                {/* Quantitative Statistic Tag */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>15+ composable MCP tools</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/favicons/ishaanbot.png"
                  alt="IshaanBot"
                  className="w-8 h-8 rounded-lg border border-line/80 p-0.5 bg-surface shrink-0 object-contain"
                />
                <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-bone tracking-tight">
                  IshaanBot
                </h3>
              </div>

              <p className="font-mono text-xs text-muted">
                Modular LLM assistant &amp; systems platform powered by MCP
              </p>

              <p className="text-bone-dim text-sm sm:text-[0.95rem] leading-relaxed">
                Conversational AI assistant powered by Model Context Protocol (MCP) with 15+ composable tools, FastAPI streaming inference, grounded RAG memory, cascading Gemini failover, and live Spotify/GitHub telemetry.
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {[
                  'Model Context Protocol',
                  'FastAPI & FastMCP',
                  'Python',
                  'Docker',
                  'Gemini Cascade',
                  'RAG Memory',
                  'Spotify API',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-surface border border-line text-bone-dim text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Links + Architecture Toggle */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-3 font-mono text-xs">
                <a
                  href="https://ishaankoradia.com?chat=open"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1.5 group"
                >
                  <span>Live App</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <button
                  type="button"
                  onClick={() => toggleArch('ishaanbot')}
                  aria-expanded={openArch.ishaanbot}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${openArch.ishaanbot
                    ? 'border-emerald-400/70 bg-emerald-500/15 text-bone font-semibold'
                    : 'border-line bg-surface hover:border-emerald-500/50 text-bone-dim hover:text-bone'
                    }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>Architecture &amp; Tradeoffs</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${openArch.ishaanbot ? 'rotate-180 text-emerald-400' : 'text-muted'
                      }`}
                    aria-hidden="true"
                  />
                </button>

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

          <ProjectArchitectureDrawer
            isOpen={openArch.ishaanbot}
            blueprint={FLAGSHIP_BLUEPRINTS.ishaanbot}
          />
        </div>
      </ScrollReveal>
    </div>
  );
}
