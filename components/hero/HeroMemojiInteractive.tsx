'use client';

import React, { useState, useRef } from 'react';

export default function HeroMemojiInteractive() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate 3D tilt angles
    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;

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
        className="w-full max-w-[440px] h-[420px] sm:h-[450px] rounded-3xl border border-line bg-[#080c16]/95 backdrop-blur-2xl shadow-float relative flex flex-col items-center justify-between p-7 sm:p-8 transition-transform duration-200 ease-out overflow-hidden"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
            isHovered ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'
          }`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Sheen / Glare Overlay */}
        <div
          className="absolute inset-0 pointer-events-none rounded-3xl opacity-30 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.2) 0%, transparent 60%)`,
          }}
        />

        {/* Ambient Radial Gradient Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-tr from-ember/30 via-purple-600/30 to-cyan-400/25 blur-[70px] pointer-events-none" />

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

          <span className="text-[0.7rem] font-mono text-muted/70 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>active</span>
          </span>
        </div>

        {/* Center: Clean, Large Interactive Animated Memoji Avatar */}
        <div
          className="relative my-auto flex flex-col items-center justify-center group"
          style={{ transform: 'translateZ(50px)' }}
        >
          {/* Animated Glowing Orbital Rings in Background */}
          <div
            className="absolute w-52 h-52 sm:w-56 sm:h-56 rounded-full border border-dashed border-ember/40 animate-spin pointer-events-none"
            style={{ animationDuration: '24s' }}
          />
          <div
            className="absolute w-42 h-42 sm:w-46 sm:h-46 rounded-full border border-indigo-500/30 animate-spin pointer-events-none"
            style={{ animationDuration: '16s', animationDirection: 'reverse' }}
          />

          {/* Memoji Image Container */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden p-1.5 bg-gradient-to-tr from-ember via-purple-500 to-indigo-400 shadow-2xl transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full rounded-full overflow-hidden bg-ink/90 relative border border-line flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/personal-picture.avif"
                alt="Ishaan Koradia Memoji"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
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
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-bold">Building AI &amp; Agents</span>
          </span>

          <span className="text-bone-dim">San Jose / San Diego, CA</span>
        </div>
      </div>
    </div>
  );
}
