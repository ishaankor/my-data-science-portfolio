'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { BrainCircuit, Database, Layout, Terminal, Layers } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function TechStackSection() {
  const categoryThemes = [
    {
      icon: <BrainCircuit className="w-5 h-5 text-indigo-400" />,
      iconBg: 'bg-indigo-500/10 border-indigo-500/30',
      gradient: 'from-indigo-500 via-purple-500 to-indigo-400',
      badge: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    },
    {
      icon: <Database className="w-5 h-5 text-purple-400" />,
      iconBg: 'bg-purple-500/10 border-purple-500/30',
      gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
      badge: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    },
    {
      icon: <Layout className="w-5 h-5 text-cyan-400" />,
      iconBg: 'bg-cyan-500/10 border-cyan-500/30',
      gradient: 'from-cyan-400 via-teal-400 to-emerald-400',
      badge: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    },
  ];

  return (
    <section className="border-t border-line/60 py-20 sm:py-28 relative">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="mb-12">
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
              <Layers className="w-3.5 h-3.5 text-ember" />
              technical matrix
            </span>
            <h2 className="font-display text-[2rem] sm:text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.02em] text-bone mt-4">
              Tech Stack & Capabilities
            </h2>
          </div>
        </ScrollReveal>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {portfolioData.skillCategories.map((category, idx) => {
            const theme = categoryThemes[idx % categoryThemes.length];
            return (
              <ScrollReveal key={category.title} direction="up" delay={0.15 + idx * 0.1}>
                <div className="rounded-xl border border-line bg-surface p-7 shadow-panel flex flex-col justify-between h-full hover:border-line/80 transition-colors">
                  <div>
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-6 ${theme.iconBg}`}>
                      {theme.icon}
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
                            <span className="px-2 py-0.5 rounded text-[10px] bg-ink border border-line text-muted">
                              {skill.tag}
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-ink overflow-hidden border border-line p-0.5">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} transition-all duration-500 shadow-sm`}
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-line flex items-center justify-between font-mono text-[11px]">
                    <span className="text-muted">Status</span>
                    <span className={`px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                      Production Ready
                    </span>
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
