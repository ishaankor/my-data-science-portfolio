'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function MidnightHazeCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Core coordinates (instant)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth fluid spring physics for outer haze aura ring
  const springConfig = { damping: 26, stiffness: 280, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable custom cursor on mobile/touchscreen devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Detect hovering over clickable or interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive =
        target.closest('a') ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.closest('[role="button"]') ||
        target.closest('[data-cursor="hover"]');

      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { capture: true });
    window.addEventListener('pointermove', handleMouseMove as EventListener, { capture: true });
    document.body.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown, { capture: true });
    window.addEventListener('pointerdown', handleMouseDown as EventListener, { capture: true });
    window.addEventListener('mouseup', handleMouseUp, { capture: true });
    window.addEventListener('pointerup', handleMouseUp as EventListener, { capture: true });
    window.addEventListener('mouseover', handleMouseOver, { capture: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove, { capture: true });
      window.removeEventListener('pointermove', handleMouseMove as EventListener, { capture: true });
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown, { capture: true });
      window.removeEventListener('pointerdown', handleMouseDown as EventListener, { capture: true });
      window.removeEventListener('mouseup', handleMouseUp, { capture: true });
      window.removeEventListener('pointerup', handleMouseUp as EventListener, { capture: true });
      window.removeEventListener('mouseover', handleMouseOver, { capture: true });
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* 1. Outer Fluid Midnight Haze Aura Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-haze-indigo/40 bg-haze-indigo/5 backdrop-blur-[2px] shadow-[0_0_20px_rgba(129,140,248,0.25)]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 52 : isClicked ? 28 : 34,
          height: isHovered ? 52 : isClicked ? 28 : 34,
          borderColor: isHovered
            ? 'rgba(168, 85, 247, 0.75)'
            : 'rgba(129, 140, 248, 0.45)',
          backgroundColor: isHovered
            ? 'rgba(168, 85, 247, 0.12)'
            : 'rgba(56, 189, 248, 0.04)',
          boxShadow: isHovered
            ? '0 0 35px 5px rgba(168, 85, 247, 0.35), inset 0 0 15px rgba(56, 189, 248, 0.2)'
            : '0 0 20px 2px rgba(129, 140, 248, 0.2)',
          scale: isClicked ? 0.85 : 1,
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      />

      {/* 2. Inner Glowing Core Pinpoint Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-haze-cyan via-haze-indigo to-haze-purple shadow-[0_0_10px_#38bdf8]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isHovered ? 0.6 : isClicked ? 1.4 : 1,
          opacity: isHovered ? 0.9 : 1,
        }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
    </div>
  );
}
