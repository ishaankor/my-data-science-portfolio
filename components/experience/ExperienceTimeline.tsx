'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { Briefcase, GraduationCap, Code, Calendar, MapPin } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ExperienceTimeline() {
  const iconMap = {
    education: <GraduationCap className="w-5 h-5 text-ember" />,
    project: <Code className="w-5 h-5 text-ember" />,
    work: <Briefcase className="w-5 h-5 text-ember" />,
  };

  const getTimelineIcon = (item: (typeof portfolioData.experience)[number]) => {
    if (item.id === 'exp-ucsd-degree' || item.type === 'education' || item.organization?.toLowerCase().includes('ucsd') || item.organization?.toLowerCase().includes('san diego')) {
      return (
        <div className="w-6 h-6 flex items-center justify-center overflow-hidden rounded bg-white p-0.5">
          <img
            src="/images/ucsd-logo copy.png"
            alt="UC San Diego"
            className="w-full h-full object-contain scale-100"
          />
        </div>
      );
    }
    if (item.id === 'exp-handshake-ai' || item.organization?.toLowerCase().includes('handshake')) {
      return (
        <img
          src="/images/handshake-ai.jpg"
          alt="Handshake AI"
          className="w-5 h-5 object-cover rounded-full"
        />
      );
    }
    if (item.organization?.toLowerCase().includes('verizon')) {
      return (
        <img
          src="/images/Verizon.svg"
          alt="Verizon"
          className="w-5 h-5 object-contain"
        />
      );
    }
    return iconMap[item.type];
  };

  return (
    <section className="border-t border-line/60 py-20 sm:py-28 relative" id="experience">
      <div className="mx-auto w-full max-w-5xl px-6 sm:px-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
              <span className="h-px w-7 bg-line" aria-hidden="true" />
              experience & background
            </span>
            <h2 className="font-display text-[2rem] sm:text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.02em] text-bone mt-4">
              Education & Work Timeline
            </h2>
          </div>
        </ScrollReveal>

        {/* Timeline Items */}
        <div className="relative border-l border-line ml-4 sm:ml-32 space-y-12">
          {portfolioData.experience.map((item, idx) => (
            <div key={item.id} className="relative pl-8 sm:pl-10 group">
              
              {/* Timeline Icon Node */}
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-ink border border-line group-hover:border-ember flex items-center justify-center transition-colors">
                {getTimelineIcon(item)}
              </div>

              {/* Date Badge on Desktop Left */}
              <div className="hidden sm:block absolute -left-36 top-2 text-right w-28">
                <span className="text-xs font-mono text-ember font-semibold">
                  {item.period}
                </span>
              </div>

              {/* Card Content */}
              <ScrollReveal direction="up" delay={0.15 + idx * 0.1}>
                <div className="rounded-xl border border-line bg-surface p-6 shadow-panel">
                  
                  {/* Date for Mobile */}
                  <div className="sm:hidden mb-2 font-mono">
                    <span className="inline-flex items-center gap-1 text-xs text-ember">
                      <Calendar className="w-3 h-3" />
                      {item.period}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h3 className="font-display text-lg font-bold text-bone group-hover:text-ember transition-colors">
                      {item.role}
                    </h3>
                    <span className="text-xs text-muted font-mono flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-ember" />
                      {item.location}
                    </span>
                  </div>

                  <p className="text-xs font-mono font-semibold text-bone-dim mb-4">
                    {item.organization}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {item.description.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-bone-dim text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-ember font-bold">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Skill Pills */}
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {item.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded bg-ink border border-line text-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
