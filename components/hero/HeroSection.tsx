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
      <div className="max-w-6xl mx-auto px-6 sm:px-10 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Intro & Typewriter */}
          <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
            
            <p className="font-mono text-sm sm:text-lg lg:text-xl text-muted tracking-wide mb-2 sm:mb-3">
              Hi, I&apos;m <span className="text-bone font-bold">{portfolioData.name}</span>
            </p>
            
            {/* Typewriter Line */}
            <h1 className="text-3xl sm:text-5xl lg:text-[4.25rem] xl:text-[4.75rem] font-extrabold tracking-tight text-bone leading-[1.12] sm:leading-[1.08] min-h-[2.4em] sm:min-h-[2.2em] lg:min-h-[1.15em] flex flex-wrap items-center justify-center lg:justify-start">
              <span>I am&nbsp;</span>
              <span className="inline text-transparent bg-clip-text bg-gradient-to-r from-bone via-slate-200 to-sky-400">
                {currentText}
              </span>
              <span className="inline-block w-[3px] sm:w-[5px] h-[0.8em] bg-sky-400 ml-1.5 animate-pulse align-middle" />
            </h1>

            <p className="text-base sm:text-xl lg:text-[1.55rem] text-bone-dim max-w-2xl leading-relaxed mt-4 sm:mt-5 text-center lg:text-left">
              Building production AI models, autonomous agents, and interactive web tools.
            </p>

            {/* Action CTAs */}
            <div className="mt-6 sm:mt-7 flex flex-wrap gap-3 sm:gap-4 items-center justify-center lg:justify-start font-mono text-xs sm:text-sm">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-bone font-semibold transition-colors shadow-sm"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 text-sky-400" />
              </Link>

              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-line bg-surface hover:border-line/80 hover:text-bone text-bone-dim font-semibold transition-colors shadow-sm"
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
