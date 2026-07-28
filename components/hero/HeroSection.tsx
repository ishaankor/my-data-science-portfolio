'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import { ArrowRight, Sparkles, Terminal, FileText, Bot, BrainCircuit } from 'lucide-react';

const Hero3DCanvas = dynamic(() => import('./Hero3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] flex items-center justify-center">
      <div className="flex items-center gap-2 font-mono text-xs text-haze-muted">
        <span className="h-2 w-2 animate-ping rounded-full bg-haze-indigo" />
        loading Midnight Haze 3D...
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
      }, 50);
    } else {
      timer = setTimeout(() => {
        setCurrentText(fullText.substring(0, currentText.length + 1));
      }, 100);
    }

    if (!isDeleting && currentText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setTypingIndex((prev) => (prev + 1) % portfolioData.typingStrings.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, typingIndex]);

  return (
    <section className="relative min-h-[92vh] pt-28 pb-16 flex items-center overflow-hidden bg-midnight-haze">
      
      {/* Background Ambient Haze Spheres */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-indigo-600/10 via-purple-600/10 to-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Intro & Typewriter */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-haze-indigo/10 border border-haze-border text-haze-indigo text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Data Science Portfolio + Interactive Web App</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-mono text-haze-muted">
                Hi, I&apos;m <span className="text-white font-bold">{portfolioData.name}</span>
              </h2>
              
              {/* Typewriter Line */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white h-[1.3em]">
                I am <span className="text-haze-gradient">{currentText}</span>
                <span className="inline-block w-[3px] h-[0.85em] bg-haze-indigo ml-1 animate-pulse" />
              </h1>
            </div>

            <p className="text-base sm:text-lg text-haze-dim max-w-2xl leading-relaxed">
              Recent <strong className="text-white">UCSD Cognitive Science</strong> (ML & Neural Computation) graduate. I design, train, and deploy AI models, automation scripts, and interactive web data tools.
            </p>

            {/* Action CTAs */}
            <div className="pt-2 flex flex-wrap gap-4 items-center font-mono">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-haze-glow transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-haze text-haze-dim hover:text-white font-semibold transition-all transform hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4 text-haze-indigo" />
                <span>View Resume</span>
              </Link>
            </div>

            {/* Highlights Grid */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-xl glass-haze text-haze-dim">
                <BrainCircuit className="w-4 h-4 text-haze-indigo shrink-0" />
                <span>UCSD ML & Data Science</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl glass-haze text-haze-dim">
                <Bot className="w-4 h-4 text-haze-purple shrink-0" />
                <span>AI Bots & Automation</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl glass-haze text-haze-dim">
                <Terminal className="w-4 h-4 text-haze-cyan shrink-0" />
                <span>Live GitHub Analytics</span>
              </div>
            </div>

          </div>

          {/* Right Column: Midnight Haze 3D Canvas */}
          <div className="lg:col-span-5 relative">
            <div className="relative glass-haze-card rounded-3xl p-4 overflow-hidden shadow-2xl">
              <Hero3DCanvas />

              {/* Learning Tags */}
              <div className="mt-4 p-4 rounded-2xl bg-haze-dark/90 border border-haze-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-haze-indigo tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-haze-indigo animate-ping" />
                    Currently Building & Exploring
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {portfolioData.learningNow.slice(0, 4).map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-midnight border border-haze-border text-[11px] text-haze-dim font-mono"
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
