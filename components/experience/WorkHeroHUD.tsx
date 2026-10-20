'use client';

import React, { useState, useEffect } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

const certLogos = [
  {
    name: 'Anthropic',
    src: '/images/anthropic-icon-tdvkiqisswbrmtkiygb0ia.webp',
    className: 'object-contain filter invert p-0.5',
    bg: 'bg-purple-950/40 border-purple-500/30',
  },
  {
    name: 'Google',
    src: '/images/google.png',
    className: 'object-contain p-0.5',
    bg: 'bg-white border-white/20',
  },
  {
    name: 'DataCamp',
    src: '/images/datacamp.jpg',
    className: 'object-cover rounded',
    bg: 'bg-emerald-950/40 border-emerald-500/30',
  },
];

function CertRotatingIconSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % certLogos.length);
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  const current = certLogos[index];

  return (
    <div
      className={`w-8 h-8 rounded-lg border flex items-center justify-center p-1 overflow-hidden transition-colors duration-500 relative ${current.bg}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.name}
          initial={{ opacity: 0, y: 6, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.85 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-full h-full flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.src}
            alt={current.name}
            className={`w-full h-full ${current.className}`}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function WorkHeroHUD() {
  return (
    <section className="relative pt-24 pb-14 overflow-hidden border-b border-line/60">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-8">
        
        {/* Top Telemetry Path & Status Tag */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-muted">
              <span className="text-bone">02 // CAREER &amp; EDUCATION</span>
              <span className="text-line">/</span>
              <span className="text-ember">EXPERIENCE PATHWAY</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Title & Description */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-bone tracking-tight leading-[1.12]">
              Experience &amp; Background
            </h1>
            <p className="text-bone-dim text-base sm:text-lg leading-relaxed max-w-2xl">
              AI Engineer with experience in frontier LLM evaluation, golden benchmark datasets, computer vision, and machine learning systems.
            </p>
          </div>
        </ScrollReveal>

        {/* Grounded Experience Highlights Grid */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            
            {/* Card 1: Handshake AI */}
            <div className="rounded-xl border border-line bg-surface p-5 shadow-panel flex flex-col justify-between hover:border-line/80 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-lime-950/30 border border-lime-400/20 flex items-center justify-center p-1 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/handshake-ai.jpg"
                    alt="Handshake AI"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <span className="font-mono text-[0.65rem] text-muted uppercase font-semibold">AI Engineering</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-bone">Handshake AI</p>
                <p className="font-mono text-xs text-muted mt-1">LLM Eval &amp; Nemotron-12B</p>
              </div>
            </div>

            {/* Card 2: Verizon */}
            <div className="rounded-xl border border-line bg-surface p-5 shadow-panel flex flex-col justify-between hover:border-line/80 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-950/30 border border-red-500/20 flex items-center justify-center p-1.5 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/Verizon.svg"
                    alt="Verizon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="font-mono text-[0.65rem] text-muted uppercase font-semibold">Project Engineering</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-bone">Verizon</p>
                <p className="font-mono text-xs text-muted mt-1">Computer Vision &amp; OpenCV</p>
              </div>
            </div>

            {/* Card 3: UC San Diego */}
            <div className="rounded-xl border border-line bg-surface p-5 shadow-panel flex flex-col justify-between hover:border-line/80 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-white/20 flex items-center justify-center p-1 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/ucsd-logo copy.png"
                    alt="UC San Diego"
                    className="w-full h-full object-contain scale-105"
                  />
                </div>
                <span className="font-mono text-[0.65rem] text-muted uppercase font-semibold">Academic Foundation</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-bone">UC San Diego</p>
                <p className="font-mono text-xs text-muted mt-1">B.S. Cognitive Science (ML)</p>
              </div>
            </div>

            {/* Card 4: Technical Credentials */}
            <div className="rounded-xl border border-line bg-surface p-5 shadow-panel flex flex-col justify-between hover:border-line/80 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <CertRotatingIconSlider />
                <span className="font-mono text-[0.65rem] text-muted uppercase font-semibold">Specializations</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold text-bone">Certifications</p>
                <p className="font-mono text-xs text-muted mt-1">Anthropic • Google • DataCamp</p>
              </div>
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
