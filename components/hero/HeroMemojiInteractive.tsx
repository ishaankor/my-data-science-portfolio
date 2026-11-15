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
      className="memoji-scene"
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
        className="memoji-card-stage"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${
            isHovered ? 'scale3d(1.02, 1.02, 1.02)' : 'scale3d(1, 1, 1)'
          }`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Levitating 3D Underglow Halo (shifts opposite to tilt on a deeper Z plane) */}
        <div
          className="memoji-underglow"
          style={{
            opacity: isHovered ? 0.85 : 0.5,
            transform: `translate3d(${-rotateY * 1.8}px, ${rotateX * 1.8 + 10}px, -28px)`,
            background: `radial-gradient(circle 280px at ${glarePos.x}% ${glarePos.y}%, rgba(56, 189, 248, 0.28) 0%, rgba(129, 140, 248, 0.14) 45%, transparent 78%)`,
          }}
          aria-hidden="true"
        />

        {/* Flip Inner Container: handles 180-degree flip */}
        <div
          className="memoji-flipper"
          style={{
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s cubic-bezier(0.34, 1.25, 0.64, 1)',
          }}
        >
          {/* ================= FRONT FACE ================= */}
          <div
            className="memoji-face"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
              boxShadow: dynamicCardShadow,
            }}
          >
            {/* Tilt-Reactive Holographic Foil Sheen */}
            <div
              className="memoji-foil-layer"
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
              className="memoji-rim-layer"
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
              className="memoji-glare-layer"
              style={{
                opacity: isHovered ? 0.9 : 0.4,
                background: `radial-gradient(circle 320px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.09) 0%, rgba(56, 189, 248, 0.06) 35%, transparent 70%)`,
              }}
              aria-hidden="true"
            />

            {/* Top Header Row */}
            <div
              className="memoji-topbar"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="memoji-dots-group" aria-hidden="true">
                <span className="memoji-dot-red" />
                <span className="memoji-dot-amber" />
                <span className="memoji-dot-green" />
                <span className="memoji-window-label">ishaan.avatar</span>
              </div>

              {/* Clean Flip Badge */}
              <div className="memoji-flip-pill">
                <RotateCw className="icon-xs-accent" aria-hidden="true" />
                <span>Click to flip</span>
              </div>
            </div>

            {/* Center: Avatar Portrait with Spatial Parallax */}
            <div
              className="memoji-portrait-stage"
              style={{ transform: 'translateZ(55px)' }}
            >
              {/* Floating Avatar Wrapper */}
              <div
                className={isAvatarHovered ? 'animate-avatar-hover-spring' : 'animate-avatar-sync-bounce'}
                onMouseEnter={() => setIsAvatarHovered(true)}
                onMouseLeave={() => setIsAvatarHovered(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  setShockwaveKey((k) => k + 1);
                  setIsFlipped((prev) => !prev);
                }}
              >
                {/* Synchronized Concentric Ripple Rings */}
                <div className="memoji-ripple-group" aria-hidden="true">
                  <div className="memoji-ripple-inner" />
                  <div className="memoji-ripple-outer" />

                  {/* Click Shockwave Burst */}
                  {shockwaveKey > 0 && (
                    <div
                      key={shockwaveKey}
                      className="memoji-shockwave-ring"
                    />
                  )}
                </div>

                {/* Soft Core Glow behind Avatar */}
                <div className="memoji-core-aura" aria-hidden="true" />

                {/* Avatar Image Container */}
                <div className="memoji-medallion">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/personal-picture.avif"
                    alt="Ishaan Koradia"
                    className="memoji-portrait-img"
                  />

                  {/* Tilt-Reactive Medallion Lens Reflection */}
                  <div
                    className="memoji-lens-glare"
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
              className="memoji-bottombar"
              style={{ transform: 'translateZ(20px)' }}
            >
              <span className="memoji-status-badge">
                <span className="memoji-ping-wrap" aria-hidden="true">
                  <span className="memoji-ping-ring" />
                  <span className="memoji-ping-dot" />
                </span>
                <span className="memoji-status-label">Building AI &amp; Agents</span>
              </span>

              <span className="memoji-location-label">San Jose / San Diego</span>
            </div>
          </div>

          {/* ================= BACK FACE ================= */}
          <div
            className="memoji-face"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              boxShadow: dynamicCardShadow,
            }}
          >
            {/* Tilt-Reactive Holographic Foil Sheen on Back */}
            <div
              className="memoji-foil-layer"
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
              className="memoji-rim-layer"
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
              className="memoji-topbar"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="memoji-dots-group" aria-hidden="true">
                <span className="memoji-dot-red" />
                <span className="memoji-dot-amber" />
                <span className="memoji-dot-green" />
                <span className="memoji-window-label">ishaan.personal_site</span>
              </div>

              {/* Flip back button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(false);
                }}
                className="memoji-flip-pill"
                aria-label="Flip back to front"
              >
                <RotateCcw className="icon-xs-accent" aria-hidden="true" />
                <span>Flip front</span>
              </button>
            </div>

            {/* Center Area: Spacious Speech Bubble */}
            <div
              className="memoji-back-center"
              style={{ transform: 'translateZ(45px)' }}
            >
              <div className="memoji-speech-card">
                <div className="memoji-speech-pointer" aria-hidden="true" />

                <p className="memoji-speech-copy">
                  Looking for my full personal hub, writings, and interactive projects?
                </p>

                {/* Direct Link */}
                <a
                  href="https://ishaankoradia.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="memoji-site-cta"
                >
                  <Globe className="icon-sm" aria-hidden="true" />
                  <span>ishaankoradia.com</span>
                  <ExternalLink className="icon-xs" aria-hidden="true" />
                </a>
              </div>

              {/* Avatar Mini Indicator */}
              <div className="memoji-mini-avatar-wrap">
                <div className="memoji-mini-avatar-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/personal-picture.avif"
                    alt="Ishaan Koradia"
                    className="memoji-portrait-img"
                  />
                </div>
                <span
                  className="memoji-online-badge"
                  title="Online"
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Bottom Status Row on Back */}
            <div
              className="memoji-bottombar"
              style={{ transform: 'translateZ(20px)' }}
            >
              <span className="memoji-status-badge">
                <Globe className="icon-xs-accent" aria-hidden="true" />
                <span>ishaankoradia.com</span>
              </span>

              <span className="memoji-location-label">
                Click to flip
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
