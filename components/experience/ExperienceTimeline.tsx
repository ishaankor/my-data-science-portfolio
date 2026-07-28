'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { Briefcase, GraduationCap, Code, Calendar, MapPin } from 'lucide-react';

export default function ExperienceTimeline() {
  const iconMap = {
    education: <GraduationCap className="w-5 h-5 text-cyan-400" />,
    project: <Code className="w-5 h-5 text-violet-400" />,
    work: <Briefcase className="w-5 h-5 text-emerald-400" />,
  };

  return (
    <section className="py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career Journey & Background</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Education & Experience
          </h2>
        </div>

        {/* Timeline Items */}
        <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-32 space-y-12">
          {portfolioData.experience.map((item) => (
            <div key={item.id} className="relative pl-8 sm:pl-10 group">
              
              {/* Timeline Icon Node */}
              <div className="absolute -left-[17px] top-1 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 group-hover:border-cyan-400 flex items-center justify-center transition-colors">
                {iconMap[item.type]}
              </div>

              {/* Date Badge on Desktop Left */}
              <div className="hidden sm:block absolute -left-36 top-2 text-right w-28">
                <span className="text-xs font-mono text-cyan-400 font-semibold">
                  {item.period}
                </span>
              </div>

              {/* Card Content */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800 group-hover:border-slate-700 transition-all">
                
                {/* Date for Mobile */}
                <div className="sm:hidden mb-2">
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400">
                    <Calendar className="w-3 h-3" />
                    {item.period}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {item.role}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {item.location}
                  </span>
                </div>

                <p className="text-sm font-semibold text-slate-300 mb-4">
                  {item.organization}
                </p>

                <ul className="space-y-2 mb-6">
                  {item.description.map((bullet, idx) => (
                    <li key={idx} className="text-slate-400 text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
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
