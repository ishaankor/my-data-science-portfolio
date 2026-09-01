'use client';

import React from 'react';
import { Code2 } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function WhatIDo() {
  const capabilities = [
    {
      num: '01',
      title: 'Product engineering',
      description: 'Real-time, type-safe web apps people use every day, taken from first pixel to production.',
    },
    {
      num: '02',
      title: 'Data science & ML',
      description: 'Predictive models, regression analysis, computer vision with OpenCV, and automated ML bots.',
    },
    {
      num: '03',
      title: 'Systems & infrastructure',
      description: 'Directories, automated web scrapers, API stream pipelines, and databases kept reliable at scale.',
    },
  ];

  return (
    <section className="border-t border-line/60 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        
        {/* Section label */}
        <ScrollReveal direction="up" delay={0.1}>
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
            <Code2 className="w-3.5 h-3.5 text-ember" />
            what I do
          </span>
        </ScrollReveal>

        {/* List Grid */}
        <div className="mt-10 border-t border-line">
          {capabilities.map((item, idx) => (
            <ScrollReveal key={item.num} direction="up" delay={0.15 + idx * 0.1}>
              <div className="grid gap-3 border-b border-line py-7 md:grid-cols-[1fr_1.8fr] md:gap-10 items-start">
                <h2 className="flex items-baseline gap-3 font-display text-lg font-semibold text-bone">
                  <span className="font-mono text-xs text-ember tabular-nums">
                    {item.num}
                  </span>
                  {item.title}
                </h2>
                <p className="text-[0.97rem] leading-relaxed text-bone-dim">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
