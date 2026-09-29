'use client';

import React from 'react';
import { ExternalLink, Github, BarChart3, Award, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface AnalysisStudy {
  id: string;
  title: string;
  year: string;
  category: string;
  statTag: string;
  statColor: 'cyan' | 'purple';
  summary: string;
  highlight: string;
  tags: string[];
  image: string;
  imageAlt: string;
  githubUrl: string;
  extraUrl?: { label: string; url: string };
}

const edaStudies: AnalysisStudy[] = [
  {
    id: 'surgery-icu-statistics',
    title: 'A Dive into Surgery Statistics: Predicting ICU Stay Length',
    year: '2025',
    category: 'Clinical Health Analytics & D3.js',
    statTag: 'N = 1,000+ Records',
    statColor: 'cyan',
    summary:
      'Statistical investigation evaluating whether preoperative biomarkers and physical attributes accurately predict post-operative ICU recovery duration.',
    highlight:
      'Preoperative blood chemistry (Albumin, AST, aPTT, Sodium) out-predicted physical traits (BMI, age), modeled via interactive D3.js prediction gauges.',
    tags: ['D3.js v7', 'JavaScript', 'Clinical Analytics', 'Linear Regression', 'Correlation Matrices'],
    image: '/images/dataviz-photo.png',
    imageAlt: 'Surgery Department Mortality and ICU stay correlation analysis chart',
    githubUrl: 'https://github.com/ishaankor/A-Dive-Into-Surgery-Statistics',
    extraUrl: {
      label: 'Demo Video',
      url: 'https://youtu.be/4KRh9fUPLIQ'
    }
  },
  {
    id: 'childhood-obesity-analysis',
    title: 'Childhood Obesity: BMI Dynamics & Socioeconomic Factors',
    year: '2025',
    category: 'Public Health Hypothesis Testing',
    statTag: 'N = 66,634 Records',
    statColor: 'purple',
    summary:
      'Longitudinal hypothesis testing analyzing adolescent BMI percentiles across a 5-year nationwide cohort against poverty ratios and household food security.',
    highlight:
      'Uncovered a pronounced 2021 COVID-19 pandemic peak in adolescent BMI while isolating pubertal progression (r = 0.23) through multivariate controls.',
    tags: ['Python', 'Pandas', 'Seaborn', 'Hypothesis Testing', 'NSCH Cohort'],
    image: '/images/childhood-obesity-analysis.png',
    imageAlt: 'Correlation heatmap of adolescent BMI, poverty ratio, food situation, and physical activity',
    githubUrl: 'https://github.com/ishaankor/Childhood-Obesity-Analysis'
  }
];

export default function ExploratoryDataAnalysisShowcase() {
  return (
    <section className="space-y-10 pt-4">
      {/* Section Header */}
      <ScrollReveal direction="up" delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-line/60">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-muted">
              <span className="text-bone">RESEARCH &amp; STATISTICAL MODELING</span>
              <span className="text-line">/</span>
              <span className="text-cyan-400">EXPLORATORY DATA ANALYSIS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-bone tracking-tight">
              Exploratory Data Analysis
            </h2>
          </div>
          <p className="font-sans text-xs text-bone-dim max-w-md sm:text-right">
            Multivariate hypothesis testing and interactive clinical visualizations investigating real-world datasets.
          </p>
        </div>
      </ScrollReveal>

      {/* 2-Column Compact Study Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {edaStudies.map((study, idx) => (
          <ScrollReveal key={study.id} direction="up" delay={0.08 + idx * 0.06}>
            <div className="h-full rounded-2xl border border-line/80 bg-surface/40 hover:bg-surface/80 hover:border-cyan-500/40 p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between group shadow-sm">
              <div className="space-y-4">
                {/* Header: Eyebrow + Metric Badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className="font-mono text-xs text-muted flex items-center gap-2">
                    <span className="font-bold text-bone">STUDY 0{idx + 1}</span>
                    <span className="text-muted/60">—</span>
                    <span>{study.year}</span>
                  </div>

                  <div
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                      study.statColor === 'cyan'
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25'
                        : 'bg-purple-500/10 text-purple-300 border-purple-500/25'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                        study.statColor === 'cyan' ? 'bg-cyan-400' : 'bg-purple-400'
                      }`}
                    />
                    <span>{study.statTag}</span>
                  </div>
                </div>

                {/* Visual Chart Frame */}
                <a
                  href={study.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-line/70 bg-ink/90 overflow-hidden group/frame hover:border-cyan-500/50 transition-all shadow-inner"
                >
                  <div className="flex items-center justify-between px-3 py-2 bg-[#0c1017] border-b border-line/50">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                      <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                      <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="font-mono text-[10px] text-muted group-hover/frame:text-cyan-400 transition-colors flex items-center gap-1">
                      <BarChart3 className="w-3 h-3 text-cyan-400 inline" />
                      <span>{study.id}</span>
                      <ExternalLink className="w-2 h-2 inline" />
                    </span>
                    <div className="w-4" />
                  </div>

                  <div className="relative overflow-hidden aspect-[16/9] bg-[#080c14] flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={study.image}
                      alt={study.imageAlt}
                      className="w-full h-full object-contain rounded-md transform group-hover/frame:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                </a>

                {/* Study Title */}
                <div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-bone tracking-tight leading-snug group-hover:text-cyan-300 transition-colors">
                    {study.title}
                  </h3>
                  <p className="font-mono text-[11px] text-muted mt-0.5">{study.category}</p>
                </div>

                {/* Core Takeaway Callout */}
                <div className="p-3 rounded-xl bg-ink/60 border border-line/60">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="font-sans text-xs text-bone-dim leading-relaxed">
                      {study.highlight}
                    </p>
                  </div>
                </div>

                {/* Tech Chips */}
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-surface border border-line text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-4 pt-4 mt-4 border-t border-line/50 font-mono text-xs">
                <a
                  href={study.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline font-semibold inline-flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Source &amp; Notebook</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {study.extraUrl && (
                  <a
                    href={study.extraUrl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-bone transition-colors inline-flex items-center gap-1"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{study.extraUrl.label}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
