'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { BrainCircuit, Database, Layout, Terminal } from 'lucide-react';

export default function TechStackSection() {
  const iconMap: Record<string, React.ReactNode> = {
    BrainCircuit: <BrainCircuit className="w-6 h-6 text-haze-indigo" />,
    Database: <Database className="w-6 h-6 text-haze-purple" />,
    Layout: <Layout className="w-6 h-6 text-haze-cyan" />,
  };

  return (
    <section className="py-20 relative border-t border-haze-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-haze-indigo/10 border border-haze-border text-haze-indigo text-xs font-mono mb-3">
            <Terminal className="w-3.5 h-3.5" />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Tech Stack & Skills Matrix
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {portfolioData.skillCategories.map((category) => (
            <div
              key={category.title}
              className="glass-haze-card p-8 rounded-3xl flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-midnight border border-haze-border flex items-center justify-center mb-6">
                  {iconMap[category.iconName] || <Terminal className="w-6 h-6 text-haze-indigo" />}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  {category.title}
                </h3>

                <p className="text-haze-dim text-xs sm:text-sm leading-relaxed mb-8">
                  {category.description}
                </p>

                {/* Skills Progress List */}
                <div className="space-y-5 font-mono">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-medium">{skill.name}</span>
                        <span className="text-haze-muted">{skill.tag}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-midnight overflow-hidden border border-haze-border/60">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-haze-border/60 text-right">
                <span className="text-[11px] font-mono text-haze-cyan">Production Ready</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
