'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import {
  Code2,
  Cpu,
  Layers,
  Wrench,
  Search,
  Sparkles,
  Terminal,
  Database,
  CheckCircle2,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function TechnicalSkillsMatrix() {
  const [skillSearch, setSkillSearch] = useState('');

  const skillGroups = [
    {
      title: 'AI Ecosystem & LLMs',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      badge: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
      items: [
        ...portfolioData.detailedSkills.aiTools,
        ...portfolioData.detailedSkills.technologies,
      ],
    },
    {
      title: 'Frameworks & Microservices',
      icon: <Cpu className="w-4 h-4 text-indigo-400" />,
      badge: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
      items: portfolioData.detailedSkills.frameworks,
    },
    {
      title: 'Languages & Core DBs',
      icon: <Code2 className="w-4 h-4 text-purple-400" />,
      badge: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
      items: portfolioData.detailedSkills.languages,
    },
    {
      title: 'Data Science & Vision Libraries',
      icon: <Database className="w-4 h-4 text-ember" />,
      badge: 'border-ember/30 text-ember bg-ember/10',
      items: portfolioData.detailedSkills.libraries,
    },
    {
      title: 'DevOps & Infrastructure Tools',
      icon: <Wrench className="w-4 h-4 text-emerald-400" />,
      badge: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      items: portfolioData.detailedSkills.devTools,
    },
    {
      title: 'Engineering Methodologies',
      icon: <Layers className="w-4 h-4 text-pink-400" />,
      badge: 'border-pink-500/30 text-pink-400 bg-pink-500/10',
      items: portfolioData.detailedSkills.disciplines,
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-t border-line/60 relative">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-12">
        
        {/* Header & Filter Search */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-line">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider mb-2">
                <Terminal className="w-3.5 h-3.5 text-ember" />
                Full Technical Taxonomy
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-bone tracking-tight">
                Skillsets, Stack &amp; Infrastructure
              </h2>
            </div>

            {/* Interactive Search */}
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="search"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Search skills (e.g. MCP, PyTorch, LangChain)..."
                className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-surface border border-line text-bone placeholder-muted focus:border-ember focus:outline-none text-xs font-mono transition-colors"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Skills Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillGroups.map((group, idx) => {
            const filteredGroupItems = skillSearch.trim()
              ? group.items.filter((item) =>
                  item.toLowerCase().includes(skillSearch.toLowerCase().trim())
                )
              : group.items;

            if (skillSearch.trim() && filteredGroupItems.length === 0) return null;

            return (
              <ScrollReveal key={group.title} direction="up" delay={0.1 + (idx % 3) * 0.05}>
                <div className="rounded-xl border border-line bg-surface/70 p-6 shadow-panel flex flex-col justify-between h-full hover:border-line/90 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-ink border border-line">
                          {group.icon}
                        </div>
                        <h3 className="font-display text-base font-bold text-bone">
                          {group.title}
                        </h3>
                      </div>
                      <span className="font-mono text-[0.65rem] text-muted">
                        {filteredGroupItems.length}
                      </span>
                    </div>

                    {/* Skill Badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {filteredGroupItems.map((skill) => {
                        const isHighlighted =
                          skillSearch.trim() &&
                          skill.toLowerCase().includes(skillSearch.toLowerCase().trim());
                        return (
                          <span
                            key={skill}
                            className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all ${
                              isHighlighted
                                ? 'bg-ember text-ink font-bold shadow-md shadow-ember/20'
                                : 'bg-ink border border-line text-bone-dim hover:text-bone hover:border-ember/40'
                            }`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-line/60 flex items-center justify-between font-mono text-[0.68rem] text-muted">
                    <span>Verified in Production</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
