'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProjectsHeroHUD from './ProjectsHeroHUD';
import ProjectsDeepDiveShowcase from './ProjectsDeepDiveShowcase';
import ExploratoryDataAnalysisShowcase from './ExploratoryDataAnalysisShowcase';

export default function RepositoryMatrix() {
  return (
    <div className="min-h-screen space-y-4">
      {/* Flagship Projects Hero matching WorkHeroHUD */}
      <ProjectsHeroHUD />

      <section className="py-16 sm:py-24 relative">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-16">
          {/* Flagship Showcase: Things I've Built, End to End */}
          <ProjectsDeepDiveShowcase />

        {/* Subtle Line Break between Flagship Builds and EDA Research */}
        <div className="relative py-2 sm:py-4" aria-hidden="true">
          <div className="h-px bg-gradient-to-r from-transparent via-line/80 to-transparent w-full" />
        </div>

        {/* Exploratory Data Analysis Subsection (Shortened & Reduced) */}
        <ExploratoryDataAnalysisShowcase />

        {/* Discreet Inception Timeline & GitHub Link */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="pt-8 pb-4 text-center border-t border-line/50">
            <p className="font-mono text-xs text-muted flex flex-wrap items-center justify-center gap-2">
              <span>Looking for earlier scripts, utilities, and experimental work?</span>
              <Link
                href="/meta"
                className="text-ember hover:underline inline-flex items-center gap-1 font-semibold transition-colors"
              >
                <span>Explore the Repository Timeline in /meta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <span className="text-muted/40 hidden sm:inline">•</span>
              <a
                href="https://github.com/ishaankor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-bone hover:underline inline-flex items-center gap-1 transition-colors text-[0.7rem]"
              >
                <span>GitHub Archive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
    </div>
  );
}
