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
    <section aria-labelledby="heading-tech-stack" className="section-boundary">
      <div className="section-container">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="mb-8 sm:mb-12">
            <span className="section-eyebrow">
              <Layers className="w-3.5 h-3.5 text-ember" aria-hidden="true" />
              <span>technical toolkit</span>
            </span>
            <h2 id="heading-tech-stack" className="section-headline mt-2">
              Tech Stack &amp; Focus Areas
            </h2>
          </div>
        </ScrollReveal>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {portfolioData.skillCategories.map((category, idx) => {
            const icon = categoryIcons[idx % categoryIcons.length];
            return (
              <ScrollReveal key={category.title} direction="up" delay={0.15 + idx * 0.1}>
                <article className="surface-panel-interactive">
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
                          <span className="badge-chip">
                            {skill.tag}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
}
