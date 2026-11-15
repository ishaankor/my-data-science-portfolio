'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { BrainCircuit, Database, Layout, Layers } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function TechStackSection() {
  const categoryIcons = [
    <BrainCircuit key="brain" className="icon-md-accent" aria-hidden="true" />,
    <Database key="db" className="icon-md-accent" aria-hidden="true" />,
    <Layout key="layout" className="icon-md-accent" aria-hidden="true" />,
  ];

  return (
    <section aria-labelledby="heading-tech-stack" className="toolkit-section">
      <div className="toolkit-container">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <header className="toolkit-header">
            <span className="section-eyebrow">
              <Layers className="icon-xs-accent" aria-hidden="true" />
              <span>technical toolkit</span>
            </span>
            <h2 id="heading-tech-stack" className="section-headline">
              Tech Stack &amp; Focus Areas
            </h2>
          </header>
        </ScrollReveal>

        {/* Categories Grid */}
        <div className="toolkit-grid">
          {portfolioData.skillCategories.map((category, idx) => {
            const icon = categoryIcons[idx % categoryIcons.length];
            return (
              <ScrollReveal key={category.title} direction="up" delay={0.15 + idx * 0.1}>
                <article className="surface-panel-interactive">
                  <div>
                    <div className="toolkit-icon-well">
                      {icon}
                    </div>

                    <h3 className="toolkit-category-title">
                      {category.title}
                    </h3>

                    <p className="toolkit-category-desc">
                      {category.description}
                    </p>

                    {/* Grounded Skills Tag List */}
                    <ul className="toolkit-skill-list">
                      {category.skills.map((skill) => (
                        <li key={skill.name}>
                          <strong>{skill.name}</strong>
                          <span>{skill.tag}</span>
                        </li>
                      ))}
                    </ul>
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
