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
    <section className="relative min-h-[85vh] lg:min-h-[92vh] pt-16 sm:pt-24 lg:pt-28 pb-10 sm:pb-16 flex items-center overflow-hidden">
      {/* Apparent Section-Wide Ambient White Underglow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] sm:w-[1200px] lg:w-[1500px] h-[550px] sm:h-[750px] pointer-events-none -z-10 select-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.05) 40%, rgba(226, 232, 240, 0.015) 65%, transparent 80%)',
          filter: 'blur(75px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-10 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Intro & Typewriter (Grand Entrance - 8 columns for huge text) */}
          <div className="lg:col-span-8 flex flex-col justify-center text-left items-start relative w-full max-w-full">
            {/* Luminous White Core Underglow directly behind the hero headline */}
            <div
              className="absolute -top-16 -left-12 sm:-top-24 sm:-left-20 w-[360px] xs:w-[440px] sm:w-[640px] lg:w-[760px] h-[280px] xs:h-[340px] sm:h-[460px] pointer-events-none -z-10 select-none"
              style={{
                background:
                  'radial-gradient(ellipse 65% 55% at 42% 48%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.09) 35%, rgba(241, 245, 249, 0.02) 60%, transparent 80%)',
                filter: 'blur(55px)',
              }}
              aria-hidden="true"
            />

            {/* Grand Entrance Headline: HUGE, High-impact typography strictly left-justified */}
            <h1 className="w-full mb-5 sm:mb-6 text-left">
              <span className="block text-bone/90 mb-1 sm:mb-2 text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] xl:text-[3.5rem] font-bold tracking-tight leading-[1.06] text-left">
                I am
              </span>
              
              {/* Massive typewriter role: unified text stream, zero letter shifting, no orphaned cursor */}
              <span className="block min-h-[1.12em] text-left text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.5rem] 2xl:text-[6.25rem] font-black tracking-[-0.035em] leading-[1.14]">
                <span 
                  className="bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent pb-[0.18em] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
                  style={{
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >{currentText}</span><span 
                  className="inline-block w-[5px] sm:w-[7px] lg:w-[8px] xl:w-[10px] h-[0.84em] bg-sky-400 ml-1.5 sm:ml-2.5 animate-pulse align-baseline shadow-[0_0_12px_rgba(56,189,248,0.7)]" 
                  aria-hidden="true"
                />
              </span>
            </h1>

            <p className="text-base sm:text-xl lg:text-[1.35rem] xl:text-[1.5rem] text-bone-dim max-w-2xl leading-relaxed mt-4 sm:mt-5 text-left">
              Building production AI models, autonomous agents, and interactive web tools.
            </p>

            {/* Action CTAs */}
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 items-center justify-start font-mono text-xs sm:text-sm">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-4 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-bone font-semibold transition-all hover:scale-[1.02] shadow-sm text-xs sm:text-sm"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </Link>

              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-4 rounded-xl border border-line bg-surface hover:border-line/80 hover:text-bone text-bone-dim font-semibold transition-all hover:scale-[1.02] shadow-sm text-xs sm:text-sm"
              >
                <FileText className="w-4 h-4 text-muted" />
                <span>View Resume</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Animated & Interactive Memoji Hero Card (4 columns) */}
          <div className="lg:col-span-4 h-auto w-full flex items-center justify-center relative">
            <HeroMemojiInteractive />
          </div>

        </div>
      </div>
    </section>
  );
}
