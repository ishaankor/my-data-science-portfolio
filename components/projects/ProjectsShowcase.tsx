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

  return (
    <section aria-labelledby="heading-projects" className="section-boundary">
      <div className="section-container">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
            <div>
              <span className="section-eyebrow">
                <Sparkles className="w-3.5 h-3.5 text-ember" aria-hidden="true" />
                <span>selected work</span>
              </span>
              <h2 id="heading-projects" className="section-headline mt-2 sm:whitespace-nowrap">
                Built for real-world impact.
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 font-mono shrink-0" role="toolbar" aria-label="Project category filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                    selectedCategory === cat
                      ? 'bg-ember text-ink font-semibold shadow-xs'
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
        <div className="grid gap-6 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProjects.map((project, idx) => (
            <ScrollReveal key={project.id} direction="up" delay={0.15 + idx * 0.1}>
              <article aria-label={project.title} className="group block">
                  {/* Clean Editorial Card Container */}
                  <a
                    href={project.liveUrl || project.githubUrl || '#'}
                    target={project.liveUrl || project.githubUrl ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-xl border border-line bg-surface shadow-panel transition-all duration-300 group-hover:border-ember/60 group-hover:shadow-float"
                  >
                    {/* Header Bar */}
                    <div className="window-chrome">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-ember/60 group-hover:bg-ember transition-colors" aria-hidden="true" />
                        <span className="truncate font-mono text-[0.68rem] text-muted group-hover:text-bone transition-colors">
                          projects/{project.id}
                        </span>
                      </div>
                      {(project.liveUrl || project.githubUrl) && (
                        <ExternalLink className="w-3 h-3 text-muted/60 group-hover:text-ember transition-colors" aria-hidden="true" />
                      )}
                    </div>

                    {/* Card Content & Thumbnail area - Expanded Favicon Cover */}
                    <figure className="relative aspect-[16/10] overflow-hidden bg-ink/90 flex items-center justify-center m-0">
                      {project.id === 'ishaanbot' ? (
                        <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-[#080c16]">
                          {/* Ambient radial glow */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.14)_0%,transparent_70%)] pointer-events-none" />
                          
                          {/* Centered Avatar with MCP badge on top right */}
                          <div className="relative w-28 h-28 sm:w-32 sm:h-32 transform group-hover:scale-105 transition-transform duration-500">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="https://github.com/ishaankor.png"
                              alt="Ishaan Koradia"
                              className="w-full h-full rounded-full object-cover border-2 border-line/90 p-1 bg-surface shadow-2xl"
                            />
                            <div className="absolute -top-1.5 -right-1.5 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0a0e18] border-2 border-line/90 flex items-center justify-center p-1.5 shadow-lg">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="/favicons/mcp-favicon.svg"
                                alt="Model Context Protocol"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>
                      ) : (project.image || project.favicon) ? (
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
                      <figcaption className="sr-only">{project.title}</figcaption>
                    </figure>

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
                        aria-label={`${project.title} GitHub repository`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-4 h-4 inline" aria-hidden="true" />
                      </a>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                    <time dateTime={project.year} className="text-muted">{project.year}</time>
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
                          <ExternalLink className="w-3 h-3 text-ember" aria-hidden="true" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Full Description */}
                <p className="mt-2 text-xs text-bone-dim leading-relaxed">
                  {project.description}
                </p>
              </article>
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
