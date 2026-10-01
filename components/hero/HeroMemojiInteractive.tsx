'use client';

import React, { useState, useRef } from 'react';
import { RotateCw, RotateCcw, Sparkles, ExternalLink, Globe } from 'lucide-react';

export default function HeroMemojiInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [shockwaveKey, setShockwaveKey] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate 3D tilt angles (reverse Y tilt when card is flipped for natural feel)
    const rotX = ((y - centerY) / centerY) * -10;
    const rotY = ((x - centerX) / centerX) * (isFlipped ? -10 : 10);

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleCardClick = () => {
    setShockwaveKey((k) => k + 1);
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped((prev) => !prev);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full min-h-[440px] sm:min-h-[480px] flex items-center justify-center p-2 sm:p-4 relative select-none [perspective:1200px]"
    >
      {/* 3D Tilted Card Container */}
      <div
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        data-cursor="hover"
        aria-label={
          isFlipped
            ? 'Avatar card showing personal website link. Click or press Enter to flip front.'
            : 'Interactive 3D avatar card. Click or press Enter to flip.'
        }
        className="w-full max-w-[440px] h-[430px] sm:h-[460px] relative transition-transform duration-200 ease-out cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ember/50 rounded-3xl"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
            isHovered ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'
          }`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Flip Inner Container: handles 180-degree flip */}
        <div
          className="w-full h-full relative"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s cubic-bezier(0.34, 1.25, 0.64, 1)',
          }}
        >
          {/* ================= FRONT FACE ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl border border-line bg-[#080c16]/95 backdrop-blur-2xl shadow-float flex flex-col items-center justify-between p-6 sm:p-8 overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
            {/* Dynamic Sheen / Glare Overlay */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl opacity-20 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
              }}
            />

            {/* Top Header Row: Status Bar */}
            <div
              className="w-full flex items-center justify-between z-10 font-mono text-xs border-b border-line/70 pb-3.5"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-muted ml-1 font-bold">ishaan.avatar</span>
              </div>

              {/* Click to flip affordance badge */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-bone-dim/90 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full border border-line/60 transition-colors shadow-sm">
                <RotateCw className="w-3 h-3 text-ember" />
                <span>Click to flip</span>
              </div>
            </div>

            {/* Center: Clean Interactive Animated Avatar with Synchronized Ripples & Bounce */}
            <div
              className="relative my-auto flex items-center justify-center select-none"
              style={{ transform: 'translateZ(50px)' }}
            >
              {/* Bouncing & Floating Avatar Wrapper with Synchronized Ripple Aura */}
              <div
                className={`relative cursor-pointer transition-transform duration-300 ${
                  isAvatarHovered ? 'animate-avatar-hover-spring' : 'animate-avatar-sync-bounce'
                }`}
                onMouseEnter={() => setIsAvatarHovered(true)}
                onMouseLeave={() => setIsAvatarHovered(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  setShockwaveKey((k) => k + 1);
                  setIsFlipped((prev) => !prev);
                }}
              >
                {/* Synchronized Concentric Ripple Rings (travels WITH avatar, 100% concentric) */}
                <div className="absolute inset-0 rounded-full pointer-events-none" aria-hidden="true">
                  {/* Wave 1: In sync with bounce landing */}
                  <div className="absolute inset-0 rounded-full border border-emerald-400/40 bg-emerald-500/10 animate-avatar-sync-ripple-1 shadow-[0_0_20px_rgba(16,185,129,0.25)]" />
                  {/* Wave 2: Staggered half-cycle */}
                  <div className="absolute inset-0 rounded-full border border-teal-400/35 bg-teal-500/5 animate-avatar-sync-ripple-2 shadow-[0_0_20px_rgba(45,212,191,0.2)]" />

                  {/* Click Shockwave Burst */}
                  {shockwaveKey > 0 && (
                    <div
                      key={shockwaveKey}
                      className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-avatar-shockwave bg-emerald-500/20"
                    />
                  )}
                </div>

                {/* Soft Ambient Core Glow behind Avatar */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-emerald-500/25 via-teal-500/20 to-cyan-500/25 blur-lg opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Avatar Image Container with Natural Contact Depth Shadow */}
                <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-line/90 bg-ink shadow-[0_14px_40px_-8px_rgba(0,0,0,0.7),0_0_25px_rgba(16,185,129,0.25)] transition-all duration-300 hover:border-emerald-400/80 hover:shadow-[0_16px_50px_-6px_rgba(0,0,0,0.8),0_0_35px_rgba(16,185,129,0.45)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/personal-picture.avif"
                    alt="Avatar"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Status Row */}
            <div
              className="w-full pt-3.5 border-t border-line/70 flex items-center justify-between font-mono text-xs text-muted z-10"
              style={{ transform: 'translateZ(20px)' }}
            >
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-bold">Building AI &amp; Agents</span>
              </span>

              <span className="text-bone-dim">San Jose / San Diego, CA</span>
            </div>
          </div>

          {/* ================= BACK FACE ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl border border-line bg-[#080c16]/95 backdrop-blur-2xl shadow-float flex flex-col items-center justify-between p-6 sm:p-7 overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Dynamic Sheen / Glare Overlay (reflected for back side) */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl opacity-20 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${100 - glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
              }}
            />

            {/* Top Header Row */}
            <div
              className="w-full flex items-center justify-between z-10 font-mono text-xs border-b border-line/70 pb-3"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-muted ml-1 font-bold">ishaan.personal_site</span>
              </div>

              {/* Flip back button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="flex items-center gap-1.5 text-[11px] font-mono text-ember hover:text-amber-300 bg-ember/10 hover:bg-ember/20 border border-ember/30 rounded-full px-2.5 py-1 transition-colors shadow-sm"
                aria-label="Flip back to front"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Flip front</span>
              </button>
            </div>

            {/* Center Area: Speech Bubble from Avatar */}
            <div
              className="w-full my-auto flex flex-col items-center justify-center gap-3 relative z-10"
              style={{ transform: 'translateZ(45px)' }}
            >
              {/* Sleek Modern Speech Bubble */}
              <div className="relative w-full max-w-[340px] bg-surface border border-line rounded-2xl p-4 sm:p-5 shadow-panel text-center">
                {/* Speech Bubble Tail pointing down to avatar */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface border-r border-b border-line rotate-45 transform" />

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-ink border border-line font-mono text-[11px] text-bone-dim mb-2 font-medium">
                  <Sparkles className="w-3 h-3 text-ember" />
                  <span>Hey there!</span>
                </div>

                <p className="text-xs sm:text-[13px] text-bone leading-relaxed mb-3.5 font-sans">
                  Looking for my full personal hub, writings, and interactive projects?
                </p>

                {/* Direct Link to ishaankoradia.com */}
                <a
                  href="https://ishaankoradia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group/btn relative inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-ember hover:bg-ember/90 text-ink font-mono text-xs sm:text-sm font-bold shadow-sm transition-all duration-200 border border-ember"
                >
                  <Globe className="w-4 h-4 text-ink group-hover/btn:rotate-12 transition-transform duration-300" />
                  <span>ishaankoradia.com</span>
                  <ExternalLink className="w-3.5 h-3.5 text-ink/80 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                </a>
              </div>

              {/* Avatar Mini Circle */}
              <div className="flex items-center gap-3 mt-1">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 border border-line bg-surface shadow-sm">
                  {/* Subtle ripple ping */}
                  <div className="absolute -inset-1 rounded-full border border-emerald-400/40 animate-ping opacity-25 pointer-events-none" />
                  <div className="w-full h-full rounded-full overflow-hidden bg-ink/90 border border-line flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/personal-picture.avif"
                      alt="Ishaan Koradia Memoji"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#080c16] flex items-center justify-center"
                    title="Online"
                  >
                    <span className="w-1 h-1 rounded-full bg-white" />
                  </span>
                </div>

                {/* <div className="text-left font-mono">
                  <div className="text-xs font-bold text-bone">Ishaan Koradia</div>
                  {/* <div className="text-[10px] text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Always exploring &amp; building
                  </div> */}
                {/* </div> */}
              </div>
            </div>

            {/* Bottom Status Row on Back */}
            {/* <div
              className="w-full pt-3 border-t border-line/70 flex items-center justify-between font-mono text-[11px] text-muted z-10"
              style={{ transform: 'translateZ(20px)' }}
            >
              <span className="flex items-center gap-1.5 text-bone-dim">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>ishaankoradia.com</span>
              </span>

              <span className="text-muted/80 text-[10px]">
                Click card to flip front
              </span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

