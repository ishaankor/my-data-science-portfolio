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
    <section className="relative min-h-[92vh] pt-28 pb-16 flex items-center overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-ember/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Intro & Typewriter */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <p className="font-mono text-base sm:text-lg lg:text-xl text-muted tracking-wide mb-3">
              Hi, I&apos;m <span className="text-bone font-bold">{portfolioData.name}</span>
            </p>
            
            {/* Typewriter Line: Natural multi-line word wrapping with bold scale */}
            <h1 className="text-5xl sm:text-6xl lg:text-[4.25rem] xl:text-[4.75rem] font-extrabold tracking-tight text-bone leading-[1.08]">
              <span>I am </span>
              <span className="inline text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
                {currentText}
              </span>
              <span className="inline-block w-[5px] h-[0.8em] bg-ember ml-2 animate-pulse align-middle" />
            </h1>

            <p className="text-xl sm:text-2xl lg:text-[1.55rem] text-bone-dim max-w-2xl leading-relaxed mt-5">
              Building production AI models, autonomous agents, and interactive web tools.
            </p>

            {/* Action CTAs */}
            <div className="mt-7 flex flex-wrap gap-4 items-center font-mono text-xs sm:text-sm">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-ember/50 bg-ember/10 hover:border-ember hover:bg-ember/20 text-bone font-semibold transition-all transform hover:-translate-y-0.5 shadow-md"
              >
                <span>Explore Projects</span>
                <ArrowRight className="w-4 h-4 text-ember" />
              </Link>

              <Link
                href="/resume"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-line bg-surface/80 hover:border-ember hover:text-ember text-bone-dim font-semibold transition-all transform hover:-translate-y-0.5 shadow-sm"
              >
                <FileText className="w-4 h-4 text-muted group-hover:text-ember" />
                <span>View Resume</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Animated & Interactive Memoji Hero Card */}
          <div className="lg:col-span-5 h-[480px] sm:h-[540px] w-full flex items-center justify-center relative">
            <HeroMemojiInteractive />
          </div>

        </div>
      </div>
    </section>
  );
}
