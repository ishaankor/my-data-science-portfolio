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
    <span className={`brand-wordmark ${className}`.trim()}>
      <span>{first}</span>
      {parts.length > 1 && (
        <>
          <span className="brand-dot">.</span>
          <span className="brand-suffix">{rest}</span>
        </>
      )}
    </span>
  );
}


