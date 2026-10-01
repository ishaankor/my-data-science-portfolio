'use client';

import React from 'react';
import { portfolioData, ExperienceItem } from '@/data/portfolio';
import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  Sparkles,
  Github,
  Cpu,
  Workflow,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ExperienceMatrix() {
  const items = portfolioData.experience;

  const getIconForType = (item: ExperienceItem) => {
    if (item.type === 'education') return <GraduationCap className="w-5 h-5 text-bone-dim" />;
    if (item.id === 'exp-handshake-ai') return <Cpu className="w-5 h-5 text-bone-dim" />;
    return <Briefcase className="w-5 h-5 text-bone-dim" />;
  };

  return (
    <section className="py-16 sm:py-24 relative" id="experience-matrix">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-line">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider">
                <Workflow className="w-3.5 h-3.5 text-ember" />
                Career &amp; Academic Trajectory
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-bone tracking-tight">
                Work Experience &amp; Education
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">
              {items.length} Milestones
            </span>
          </div>
        </ScrollReveal>

        {/* Milestone Cards */}
        <div className="space-y-8">
          {items.map((item, idx) => (
            <ScrollReveal key={item.id} direction="up" delay={0.1 + idx * 0.08}>
              <div
                className="rounded-2xl border border-line bg-surface p-6 sm:p-8 transition-colors duration-200 relative overflow-hidden group shadow-panel hover:border-line/90"
              >
                {/* Header Row: Role Title, Organization, Badge, Period */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-ink border border-line flex items-center justify-center shrink-0 shadow-sm">
                        {getIconForType(item)}
                      </div>

                      <div>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-bone group-hover:text-ember transition-colors">
                          {item.role}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono mt-1">
                          <span className="font-semibold text-bone-dim">{item.organization}</span>
                          <span className="text-muted">•</span>
                          <span className="text-muted flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-ember" />
                            {item.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side Badges: Highlight Badge & Date */}
                  <div className="flex flex-wrap lg:flex-col lg:items-end gap-2 font-mono text-xs">
                    {item.awardOrHighlight && (
                      <span
                        className="px-3 py-1 rounded-full border border-line bg-ink text-bone-dim text-[0.7rem] font-semibold inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Sparkles className="w-3 h-3 text-ember" />
                        <span>{item.awardOrHighlight}</span>
                      </span>
                    )}

                    <span className="text-muted flex items-center gap-1.5 text-[0.72rem] bg-ink px-3 py-1 rounded-md border border-line/60">
                      <Calendar className="w-3 h-3 text-ember" />
                      <span>{item.period}</span>
                    </span>
                  </div>
                </div>

                {/* Technical Bullet Points */}
                <ul className="space-y-3 mb-6">
                  {item.description.map((bullet, bIdx) => (
                    <li
                      key={bIdx}
                      className="text-bone-dim text-xs sm:text-sm leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="text-ember font-bold mt-0.5 shrink-0 text-base leading-none">›</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Card Footer: Skills and Repository Link */}
                <div className="pt-5 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Skills pills */}
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-muted text-[0.68rem] mr-1">Stack:</span>
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded bg-ink border border-line text-bone-dim hover:text-bone hover:border-line/90 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Repository Link if present */}
                  {item.githubUrl && (
                    <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted hover:text-ember transition-colors inline-flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Repository</span>
                      </a>
                    </div>
                  )}
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
