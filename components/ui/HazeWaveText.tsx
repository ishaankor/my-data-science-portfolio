'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HazeWaveTextProps {
  text?: string;
  className?: string;
}

const HAZE_COLORS = [
  '#38bdf8', // Cyan
  '#60a5fa', // Blue
  '#818cf8', // Indigo
  '#a855f7', // Violet
  '#c084fc', // Purple
  '#e879f9', // Pink
  '#38bdf8', // Cyan dot
  '#818cf8', // Indigo
  '#a855f7', // Violet
  '#c084fc', // Purple
  '#38bdf8', // Cyan
  '#818cf8', // Indigo
  '#a855f7', // Violet
  '#c084fc', // Purple
];

export default function HazeWaveText({
  text = 'ishaan.koradia',
  className = '',
}: HazeWaveTextProps) {
  const letters = text.split('');

  return (
    <motion.span
      className={`inline-flex items-center font-mono tracking-tight cursor-pointer group select-none ${className}`}
      whileHover="hover"
      initial="initial"
    >
      {letters.map((char, index) => {
        const isDot = char === '.';
        const color = HAZE_COLORS[index % HAZE_COLORS.length];

        return (
          <motion.span
            key={index}
            className={`inline-block transition-all duration-300 ${
              isDot ? 'font-extrabold text-ember px-[1px]' : ''
            }`}
            style={{
              color: isDot ? '#f97316' : color,
              textShadow: `0 0 12px ${color}40`,
            }}
            animate={{
              x: [0, 4, 0, -4, 0],
            }}
            variants={{
              hover: {
                x: [0, 6, 0, -6, 0],
                scale: isDot ? 1.4 : 1.15,
                color: isDot ? '#f97316' : color,
                textShadow: `0 0 18px ${color}90`,
                transition: {
                  x: {
                    repeat: Infinity,
                    duration: 0.9,
                    ease: 'easeInOut',
                    delay: index * 0.05,
                  },
                  scale: { duration: 0.2 },
                },
              },
            }}
            transition={{
              x: {
                repeat: Infinity,
                duration: 2.2,
                ease: 'easeInOut',
                delay: index * 0.12,
              },
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </motion.span>
  );
}
