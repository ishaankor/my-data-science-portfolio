'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { Briefcase, GraduationCap, Code, Calendar, MapPin } from 'lucide-react';

export default function ExperienceTimeline() {
  const iconMap = {
    education: <GraduationCap className="w-5 h-5 text-haze-indigo" />,
    project: <Code className="w-5 h-5 text-haze-purple" />,
    work: <Briefcase className="w-5 h-5 text-haze-cyan" />,
  };

  return (
    <section className="py-20 relative border-t border-haze-border" id="experience">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-haze-indigo/10 border border-haze-border text-haze-indigo text-xs font-mono mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Academic & Technical Background</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Education & Experience
          </h2>
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-haze-border ml-4 sm:ml-32 space-y-12">
          {portfolioData.experience.map((item) => (
            <div key={item.id} className="relative pl-8 sm:pl-10 group">
              
              {/* Timeline Icon Node */}
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-midnight border border-haze-border group-hover:border-haze-indigo flex items-center justify-center transition-colors">
                {iconMap[item.type]}
              </div>

              {/* Date Badge on Desktop Left */}
              <div className="hidden sm:block absolute -left-36 top-2 text-right w-28">
                <span className="text-xs font-mono text-haze-indigo font-semibold">
                  {item.period}
                </span>
              </div>

              {/* Card Content */}
              <div className="glass-haze-card p-7 rounded-2xl">
                
                {/* Date for Mobile */}
                <div className="sm:hidden mb-2 font-mono">
                  <span className="inline-flex items-center gap-1 text-xs text-haze-indigo">
                    <Calendar className="w-3 h-3" />
                    {item.period}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-haze-indigo transition-colors">
                    {item.role}
                  </h3>
                  <span className="text-xs text-haze-muted font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-haze-indigo" />
                    {item.location}
                  </span>
                </div>

                <p className="text-sm font-semibold text-haze-dim mb-4">
                  {item.organization}
                </p>

                <ul className="space-y-2 mb-6">
                  {item.description.map((bullet, idx) => (
                    <li key={idx} className="text-haze-dim text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                      <span className="text-haze-indigo font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded bg-midnight border border-haze-border text-haze-dim"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
