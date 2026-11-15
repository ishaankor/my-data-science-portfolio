'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import { ArrowRight, FileText } from 'lucide-react';

import HeroMemojiInteractive from './HeroMemojiInteractive';

export default function HeroSection() {
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentText, setCurrentText] = useState(portfolioData.typingStrings[0] || 'an AI Engineer.');
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
    <section aria-label="Introduction" className="hero-banner">
      {/* Apparent Section-Wide Ambient White Underglow */}
      <div
        className="hero-ambient-glow"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.05) 40%, rgba(226, 232, 240, 0.015) 65%, transparent 80%)',
          filter: 'blur(75px)',
        }}
        aria-hidden="true"
      />

      <div className="hero-container">
        <div className="hero-grid">
          
          {/* Left Column: Intro & Typewriter (Grand Entrance) */}
          <header className="hero-copy-col">
            {/* Luminous White Core Underglow directly behind the hero headline */}
            <div
              className="hero-core-glow"
              style={{
                background:
                  'radial-gradient(ellipse 65% 55% at 42% 48%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.09) 35%, rgba(241, 245, 249, 0.02) 60%, transparent 80%)',
                filter: 'blur(55px)',
              }}
              aria-hidden="true"
            />

            {/* Grand Entrance Headline */}
            <h1 className="hero-title">
              <span className="hero-greeting">
                I am
              </span>
              
              {/* Massive typewriter role: unified text stream, zero letter shifting, no orphaned cursor */}
              <span className="hero-typewriter-wrap">
                <span 
                  className="hero-typewriter-text"
                  style={{
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >{currentText}</span><span 
                  className="hero-cursor" 
                  aria-hidden="true"
                />
              </span>
            </h1>

            <p className="hero-lead">
              Building production AI models, autonomous agents, and interactive web tools.
            </p>

            {/* Action CTAs */}
            <div className="hero-cta-group">
              <Link
                href="/projects"
                className="btn-primary-cta"
              >
                <span>Explore Projects</span>
                <ArrowRight aria-hidden="true" />
              </Link>

              <Link
                href="/resume"
                className="btn-secondary-cta"
              >
                <FileText aria-hidden="true" />
                <span>View Resume</span>
              </Link>
            </div>

          </header>

          {/* Right Column: Animated & Interactive Memoji Hero Card */}
          <aside className="hero-visual-col" aria-label="Interactive Profile Card">
            <HeroMemojiInteractive />
          </aside>

        </div>
      </div>
    </section>
  );
}
