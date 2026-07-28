'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { BrainCircuit, Database, Layout, Terminal } from 'lucide-react';

export default function TechStackSection() {
  const iconMap: Record<string, React.ReactNode> = {
    BrainCircuit: <BrainCircuit className="w-6 h-6 text-cyan-400" />,
    Database: <Database className="w-6 h-6 text-violet-400" />,
    Layout: <Layout className="w-6 h-6 text-emerald-400" />,
  };

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tech Stack & Expertise Matrix
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {portfolioData.skillCategories.map((category) => (
            <div
              key={category.title}
              className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
                  {iconMap[category.iconName] || <Terminal className="w-6 h-6 text-cyan-400" />}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {category.title}
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-8">
                  {category.description}
                </p>

                {/* Skills Progress List */}
                <div className="space-y-5">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-200 font-medium">{skill.name}</span>
                        <span className="text-slate-400">{skill.tag}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800/80">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-800/60 text-right">
                <span className="text-[11px] font-mono text-cyan-400">Production Ready</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
