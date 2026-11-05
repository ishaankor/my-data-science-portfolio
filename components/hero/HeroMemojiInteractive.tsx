'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, RotateCcw, ExternalLink, Globe } from 'lucide-react';

export default function HeroMemojiInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [shockwaveKey, setShockwaveKey] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Subtle ambient idle breathing when cursor is not over the card
  useEffect(() => {
    let animId: number;
    const startTime = performance.now();

    const loop = (currentTime: number) => {
      if (!isHovered) {
        const elapsed = (currentTime - startTime) / 1000;
        const idleRotX = Math.sin(elapsed * 0.85) * 3.2;
        const idleRotY = Math.cos(elapsed * 0.65) * (isFlipped ? -3.8 : 3.8);

        setRotateX(idleRotX);
        setRotateY(idleRotY);

        setGlarePos({
          x: 50 + Math.sin(elapsed * 0.65) * 34,
          y: 50 - Math.cos(elapsed * 0.85) * 30,
        });
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, isFlipped]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Controlled, tactile 3D tilt
    const rotX = ((y - centerY) / centerY) * -9;
    const rotY = ((x - centerX) / centerX) * (isFlipped ? -10 : 10);

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePos({
      x: Math.max(0, Math.min(100, (x / rect.width) * 100)),
      y: Math.max(0, Math.min(100, (y / rect.height) * 100)),
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotateX(((y - centerY) / centerY) * -8);
    setRotateY(((x - centerX) / centerX) * (isFlipped ? -8 : 8));
    setGlarePos({
      x: Math.max(0, Math.min(100, (x / rect.width) * 100)),
      y: Math.max(0, Math.min(100, (y / rect.height) * 100)),
    });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleTouchEnd = () => {
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

  // Dynamic 3D levitation shadow & cyan underglow that shift opposite to the card's 3D tilt
  const shadowX = Math.round(-rotateY * 2.2);
  const shadowY = Math.round(rotateX * 2.2 + 24);
  const glowX = Math.round(rotateY * 1.5);
  const glowY = Math.round(-rotateX * 1.5);
  const dynamicCardShadow = isHovered
    ? `${shadowX}px ${shadowY}px 55px -8px rgba(0, 0, 0, 0.88), ${glowX}px ${glowY}px 38px -4px rgba(56, 189, 248, 0.22), 0 0 22px rgba(255, 255, 255, 0.05)`
    : `${shadowX}px ${shadowY}px 45px -10px rgba(0, 0, 0, 0.82), ${glowX}px ${glowY}px 28px -6px rgba(56, 189, 248, 0.13)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full min-h-[420px] sm:min-h-[490px] lg:min-h-[530px] flex items-center justify-center p-2 sm:p-4 relative select-none [perspective:1200px]"
    >
      {/* 3D Tilted Card Container - Expanded spacious proportions */}
      <div
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        data-cursor="hover"
        aria-label={
          isFlipped
            ? 'Avatar card showing personal website link. Click or press Enter to flip front.'
            : 'Interactive avatar card. Click or press Enter to flip.'
        }
        className="w-full max-w-[340px] xs:max-w-[380px] sm:max-w-[450px] lg:max-w-[500px] xl:max-w-[530px] h-[360px] xs:h-[400px] sm:h-[460px] lg:h-[510px] xl:h-[540px] relative transition-transform duration-200 ease-out cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 rounded-3xl"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
            isHovered ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'
          }`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Levitating 3D Underglow Halo (shifts opposite to tilt on a deeper Z plane) */}
        <div
          className="absolute -inset-3 rounded-[2rem] pointer-events-none transition-opacity duration-300 blur-2xl"
          style={{
            opacity: isHovered ? 0.85 : 0.5,
            transform: `translate3d(${-rotateY * 1.8}px, ${rotateX * 1.8 + 10}px, -28px)`,
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(56, 189, 248, 0.28) 0%, rgba(129, 140, 248, 0.14) 45%, transparent 78%)`,
          }}
          aria-hidden="true"
        />

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
            className="absolute inset-0 w-full h-full rounded-3xl border border-white/10 bg-[#0b1429]/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 lg:p-7 overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
              boxShadow: dynamicCardShadow,
            }}
          >
            {/* Tilt-Reactive Holographic Foil Sheen (Balatro / TCG Style — coupled to 3D tilt & breathing) */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-[1] transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0.75,
                backgroundImage: `linear-gradient(${115 + rotateY * 2.2 - rotateX * 1.6}deg, transparent 20%, rgba(56, 189, 248, 0.06) 36%, rgba(165, 243, 252, 0.14) 43%, rgba(255, 255, 255, 0.2) 47%, rgba(192, 132, 252, 0.11) 51%, rgba(56, 189, 248, 0.12) 56%, transparent 72%)`,
                backgroundSize: '260% 260%',
                backgroundPosition: `${100 - glarePos.x}% ${100 - glarePos.y}%`,
                maskImage: `radial-gradient(circle 310px at ${glarePos.x}% ${glarePos.y}%, black 0%, rgba(0,0,0,0.55) 45%, transparent 82%)`,
                WebkitMaskImage: `radial-gradient(circle 310px at ${glarePos.x}% ${glarePos.y}%, black 0%, rgba(0,0,0,0.55) 45%, transparent 82%)`,
              }}
              aria-hidden="true"
            />

            {/* Tilt-Reactive 1.5px Fresnel Perimeter Rim Highlight */}
            <div
              className="absolute inset-0 rounded-3xl p-[1.5px] pointer-events-none overflow-hidden z-20 transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0.7,
                background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.85) 0%, rgba(56, 189, 248, 0.55) 35%, rgba(192, 132, 252, 0.28) 60%, transparent 85%)`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
              }}
              aria-hidden="true"
            />

            {/* Cursor-Tracking Soft Specular Glare */}
            <div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none overflow-hidden z-[2] transition-opacity duration-300"
              style={{
                opacity: isHovered ? 0.9 : 0.4,
                background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.09) 0%, rgba(56, 189, 248, 0.06) 35%, transparent 70%)`,
              }}
              aria-hidden="true"
            />

            {/* Top Header Row */}
            <div
              className="w-full flex items-center justify-between z-10 font-mono text-[10px] sm:text-xs border-b border-white/[0.08] pb-2 sm:pb-3"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0" aria-hidden="true">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] sm:text-xs text-slate-300 font-medium ml-0.5 sm:ml-1">ishaan.avatar</span>
              </div>

              {/* Clean Flip Badge */}
              <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-mono text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10 transition-colors shadow-sm whitespace-nowrap shrink-0">
                <RotateCw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#38bdf8] shrink-0" />
                <span>Click to flip</span>
              </div>
            </div>

            {/* Center: Avatar Portrait with Spatial Parallax */}
            <div
              className="relative my-auto flex items-center justify-center select-none z-10"
              style={{ transform: 'translateZ(55px)' }}
            >
              {/* Floating Avatar Wrapper */}
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
                {/* Synchronized Concentric Ripple Rings */}
                <div className="absolute inset-0 rounded-full pointer-events-none" aria-hidden="true">
                  <div className="absolute inset-0 rounded-full border border-sky-400/30 bg-sky-500/5 animate-avatar-sync-ripple-1 shadow-[0_0_20px_rgba(56,189,248,0.2)]" />
                  <div className="absolute inset-0 rounded-full border border-sky-400/20 bg-sky-500/5 animate-avatar-sync-ripple-2 shadow-[0_0_15px_rgba(56,189,248,0.15)]" />

                  {/* Click Shockwave Burst */}
                  {shockwaveKey > 0 && (
                    <div
                      key={shockwaveKey}
                      className="absolute inset-0 rounded-full border-2 border-[#38bdf8] animate-avatar-shockwave bg-sky-500/20"
                    />
                  )}
                </div>

                {/* Soft Core Glow behind Avatar */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-sky-500/20 via-sky-400/15 to-indigo-500/20 blur-lg opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Avatar Image Container: Spacious, balanced portrait with comfortable clearance */}
                <div className="relative w-32 h-32 xs:w-36 xs:h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 xl:w-52 xl:h-52 rounded-full overflow-hidden border-2 border-white/20 bg-[#060a14] shadow-[0_14px_40px_-8px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.25)] transition-all duration-300 hover:border-sky-400/80 hover:shadow-[0_16px_45px_-6px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.4)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/personal-picture.avif"
                    alt="Ishaan Koradia"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />

                  {/* Tilt-Reactive Medallion Lens Reflection */}
                  <div
                    className="absolute inset-0 rounded-full pointer-events-none overflow-hidden z-10 transition-opacity duration-300"
                    style={{
                      opacity: isHovered ? 0.95 : 0.65,
                      background: `radial-gradient(circle 150px at ${100 - glarePos.x * 0.75}% ${100 - glarePos.y * 0.75}%, rgba(255, 255, 255, 0.22) 0%, rgba(56, 189, 248, 0.1) 40%, transparent 72%)`,
                    }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Status Row */}
            <div
              className="w-full pt-2 sm:pt-3 border-t border-white/[0.08] flex items-center justify-between font-mono text-[9px] xs:text-[10px] sm:text-xs z-10"
              style={{ transform: 'translateZ(20px)' }}
            >
              <span className="flex items-center gap-1.5 sm:gap-2 text-emerald-400">
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-semibold truncate max-w-[130px] xs:max-w-none">Building AI &amp; Agents</span>
              </span>

              <span className="text-slate-400 text-[9px] xs:text-[10px] sm:text-[11px] truncate">San Jose / San Diego</span>
            </div>
          </div>

          {/* ================= BACK FACE ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl border border-white/10 bg-[#0b1429]/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 lg:p-7 overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              boxShadow: dynamicCardShadow,
            }}
          >
            {/* Tilt-Reactive Holographic Foil Sheen on Back (Balatro / TCG Style) */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-[1] transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0.75,
                backgroundImage: `linear-gradient(${115 + rotateY * 2.2 - rotateX * 1.6}deg, transparent 20%, rgba(56, 189, 248, 0.06) 36%, rgba(165, 243, 252, 0.14) 43%, rgba(255, 255, 255, 0.2) 47%, rgba(192, 132, 252, 0.11) 51%, rgba(56, 189, 248, 0.12) 56%, transparent 72%)`,
                backgroundSize: '260% 260%',
                backgroundPosition: `${100 - glarePos.x}% ${100 - glarePos.y}%`,
                maskImage: `radial-gradient(circle 310px at ${glarePos.x}% ${glarePos.y}%, black 0%, rgba(0,0,0,0.55) 45%, transparent 82%)`,
                WebkitMaskImage: `radial-gradient(circle 310px at ${glarePos.x}% ${glarePos.y}%, black 0%, rgba(0,0,0,0.55) 45%, transparent 82%)`,
              }}
              aria-hidden="true"
            />

            {/* Tilt-Reactive 1.5px Fresnel Perimeter Rim Highlight on Back */}
            <div
              className="absolute inset-0 rounded-3xl p-[1.5px] pointer-events-none overflow-hidden z-20 transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0.7,
                background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.85) 0%, rgba(56, 189, 248, 0.55) 35%, rgba(192, 132, 252, 0.28) 60%, transparent 85%)`,
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
              }}
              aria-hidden="true"
            />

            {/* Top Header Row */}
            <div
              className="w-full flex items-center justify-between z-10 font-mono text-[10px] sm:text-xs border-b border-white/[0.08] pb-2 sm:pb-3"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0" aria-hidden="true">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] sm:text-xs text-slate-300 font-medium ml-0.5 sm:ml-1">ishaan.personal_site</span>
              </div>

              {/* Flip back button - guaranteed single line */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-mono text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-full px-2.5 py-1 transition-colors shadow-sm whitespace-nowrap shrink-0"
                aria-label="Flip back to front"
              >
                <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#38bdf8] shrink-0" />
                <span>Flip front</span>
              </button>
            </div>

            {/* Center Area: Spacious Speech Bubble */}
            <div
              className="w-full my-auto flex flex-col items-center justify-center gap-3 sm:gap-4 relative z-10"
              style={{ transform: 'translateZ(45px)' }}
            >
              <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[410px] bg-[#0f1b36] border border-white/10 rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xl text-center">
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0f1b36] border-r border-b border-white/10 rotate-45 transform" />

                <p className="text-xs sm:text-sm lg:text-[15px] text-slate-200 leading-relaxed mb-3 sm:mb-4 font-sans">
                  Looking for my full personal hub, writings, and interactive projects?
                </p>

                {/* Direct Link */}
                <a
                  href="https://ishaankoradia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group/btn relative inline-flex items-center justify-center gap-2 w-full py-2.5 sm:py-3 px-4 rounded-xl bg-white hover:bg-sky-50 text-slate-900 font-mono text-xs sm:text-sm font-semibold shadow-md transition-all duration-200 border border-white"
                >
                  <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 group-hover/btn:rotate-12 transition-transform duration-300 shrink-0" />
                  <span>ishaankoradia.com</span>
                  <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-700 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200 shrink-0" />
                </a>
              </div>

              {/* Avatar Mini Indicator */}
              <div className="flex items-center gap-2 sm:gap-3 mt-1">
                <div className="relative w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full p-0.5 border border-white/15 bg-[#0f1b36] shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#060a14] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/personal-picture.avif"
                      alt="Ishaan Koradia"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-emerald-500 border-2 border-[#0b1429] flex items-center justify-center"
                    title="Online"
                  >
                    <span className="w-1 h-1 rounded-full bg-white" />
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Status Row on Back */}
            <div
              className="w-full pt-2 sm:pt-3 border-t border-white/[0.08] flex items-center justify-between font-mono text-[9px] sm:text-[11px] text-slate-400 z-10"
              style={{ transform: 'translateZ(20px)' }}
            >
              <span className="flex items-center gap-1.5 text-sky-300">
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#38bdf8] shrink-0" />
                <span className="text-[9px] sm:text-[11px]">ishaankoradia.com</span>
              </span>

              <span className="text-slate-400 text-[9px] sm:text-[10px]">
                Click to flip
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
