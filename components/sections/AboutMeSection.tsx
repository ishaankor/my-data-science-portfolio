'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { Sparkles, GraduationCap, ArrowRight, ExternalLink, Bot, BookOpen } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function AboutMeSection() {
  return (
    <section className="border-t border-line/60 py-20 sm:py-28 relative">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        
        {/* Section Header matching SELECTED WORK */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
                <span className="h-px w-7 bg-line" aria-hidden="true" />
                about me &amp; background
              </span>
              <h2 className="font-display text-[2rem] sm:text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.02em] text-bone mt-4">
                Engineering at the intersection of AI &amp; systems.
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 font-mono">
              <span className="px-3 py-1.5 rounded-md text-xs bg-surface/60 border border-line text-muted">
                UCSD Cognitive Science &apos;25
              </span>
              <span className="px-3 py-1.5 rounded-md text-xs bg-ember/10 border border-ember/30 text-ember font-bold">
                AI &amp; ML Specialization
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* 2-Column Bio Cards Grid matching SELECTED WORK cards */}
        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Card 1: AI Engineer & Automater */}
          <ScrollReveal direction="up" delay={0.15}>
            <div className="group block h-full flex flex-col justify-between">
              <div>
                {/* Browser Mockup Container */}
                <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-float transition-colors duration-300 group-hover:border-ember/60">
                  
                  {/* Browser Header Bar */}
                  <div className="flex items-center gap-1.5 border-b border-line bg-ink/70 px-3.5 py-2.5">
                    <span aria-hidden="true" className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    </span>
                    <span className="ml-3 truncate font-mono text-[0.68rem] text-muted">
                      engineer.bio
                    </span>
                  </div>

                  {/* Card Content & Bio */}
                  <div className="relative p-6 sm:p-7 bg-gradient-to-br from-surface via-surface to-ink flex flex-col justify-between min-h-[260px]">
                    <div>
                      {/* Tag Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {['Machine Learning', 'Python Scraping', 'AI Bots', 'FastAPI & MCP'].map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded bg-ink/90 border border-line/80 font-mono text-[0.68rem] text-bone-dim"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-bone-dim leading-relaxed">
                        Hi, I&apos;m <strong className="text-bone font-semibold">Ishaan Koradia</strong>, an AI Engineer fascinated by the intersection between Artificial Intelligence, Machine Learning, and Agentic Workflows. What started with small shortcuts in Apple Automation has evolved into building robust Python scrapers, automated Twitter/X bots, Discord ML models, and interactive WebGL tools.
                      </p>
                    </div>

                    {/* Impact / Metric badge */}
                    <div className="mt-5 font-mono text-[0.7rem] text-cyan-400 flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1.5 rounded-md border border-cyan-500/20 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Production Deployments &amp; Agentic AI</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Title & Metadata Below Card */}
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-semibold text-bone transition-colors group-hover:text-ember flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-ember shrink-0" />
                  <span>AI Engineer &amp; Automater</span>
                </h3>
                <span className="font-mono text-xs text-muted">Focus Area</span>
              </div>

              {/* Bottom Row */}
              <div className="mt-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Active Systems Builder
                </span>

                <Link
                  href="/projects"
                  className="font-mono text-xs text-ember hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore Projects</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

            </div>
          </ScrollReveal>

          {/* Card 2: UC San Diego (UCSD) Alum */}
          <ScrollReveal direction="up" delay={0.25}>
            <div className="group block h-full flex flex-col justify-between">
              <div>
                {/* Browser Mockup Container */}
                <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-float transition-colors duration-300 group-hover:border-ember/60">
                  
                  {/* Browser Header Bar */}
                  <div className="flex items-center gap-1.5 border-b border-line bg-ink/70 px-3.5 py-2.5">
                    <span aria-hidden="true" className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    </span>
                    <span className="ml-3 truncate font-mono text-[0.68rem] text-muted">
                      ucsd.alumni
                    </span>
                  </div>

                  {/* Card Content & Bio */}
                  <div className="relative p-6 sm:p-7 bg-gradient-to-br from-surface via-surface to-ink flex flex-col justify-between min-h-[260px]">
                    <div>
                      {/* Tag Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {['DS3 Member', 'CSSA Web Team', 'CSES Dev', 'Neural Computation'].map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded bg-ink/90 border border-line/80 font-mono text-[0.68rem] text-bone-dim"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs sm:text-sm text-bone-dim leading-relaxed">
                        B.S. in <strong className="text-bone font-semibold">Cognitive Science</strong> with Specialization in Machine Learning and Neural Computation with Data Science. Active in <strong className="text-bone font-semibold">Data Science Student Society (DS3)</strong>, Cognitive Science Student Association (CSSA Web Team), and Computer Science &amp; Engineering Society (CSES).
                      </p>
                    </div>

                    {/* Impact / Metric badge */}
                    <div className="mt-5 font-mono text-[0.7rem] text-cyan-400 flex items-center gap-1.5 bg-cyan-500/10 px-3 py-1.5 rounded-md border border-cyan-500/20 w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span>B.S. Cognitive Science • 3.76 GPA</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Title & Metadata Below Card */}
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-xl font-semibold text-bone transition-colors group-hover:text-ember flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>UC San Diego (UCSD) Alum</span>
                </h3>
                <span className="font-mono text-xs text-muted">Education</span>
              </div>

              {/* Bottom Row */}
              <div className="mt-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Graduated 2025
                </span>

                <Link
                  href="/resume"
                  className="font-mono text-xs text-ember hover:underline inline-flex items-center gap-1"
                >
                  <span>View Resume</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

            </div>
          </ScrollReveal>

        </div>

      </div>
    </section>
  );
}
