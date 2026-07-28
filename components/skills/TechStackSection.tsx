'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { BrainCircuit, Database, Layout, Terminal } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function TechStackSection() {
  const iconMap: Record<string, React.ReactNode> = {
    BrainCircuit: <BrainCircuit className="w-6 h-6 text-ember" />,
    Database: <Database className="w-6 h-6 text-ember" />,
    Layout: <Layout className="w-6 h-6 text-ember" />,
  };

  return (
    <section className="border-t border-line/60 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="mb-12">
            <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
              <span className="h-px w-7 bg-line" aria-hidden="true" />
              technical matrix
            </span>
            <h2 className="font-display text-[2rem] sm:text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.02em] text-bone mt-4">
              Tech Stack & Capabilities
            </h2>
          </div>
        </ScrollReveal>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {portfolioData.skillCategories.map((category, idx) => (
            <ScrollReveal key={category.title} direction="up" delay={0.15 + idx * 0.1}>
              <div className="rounded-xl border border-line bg-surface p-7 shadow-panel flex flex-col justify-between h-full">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-ink border border-line flex items-center justify-center mb-6">
                    {iconMap[category.iconName] || <Terminal className="w-5 h-5 text-ember" />}
                  </div>

                  <h3 className="font-display text-lg font-bold text-bone mb-2">
                    {category.title}
                  </h3>

                  <p className="text-bone-dim text-xs leading-relaxed mb-8">
                    {category.description}
                  </p>

                  {/* Skills Progress List */}
                  <div className="space-y-4 font-mono">
                    {category.skills.map((skill) => (
                      <div key={skill.name} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-bone font-medium">{skill.name}</span>
                          <span className="text-muted">{skill.tag}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-ink overflow-hidden border border-line">
                          <div
                            className="h-full bg-ember rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-line text-right">
                  <span className="text-[11px] font-mono text-ember">Production Ready</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
