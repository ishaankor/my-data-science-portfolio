'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { GraduationCap, UserCheck, Code, Sparkles } from 'lucide-react';

export default function AboutMeSection() {
  return (
    <section className="py-20 relative border-t border-haze-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-haze-indigo/10 border border-haze-border text-haze-indigo text-xs font-mono mb-3">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Get to know more about me</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            About Me & Background
          </h2>
        </div>

        {/* Bio Cards Grid matching ishaankoradia.com content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Self-Taught Developer & AI Passion */}
          <div className="glass-haze-card p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-haze-indigo mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white">
              AI Engineer & Automater
            </h3>

            <p className="text-haze-dim text-sm sm:text-base leading-relaxed">
              Hi, I&apos;m Ishaan Koradia, an AI Engineer fascinated by the intersection between Artificial Intelligence and Machine Learning. What started with small shortcuts in Apple Automation has evolved into building robust Python web scrapers, automated Twitter/X bots, Discord ML models, and interactive WebGL web apps.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 font-mono text-xs text-haze-indigo">
              <span className="px-2.5 py-1 rounded-md bg-midnight border border-haze-border">Machine Learning</span>
              <span className="px-2.5 py-1 rounded-md bg-midnight border border-haze-border">Python Scraping</span>
              <span className="px-2.5 py-1 rounded-md bg-midnight border border-haze-border">AI Bots</span>
            </div>
          </div>

          {/* Card 2: UCSD Education & Student Organizations */}
          <div className="glass-haze-card p-8 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-haze-purple mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-white">
              UC San Diego (UCSD) Alum
            </h3>

            <p className="text-haze-dim text-sm sm:text-base leading-relaxed">
              B.S. in Cognitive Science with a Specialization in Machine Learning and Neural Computation with Data Science. Active in <strong className="text-white">Data Science Student Society (DS3)</strong>, Cognitive Science Student Association (CSSA Web Team), and Computer Science and Engineering Society (CSES).
            </p>

            <div className="pt-2 flex flex-wrap gap-2 font-mono text-xs text-haze-purple">
              <span className="px-2.5 py-1 rounded-md bg-midnight border border-haze-border">DS3 Member</span>
              <span className="px-2.5 py-1 rounded-md bg-midnight border border-haze-border">CSSA Web Team</span>
              <span className="px-2.5 py-1 rounded-md bg-midnight border border-haze-border">CSES Dev</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
