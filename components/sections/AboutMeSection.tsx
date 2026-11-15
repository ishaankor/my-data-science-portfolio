'use client';

import React from 'react';
import { ArrowUpRight, Code2, Briefcase } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function AboutMeSection() {
  const whatIDoItems = [
    {
      number: '01',
      title: 'Product & AI engineering',
      description:
        'Real-time, type-safe web apps people use every day, taken from first pixel to production with agentic workflows.',
    },
    {
      number: '02',
      title: 'Systems & infrastructure',
      description:
        'Model Context Protocol (MCP) integrations, high-throughput FastAPI backends, and parallelized ETL pipelines kept reliable at scale.',
    },
    {
      number: '03',
      title: 'Cloud & delivery',
      description:
        'Docker, automated CI/CD workflows, and serverless architectures that move work from my machine to production safely and repeatably.',
    },
  ];

  return (
    <section aria-labelledby="heading-about" className="about-section">
      <div className="about-container">
        
        {/* 1. WHAT I DO Section */}
        <ScrollReveal direction="up" delay={0.1}>
          <div>
            {/* Section Eyebrow & Proper H2 Landmark */}
            <header className="toolkit-header">
              <span className="section-eyebrow">
                <Code2 className="eyebrow-icon" aria-hidden="true" />
                <span>WHAT I DO</span>
              </span>
              <h2 id="heading-about" className="section-headline">
                Engineering Philosophy &amp; Core Disciplines
              </h2>
            </header>

            {/* Numbered Row List */}
            <dl className="discipline-ledger">
              {whatIDoItems.map((item) => (
                <div
                  key={item.number}
                  className="discipline-row"
                >
                  {/* Left Column: Number & Title */}
                  <dt className="discipline-title-col">
                    <span className="discipline-index">
                      {item.number}
                    </span>
                    <h3 className="discipline-name">
                      {item.title}
                    </h3>
                  </dt>

                  {/* Right Column: Description */}
                  <dd className="discipline-desc-col">
                    {item.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </ScrollReveal>

        {/* 2. CURRENTLY Section */}
        <ScrollReveal direction="up" delay={0.2}>
          <aside aria-label="Current Role" className="currently-callout">
            {/* Section Eyebrow */}
            <div className="section-eyebrow">
              <Briefcase className="eyebrow-icon" aria-hidden="true" />
              <span>CURRENTLY</span>
            </div>

            {/* Headline & Link Row */}
            <div className="currently-content-row">
              <div>
                <h3 className="currently-headline">
                  AI Engineer at Handshake AI.
                </h3>
                <p className="currently-description">
                  Frontier LLM evaluation, golden benchmark datasets, and instruction-tuning on NVIDIA Nemotron-12B.
                </p>
              </div>

              <Link
                href="/work"
                className="editorial-arrow-link"
              >
                <span>See the full path</span>
                <ArrowUpRight className="eyebrow-icon" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </ScrollReveal>

      </div>
    </section>
  );
}
