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
            <span className="text-ember">PRODUCTION SHIPPED</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 font-mono text-xs text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>Live Software Release Feed</span>
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
                  <span className="font-mono text-[0.7rem] text-muted group-hover:text-ember transition-colors flex items-center gap-1">
                    datafy.ishaankoradia.com
                    <ExternalLink className="w-2.5 h-2.5 inline" />
                  </span>
                  <div className="w-8" />
                </div>

                {/* Real High-Resolution Project Photo */}
                <div className="relative overflow-hidden bg-ink aspect-[16/9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="./images/datafy-photo.png"
                    alt="Datafy! Editorial AI Data Canvas"
                    className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-500"
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
                <span className="inline-flex items-center gap-1.5 text-ember font-medium">
                  <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
                  Actively maintained
                </span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-bone tracking-tight">
                Datafy AI Copilot
              </h3>

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

              {/* Badges / Metrics */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                <div className="px-3 py-1 rounded-md bg-ember/10 border border-ember/30 text-ember font-bold text-[11px]">
                  0ms Client Cold-Start
                </div>
                <div className="px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px]">
                  25,000+ weekly requests
                </div>
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


        {/* ---------------- PROJECT 02: TRANSFORMI (Real Thumbnail Right) ---------------- */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Content Details Left */}
            <div className="lg:col-span-6 space-y-5">
              <div className="font-mono text-xs text-muted flex items-center gap-3">
                <span className="font-bold text-bone">02</span>
                <span>2025</span>
                <span className="text-muted/60">—</span>
                <span className="inline-flex items-center gap-1.5 text-ember font-medium">
                  <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
                  Actively maintained
                </span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-bone tracking-tight">
                Transformi! ML Bot
              </h3>

              <p className="font-mono text-xs text-muted">
                Discord ML bot with parallelized async ETL pipelines
              </p>

              <p className="text-bone-dim text-sm sm:text-[0.95rem] leading-relaxed">
                Discord ML bot serving 10,000+ users. Fits regression models dynamically on user datasets and streams plots into chat with zero latency via asyncio worker pools.
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {['Python', 'asyncio', 'TensorFlow', 'scikit-learn', 'Discord API', 'Kaggle API'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-surface border border-line text-bone-dim text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Badges / Metrics */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                <div className="px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold text-[11px]">
                  10,000+ users served
                </div>
                <div className="px-3 py-1 rounded-md bg-ember/10 border border-ember/30 text-ember text-[11px]">
                  Parallelized async ETL
                </div>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-6 pt-3 font-mono text-xs">
                <a
                  href="https://github.com/ishaankor/Transformi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember hover:underline font-semibold inline-flex items-center gap-1.5 group"
                >
                  <span>Source Code</span>
                  <Github className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="https://github.com/ishaankor/Transformi#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-bone transition-colors inline-flex items-center gap-1"
                >
                  <span>Docs</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Real Project Thumbnail Frame Right */}
            <div className="lg:col-span-6">
              <a
                href="https://github.com/ishaankor/Transformi"
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
                  <span className="font-mono text-[0.7rem] text-muted group-hover:text-ember transition-colors flex items-center gap-1">
                    github.com/ishaankor/Transformi
                    <ExternalLink className="w-2.5 h-2.5 inline" />
                  </span>
                  <div className="w-8" />
                </div>

                {/* Real User Project Thumbnail */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950/40 via-surface to-ink aspect-[16/10] flex items-center justify-center p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="./images/transformi-photo.jpeg"
                    alt="Transformi! ML Discord Bot Mascot"
                    className="max-h-full w-auto object-contain rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </a>
            </div>

          </div>
        </ScrollReveal>


        {/* ---------------- PROJECT 03: DAILY MOTIVATION (Real Thumbnail Left) ---------------- */}
        <ScrollReveal direction="up" delay={0.25}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Real Project Thumbnail Frame Left */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <a
                href="https://github.com/ishaankor/daily-motivation"
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
                  <span className="font-mono text-[0.7rem] text-muted group-hover:text-ember transition-colors flex items-center gap-1">
                    github.com/ishaankor/daily-motivation
                    <ExternalLink className="w-2.5 h-2.5 inline" />
                  </span>
                  <div className="w-8" />
                </div>

                {/* Real User Project Thumbnail */}
                <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/40 via-surface to-ink aspect-[16/10] flex items-center justify-center p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="./images/daily-motivation-photo.jpg"
                    alt="Daily Motivation Twitter/X Bot"
                    className="max-h-full w-auto object-contain rounded-xl shadow-lg transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </a>
            </div>

            {/* Content Details Right */}
            <div className="lg:col-span-6 space-y-5 order-1 lg:order-2">
              <div className="font-mono text-xs text-muted flex items-center gap-3">
                <span className="font-bold text-bone">03</span>
                <span>2023</span>
                <span className="text-muted/60">—</span>
                <span className="inline-flex items-center gap-1.5 text-ember font-medium">
                  <span className="w-2 h-2 rounded-full bg-ember animate-pulse" />
                  Actively maintained
                </span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl font-extrabold text-bone tracking-tight">
                Daily Motivation Bot
              </h3>

              <p className="font-mono text-xs text-muted">
                Automated Twitter/X bot with PostgreSQL analytics
              </p>

              <p className="text-bone-dim text-sm sm:text-[0.95rem] leading-relaxed">
                Automated Python bot delivering daily content, running sentiment polls, and logging engagement in PostgreSQL for trend analysis.
              </p>

              {/* Tag Pills */}
              <div className="flex flex-wrap gap-2 pt-1 font-mono text-xs">
                {['Python', 'PostgreSQL', 'Twitter API', 'Automation', 'NLP', 'Tweepy'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-surface border border-line text-bone-dim text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Badges / Metrics */}
              <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
                <div className="px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold text-[11px]">
                  5,000+ Daily Impressions
                </div>
                <div className="px-3 py-1 rounded-md bg-ember/10 border border-ember/30 text-ember text-[11px]">
                  Automated Cron Pipeline
                </div>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-6 pt-3 font-mono text-xs">
                <a
                  href="https://github.com/ishaankor/daily-motivation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ember hover:underline font-semibold inline-flex items-center gap-1.5 group"
                >
                  <span>Source Code</span>
                  <Github className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="https://github.com/ishaankor/daily-motivation#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-bone transition-colors inline-flex items-center gap-1"
                >
                  <span>Architecture</span>
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
