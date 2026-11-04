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
        const idleRotX = Math.sin(elapsed * 0.9) * 2.2;
        const idleRotY = Math.cos(elapsed * 0.7) * (isFlipped ? -2.8 : 2.8);

        setRotateX(idleRotX);
        setRotateY(idleRotY);

        setGlarePos({
          x: 50 + Math.sin(elapsed * 0.7) * 22,
          y: 50 + Math.cos(elapsed * 0.9) * 18,
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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full min-h-[400px] sm:min-h-[470px] flex items-center justify-center p-2 sm:p-4 relative select-none [perspective:1200px]"
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
            : 'Interactive avatar card. Click or press Enter to flip.'
        }
        className="w-full max-w-[410px] h-[390px] sm:h-[460px] relative transition-transform duration-200 ease-out cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 rounded-3xl"
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
            className="absolute inset-0 w-full h-full rounded-3xl border border-white/10 bg-[#0b1429]/95 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.06)] flex flex-col items-center justify-between p-5 sm:p-7 overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
            {/* Ambient Specular Foil Sheen Sweep (Subtle, Monochrome / Ice-Cyan, Zero CD Rainbow) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-20" aria-hidden="true">
              <div
                className="absolute -inset-[150%] w-[400%] h-[400%] animate-specular-sweep pointer-events-none"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.05) 47%, rgba(255, 255, 255, 0.32) 50%, rgba(56, 189, 248, 0.18) 53%, transparent 60%)',
                  mixBlendMode: 'overlay',
                }}
              />
            </div>

            {/* Cursor-Tracking Soft Specular Glare */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden z-10 transition-opacity duration-300"
              style={{
                opacity: isHovered ? 1 : 0.35,
                background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.12) 0%, rgba(56, 189, 248, 0.08) 35%, transparent 70%)`,
              }}
              aria-hidden="true"
            />

            {/* Top Header Row */}
            <div
              className="w-full flex items-center justify-between z-10 font-mono text-xs border-b border-white/[0.08] pb-3"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-300 font-medium ml-1">ishaan.avatar</span>
              </div>

              {/* Clean Flip Badge */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] px-2.5 py-1 rounded-full border border-white/10 transition-colors shadow-sm">
                <RotateCw className="w-3 h-3 text-[#38bdf8]" />
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

                {/* Avatar Image Container */}
                <div className="relative w-32 h-32 sm:w-38 sm:h-38 rounded-full overflow-hidden border-2 border-white/20 bg-[#060a14] shadow-[0_14px_40px_-8px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.25)] transition-all duration-300 hover:border-sky-400/80 hover:shadow-[0_16px_45px_-6px_rgba(0,0,0,0.85),0_0_30px_rgba(56,189,248,0.4)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/personal-picture.avif"
                    alt="Ishaan Koradia"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Status Row */}
            <div
              className="w-full pt-3 border-t border-white/[0.08] flex items-center justify-between font-mono text-[11px] sm:text-xs z-10"
              style={{ transform: 'translateZ(20px)' }}
            >
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="font-semibold">Building AI &amp; Agents</span>
              </span>

              <span className="text-slate-400 text-[11px]">San Jose / San Diego, CA</span>
            </div>
          </div>

          {/* ================= BACK FACE ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl border border-white/10 bg-[#0b1429]/95 backdrop-blur-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),0_0_20px_rgba(56,189,248,0.06)] flex flex-col items-center justify-between p-5 sm:p-7 overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Ambient Sheen Sweep on Back */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-20" aria-hidden="true">
              <div
                className="absolute -inset-[150%] w-[400%] h-[400%] animate-specular-sweep pointer-events-none"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.05) 47%, rgba(255, 255, 255, 0.32) 50%, rgba(56, 189, 248, 0.18) 53%, transparent 60%)',
                  mixBlendMode: 'overlay',
                }}
              />
            </div>

            {/* Top Header Row */}
            <div
              className="w-full flex items-center justify-between z-10 font-mono text-xs border-b border-white/[0.08] pb-3"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="flex items-center gap-2" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-xs text-slate-300 font-medium ml-1">ishaan.personal_site</span>
              </div>

              {/* Flip back button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-full px-2.5 py-1 transition-colors shadow-sm"
                aria-label="Flip back to front"
              >
                <RotateCcw className="w-3 h-3 text-[#38bdf8]" />
                <span>Flip front</span>
              </button>
            </div>

            {/* Center Area: Speech Bubble */}
            <div
              className="w-full my-auto flex flex-col items-center justify-center gap-3 relative z-10"
              style={{ transform: 'translateZ(45px)' }}
            >
              <div className="relative w-full max-w-[330px] bg-[#0f1b36] border border-white/10 rounded-2xl p-4 shadow-xl text-center">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0f1b36] border-r border-b border-white/10 rotate-45 transform" />

                <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed mb-3.5 font-sans">
                  Looking for my full personal hub, writings, and interactive projects?
                </p>

                {/* Direct Link */}
                <a
                  href="https://ishaankoradia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="group/btn relative inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white hover:bg-sky-50 text-slate-900 font-mono text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 border border-white"
                >
                  <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-900 group-hover/btn:rotate-12 transition-transform duration-300" />
                  <span>ishaankoradia.com</span>
                  <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-700 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                </a>
              </div>

              {/* Avatar Mini Indicator */}
              <div className="flex items-center gap-3 mt-1">
                <div className="relative w-12 h-12 rounded-full p-0.5 border border-white/15 bg-[#0f1b36] shadow-sm">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#060a14] flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/personal-picture.avif"
                      alt="Ishaan Koradia"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0b1429] flex items-center justify-center"
                    title="Online"
                  >
                    <span className="w-1 h-1 rounded-full bg-white" />
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Status Row on Back */}
            <div
              className="w-full pt-3 border-t border-white/[0.08] flex items-center justify-between font-mono text-[11px] text-slate-400 z-10"
              style={{ transform: 'translateZ(20px)' }}
            >
              <span className="flex items-center gap-1.5 text-sky-300">
                <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>ishaankoradia.com</span>
              </span>

              <span className="text-slate-400 text-[10px]">
                Click card to flip front
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
