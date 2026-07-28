'use client';

import React from 'react';

export default function WhatIDo() {
  const capabilities = [
    {
      num: '01',
      title: 'Data Engineering & Scraping',
      description: 'Web automation, API pipelines, and relational database systems built to collect, clean, and process thousands of records reliably.',
    },
    {
      num: '02',
      title: 'Machine Learning & AI Pipelines',
      description: 'Predictive modeling with Scikit-Learn and XGBoost, computer vision filtering with OpenCV, and automated bot integrations for Discord and Twitter/X.',
    },
    {
      num: '03',
      title: 'Full-Stack Web & Visual Analytics',
      description: 'Real-time, type-safe Next.js applications featuring interactive WebGL 3D scenes, live API summary graphics, and search recommender engines.',
    },
  ];

  return (
    <section className="border-t border-line/60 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        
        {/* Section label */}
        <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
          <span className="h-px w-7 bg-line" aria-hidden="true" />
          what I do
        </span>

        {/* List Grid matching sunnypatel.net */}
        <div className="mt-10 border-t border-line">
          {capabilities.map((item) => (
            <div
              key={item.num}
              className="grid gap-3 border-b border-line py-7 md:grid-cols-[1fr_1.8fr] md:gap-10 items-start"
            >
              <h2 className="flex items-baseline gap-3 font-display text-lg font-semibold text-bone">
                <span className="font-mono text-xs text-ember tabular-nums">
                  {item.num}
                </span>
                {item.title}
              </h2>
              <p className="text-[0.97rem] leading-relaxed text-bone-dim">
                {item.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
