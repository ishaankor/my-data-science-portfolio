'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import {
  ArrowUpRight,
  Github,
  ExternalLink,
  Sparkles,
  Code2,
  FileText,
  Headphones,
  Gamepad2,
  Server,
} from 'lucide-react';
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

  const getProjectFallbackIcon = (id: string) => {
    if (id === 'canvas-files-merger')
      return <FileText className="w-10 h-10 text-bone-dim group-hover:text-ember transition-colors" />;
    if (id === 'notes-taker')
      return <Headphones className="w-10 h-10 text-bone-dim group-hover:text-ember transition-colors" />;
    if (id === 'mobile-game-automations')
      return <Gamepad2 className="w-10 h-10 text-bone-dim group-hover:text-ember transition-colors" />;
    if (id === 'minecraft-server-upkeeper')
      return <Server className="w-10 h-10 text-bone-dim group-hover:text-ember transition-colors" />;
    return <Code2 className="w-10 h-10 text-bone-dim group-hover:text-ember transition-colors" />;
  };

  const getProjectGlowColor = (id: string) => {
    if (id === 'datafy') return 'bg-amber-500/15 group-hover:bg-amber-500/30';
    if (id === 'rigscouter') return 'bg-blue-500/15 group-hover:bg-blue-500/30';
    if (id === 'ishaanbot') return 'bg-emerald-500/15 group-hover:bg-emerald-500/30';
    if (id === 'transformi') return 'bg-indigo-500/15 group-hover:bg-indigo-500/30';
    if (id === 'daily-motivation') return 'bg-amber-500/15 group-hover:bg-amber-500/30';
    if (id === 'data-science-portfolio') return 'bg-cyan-500/15 group-hover:bg-cyan-500/30';
    if (id === 'claimr') return 'bg-violet-500/15 group-hover:bg-violet-500/30';
    return 'bg-ember/15 group-hover:bg-ember/30';
  };

  return (
    <section className="border-t border-line/60 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
                <Sparkles className="w-3.5 h-3.5 text-ember" />
                selected work
              </span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-[2.15rem] font-semibold leading-tight tracking-[-0.02em] text-bone mt-3 sm:whitespace-nowrap">
                Built for real-world impact.
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 font-mono shrink-0">
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
                  {/* Browser Window Mockup Container */}
                  <a
                    href={project.liveUrl || project.githubUrl || '#'}
                    target={project.liveUrl || project.githubUrl ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-xl border border-line bg-surface shadow-float transition-all duration-300 group-hover:border-ember/60"
                  >
                    {/* Browser Header Bar */}
                    <div className="flex items-center justify-between border-b border-line bg-ink/70 px-3.5 py-2.5">
                      <div className="flex items-center gap-2">
                        <span aria-hidden="true" className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                        </span>
                        <span className="truncate font-mono text-[0.68rem] text-muted group-hover:text-bone transition-colors ml-1">
                          {project.id}.app
                        </span>
                      </div>
                      {(project.liveUrl || project.githubUrl) && (
                        <ExternalLink className="w-3 h-3 text-muted/60 group-hover:text-ember transition-colors" />
                      )}
                    </div>

                    {/* Card Content & Thumbnail area - Expanded Favicon Cover */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-ink/90 flex items-center justify-center">
                      {(project.image || project.favicon) ? (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.image || project.favicon}
                            alt={project.title}
                            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </>
                      ) : (
                        <div className="p-6 h-full w-full bg-gradient-to-br from-surface via-surface to-ink flex items-center justify-center">
                          {getProjectFallbackIcon(project.id)}
                        </div>
                      )}
                    </div>

                  </a>

                {/* Title & Year Below Card */}
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-bone transition-colors group-hover:text-ember flex items-center gap-2 flex-wrap">
                    <span>{project.title}</span>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted hover:text-ember transition-colors"
                        aria-label="GitHub Repo"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-4 h-4 inline" />
                      </a>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                    <span className="text-muted">{project.year}</span>
                    {project.liveUrl && (
                      <>
                        <span className="text-muted/40">•</span>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ember hover:underline inline-flex items-center gap-1 font-semibold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Live</span>
                          <ExternalLink className="w-3 h-3 text-ember" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Full Description */}
                <p className="mt-2 text-xs text-bone-dim leading-relaxed">
                  {project.description}
                </p>
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
