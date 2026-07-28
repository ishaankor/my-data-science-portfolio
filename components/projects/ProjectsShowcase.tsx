'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import { ArrowUpRight, Calendar, Github, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ProjectsShowcase({ limit }: { limit?: number }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Machine Learning', 'Automation', 'Data Visualization'];

  const filteredProjects = portfolioData.projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  const displayedProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  return (
    <section className="border-t border-line/60 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
                <span className="h-px w-7 bg-line" aria-hidden="true" />
                selected work
              </span>
              <h2 className="font-display text-[2rem] sm:text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.02em] text-bone mt-4">
                Things people actually use.
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 font-mono">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs transition-all ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-ember to-amber-500 text-ink font-bold shadow-md'
                      : 'bg-surface/60 border border-line text-muted hover:text-bone hover:border-line/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Project Grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProjects.map((project, idx) => (
            <ScrollReveal key={project.id} direction="up" delay={0.15 + idx * 0.1}>
              <div className="group block">
                <div className="relative">
                  {/* Browser Window Mockup Container */}
                  <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-float transition-colors duration-300 group-hover:border-ember/60">
                    
                    {/* Browser Header Bar */}
                    <div className="flex items-center gap-1.5 border-b border-line bg-ink/70 px-3.5 py-2.5">
                      <span aria-hidden="true" className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                      </span>
                      <span className="ml-3 truncate font-mono text-[0.68rem] text-muted">
                        {project.id}.app
                      </span>
                    </div>

                    {/* Card Content & Thumbnail area */}
                    <div className="relative p-5 aspect-[16/10] bg-gradient-to-br from-surface via-surface to-ink flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded bg-ink/90 border border-line/80 font-mono text-[0.65rem] text-bone-dim"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-bone-dim line-clamp-3 leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Impact / Metric badge */}
                      {project.metrics && (
                        <div className="mt-3 font-mono text-[0.68rem] text-cyan-400 flex items-center gap-1.5 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          <span>{project.metrics}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Title & Year Below Card */}
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-xl font-semibold text-bone transition-colors group-hover:text-ember flex items-center gap-2">
                    <span>{project.title}</span>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted hover:text-ember transition-colors"
                        aria-label="GitHub Repo"
                      >
                        <Github className="w-4 h-4 inline" />
                      </a>
                    )}
                  </h3>
                  <span className="font-mono text-xs text-muted">{project.year}</span>
                </div>

                {/* Active Pulse Badge */}
                <div className="mt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    Actively maintained
                  </span>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-ember hover:underline inline-flex items-center gap-1"
                    >
                      <span>Live</span>
                      <ExternalLink className="w-3 h-3 text-ember" />
                    </a>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* See all projects link */}
        {limit && (
          <ScrollReveal direction="up" delay={0.4}>
            <div className="mt-12 text-center">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-ember"
              >
                <span>See all projects</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </ScrollReveal>
        )}

      </div>
    </section>
  );
}
