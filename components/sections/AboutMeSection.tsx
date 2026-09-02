'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function AboutMeSection() {
  const whatIDoItems = [
    {
      number: '01',
      title: 'Product & AI engineering',
      description:
        'Real-time, type-safe web apps people use every day, taken from first pixel to production with agentic workflows.',
    },
    {
      number: '02',
      title: 'Systems & infrastructure',
      description:
        'Model Context Protocol (MCP) integrations, high-throughput FastAPI backends, and parallelized ETL pipelines kept reliable at scale.',
    },
    {
      number: '03',
      title: 'Cloud & delivery',
      description:
        'Docker, automated CI/CD workflows, and serverless architectures that move work from my machine to production safely and repeatably.',
    },
  ];

  return (
    <section className="border-t border-line/60 py-20 sm:py-28 relative">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-20">
        
        {/* 1. WHAT I DO Section */}
        <ScrollReveal direction="up" delay={0.1}>
          <div>
            {/* Section Eyebrow */}
            <div className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted mb-8">
              <span className="h-px w-6 bg-muted/60 inline-block" aria-hidden="true" />
              <span>WHAT I DO</span>
            </div>

            {/* Numbered Row List */}
            <div className="divide-y divide-line/60 border-t border-b border-line/60">
              {whatIDoItems.map((item) => (
                <div
                  key={item.number}
                  className="py-7 sm:py-9 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-baseline group"
                >
                  {/* Left Column: Number & Title */}
                  <div className="md:col-span-5 flex items-baseline gap-3">
                    <span className="font-mono text-xs font-bold text-ember">
                      {item.number}
                    </span>
                    <h3 className="font-display text-base sm:text-lg font-bold text-bone group-hover:text-ember transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {/* Right Column: Description */}
                  <div className="md:col-span-7">
                    <p className="text-bone-dim text-xs sm:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 2. CURRENTLY Section */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="space-y-4">
            {/* Section Eyebrow */}
            <div className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              <span className="h-px w-6 bg-muted/60 inline-block" aria-hidden="true" />
              <span>CURRENTLY</span>
            </div>

            {/* Headline & Link Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-1">
              <div className="space-y-2 max-w-2xl">
                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-bone tracking-tight">
                  AI Engineer at Handshake AI.
                </h3>
                <p className="text-bone-dim text-xs sm:text-sm leading-relaxed">
                  Frontier LLM evaluation, golden benchmark datasets, and instruction-tuning on NVIDIA Nemotron-12B.
                </p>
              </div>

              <Link
                href="/resume"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-bone-dim hover:text-ember transition-colors shrink-0 group self-start sm:self-auto"
              >
                <span>See the full path</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
