'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import { ArrowRight, Sparkles, FileText, Bot, BrainCircuit, Activity } from 'lucide-react';

const Hero3DCanvas = dynamic(() => import('./Hero3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] flex items-center justify-center">
      <div className="flex items-center gap-2 font-mono text-xs text-muted">
        <span className="h-2 w-2 animate-ping rounded-full bg-ember" />
        loading 3D scene...
      </div>
    </div>
  ),
});

export default function HeroSection() {
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = portfolioData.typingStrings[typingIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(fullText.substring(0, currentText.length - 1));
      }, 40);
    } else {
      timer = setTimeout(() => {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }, 80);
    }

    if (!isDeleting && currentText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setTypingIndex((prev) => (prev + 1) % portfolioData.typingStrings.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, typingIndex]);

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 flex items-center overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-ember/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Intro & Typewriter */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-ember/10 border border-ember/30 text-ember text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Data Science Portfolio + Interactive Web App</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-mono text-muted">
                Hi, I&apos;m <span className="text-bone font-bold">{portfolioData.name}</span>
              </h2>
              
              {/* Typewriter Line with flexible min-height to prevent overlap */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-bone leading-[1.15] sm:leading-[1.15] min-h-[2.4em] sm:min-h-[2.5em] lg:min-h-[2.4em] flex flex-wrap items-baseline">
                <span>I am&nbsp;</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
                  {currentText}
                </span>
                <span className="inline-block w-[3px] h-[0.85em] bg-ember ml-1 animate-pulse shrink-0 align-middle" />
              </h1>
            </div>

            <p className="text-base sm:text-lg text-bone-dim max-w-2xl leading-relaxed pt-1">
              Recent <strong className="text-bone font-semibold">UCSD Cognitive Science</strong> (ML & Neural Computation) graduate. I design, train, and deploy AI models, automation scripts, and interactive web data tools.
            </p>

            {/* Action CTAs */}
            <div className="pt-3 flex flex-wrap gap-4 items-center font-mono text-sm">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-ember/50 bg-ember/10 hover:border-ember hover:bg-ember/20 text-bone font-semibold transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 text-ember" />
              </Link>

              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border border-line bg-surface/80 hover:border-ember hover:text-ember text-bone-dim font-semibold transition-all transform hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4 text-muted group-hover:text-ember" />
                <span>View Resume</span>
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="pt-6 border-t border-line/60 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg border border-line bg-surface/50 text-muted flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>UCSD ML & Data Science</span>
              </div>
              <div className="p-3 rounded-lg border border-line bg-surface/50 text-muted flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-400 shrink-0" />
                <span>AI Bots & Automation</span>
              </div>
              <div className="p-3 rounded-lg border border-line bg-surface/50 text-muted flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Live GitHub Analytics</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Canvas Container */}
          <div className="lg:col-span-5 h-[400px] sm:h-[500px] w-full rounded-2xl border border-line bg-surface/40 overflow-hidden shadow-float relative">
            <Hero3DCanvas />
          </div>

        </div>
      </div>
    </section>
  );
}
