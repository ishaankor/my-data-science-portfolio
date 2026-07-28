'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import { ArrowRight, FileText, Sparkles, Terminal, Cpu } from 'lucide-react';

const Hero3DCanvas = dynamic(() => import('./Hero3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] sm:h-[550px] md:h-[650px] flex items-center justify-center">
      <div className="w-48 h-48 rounded-full border-2 border-dashed border-cyan-500/40 animate-spin" />
    </div>
  ),
});

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] pt-24 pb-16 flex items-center overflow-hidden">
      {/* Background Ambient Glow Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-indigo-500/10 to-purple-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Data Science Portfolio + Interactive Web App</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Hi, I&apos;m <span className="text-gradient">{portfolioData.name}</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-300 font-light">
              {portfolioData.title}
            </p>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              {portfolioData.bio}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <span>Browse All Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-panel text-slate-200 hover:text-white hover:border-slate-600 font-semibold transition-all transform hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>View Resume</span>
              </Link>
            </div>

            {/* Badges / Highlights */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Live GitHub API analytics</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <Cpu className="w-4 h-4 text-violet-400 shrink-0" />
                <span>Interactive AI Recommender</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Interactive 3D WebGL Hero</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Hero + Profile Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative glass-panel rounded-3xl p-4 overflow-hidden border border-slate-800/80 shadow-2xl">
              <Hero3DCanvas />

              {/* What I'm Learning Now Panel Overlay */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    What I&apos;m Learning & Building
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {portfolioData.learningNow.slice(0, 4).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/50 text-[11px] text-slate-300 font-mono"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
