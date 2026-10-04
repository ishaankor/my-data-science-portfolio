'use client';

import React from 'react';

interface HazeWaveTextProps {
  text?: string;
  className?: string;
}

export default function HazeWaveText({
  text = 'ishaan.koradia',
  className = '',
}: HazeWaveTextProps) {
  const parts = text.split('.');
  const first = parts[0] || 'ishaan';
  const rest = parts.length > 1 ? parts.slice(1).join('.') : '';

  return (
    <span
      className={`inline-flex items-center font-mono font-bold tracking-tight text-bone hover:text-white transition-colors cursor-pointer select-none ${className}`}
    >
      <span>{first}</span>
      {parts.length > 1 && (
        <>
          <span className="text-sky-400 mx-[1px]">.</span>
          <span className="text-bone-dim hover:text-bone">{rest}</span>
        </>
      )}
    </span>
  );
}


