'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import { ArrowRight, FileText } from 'lucide-react';

import HeroMemojiInteractive from './HeroMemojiInteractive';

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
    <section className="relative min-h-[85vh] lg:min-h-[92vh] pt-20 sm:pt-28 pb-12 sm:pb-16 flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Intro & Typewriter (Grand Entrance) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left items-center lg:items-start relative">
            {/* Subtle atmospheric ambient glow behind the grand headline */}
            <div className="absolute -top-10 -left-10 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            
            {/* Grand Entrance Headline: High-impact typography dominating the left side */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] xl:text-[5.25rem] font-black tracking-[-0.035em] text-bone leading-[1.04] mb-5 sm:mb-6 relative z-10">
              <span className="block text-bone/90 mb-1 sm:mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[4rem] font-bold tracking-tight">
                I am
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-bone via-slate-100 to-sky-400 min-h-[2.1em] sm:min-h-[2.05em]">
                {currentText}
                <span className="inline-block w-[4px] sm:w-[6px] lg:w-[7px] h-[0.82em] bg-sky-400 ml-2 sm:ml-3 animate-pulse align-baseline shadow-[0_0_16px_rgba(56,189,248,0.9)]" />
              </span>
            </h1>

            <p className="text-base sm:text-xl lg:text-[1.35rem] xl:text-[1.5rem] text-bone-dim max-w-2xl leading-relaxed mt-2 sm:mt-3 text-center lg:text-left relative z-10">
              Building production AI models, autonomous agents, and interactive web tools.
            </p>

            {/* Action CTAs */}
            <div className="mt-8 sm:mt-9 flex flex-wrap gap-3.5 sm:gap-4 items-center justify-center lg:justify-start font-mono text-xs sm:text-sm relative z-10">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-bone font-semibold transition-all hover:scale-[1.02] shadow-sm"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </Link>

              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl border border-line bg-surface hover:border-line/80 hover:text-bone text-bone-dim font-semibold transition-all hover:scale-[1.02] shadow-sm"
              >
                <FileText className="w-4 h-4 text-muted" />
                <span>View Resume</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Animated & Interactive Memoji Hero Card */}
          <div className="lg:col-span-5 h-auto w-full flex items-center justify-center relative">
            <HeroMemojiInteractive />
          </div>

        </div>
      </div>
    </section>
  );
}
