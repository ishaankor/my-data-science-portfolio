'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { BrainCircuit, Database, Layout, Layers } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function TechStackSection() {
  const categoryIcons = [
    <BrainCircuit key="brain" className="w-5 h-5 text-ember" />,
    <Database key="db" className="w-5 h-5 text-ember" />,
    <Layout key="layout" className="w-5 h-5 text-ember" />,
  ];

  return (
    <section className="border-t border-line/60 py-20 sm:py-28 relative">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
              <Layers className="w-3.5 h-3.5 text-ember" />
              technical toolkit
            </span>
            <h2 className="font-display text-[2rem] sm:text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.02em] text-bone mt-4">
              Tech Stack &amp; Focus Areas
            </h2>
          </div>
        </ScrollReveal>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {portfolioData.skillCategories.map((category, idx) => {
            const icon = categoryIcons[idx % categoryIcons.length];
            return (
              <ScrollReveal key={category.title} direction="up" delay={0.15 + idx * 0.1}>
                <div className="rounded-xl border border-line bg-surface p-7 shadow-panel flex flex-col justify-between h-full hover:border-line/80 transition-colors">
                  <div>
                    <div className="w-10 h-10 rounded-lg border border-line bg-ink flex items-center justify-center mb-6 shadow-sm">
                      {icon}
                    </div>

                    <h3 className="font-display text-lg font-bold text-bone mb-2">
                      {category.title}
                    </h3>

                    <p className="text-bone-dim text-xs leading-relaxed mb-6">
                      {category.description}
                    </p>

                    {/* Grounded Skills Tag List */}
                    <div className="space-y-2 font-mono">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-ink/70 border border-line/70 hover:border-line transition-colors"
                        >
                          <span className="text-bone font-medium text-xs">{skill.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-surface border border-line text-muted">
                            {skill.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
