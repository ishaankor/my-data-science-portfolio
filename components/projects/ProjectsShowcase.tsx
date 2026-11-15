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
      return <FileText className="icon-lg" />;
    if (id === 'notes-taker')
      return <Headphones className="icon-lg" />;
    if (id === 'mobile-game-automations')
      return <Gamepad2 className="icon-lg" />;
    if (id === 'minecraft-server-upkeeper')
      return <Server className="icon-lg" />;
    return <Code2 className="icon-lg" />;
  };

  return (
    <section aria-labelledby="heading-projects" className="projects-section">
      <div className="projects-container">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <header className="projects-header-row">
            <div>
              <span className="section-eyebrow">
                <Sparkles className="eyebrow-icon" aria-hidden="true" />
                <span>selected work</span>
              </span>
              <h2 id="heading-projects" className="section-headline">
                Built for real-world impact.
              </h2>
            </div>

            <div className="projects-filter-bar" role="toolbar" aria-label="Project category filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? 'filter-pill-active' : 'filter-pill'}
                >
                  {cat}
                </button>
              ))}
            </div>
          </header>
        </ScrollReveal>

        {/* Project Grid */}
        <div className="projects-grid">
          {displayedProjects.map((project, idx) => (
            <ScrollReveal key={project.id} direction="up" delay={0.15 + idx * 0.1}>
              <article aria-label={project.title} className="project-card">
                {/* Clean Editorial Card Container */}
                <a
                  href={project.liveUrl || project.githubUrl || '#'}
                  target={project.liveUrl || project.githubUrl ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="project-preview-frame"
                >
                  {/* Header Bar */}
                  <div className="window-chrome">
                    <div className="project-chrome-path">
                      <span className="project-chrome-dot" aria-hidden="true" />
                      <span className="project-chrome-label">
                        projects/{project.id}
                      </span>
                    </div>
                    {(project.liveUrl || project.githubUrl) && (
                      <ExternalLink className="eyebrow-icon" aria-hidden="true" />
                    )}
                  </div>

                  {/* Card Content & Thumbnail area */}
                  <figure className="project-figure">
                    {project.id === 'ishaanbot' ? (
                      <div className="project-ishaanbot-stage">
                        <div className="project-ishaanbot-avatar">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://github.com/ishaankor.png"
                            alt="Ishaan Koradia"
                            className="project-ishaanbot-img"
                          />
                          <div className="project-ishaanbot-badge">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/favicons/mcp-favicon.svg"
                              alt="Model Context Protocol"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (project.image || project.favicon) ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={project.image || project.favicon}
                        alt={project.title}
                        className="project-cover-img"
                      />
                    ) : (
                      <div>
                        {getProjectFallbackIcon(project.id)}
                      </div>
                    )}
                    <figcaption className="sr-only">{project.title}</figcaption>
                  </figure>
                </a>

                {/* Title & Year Below Card */}
                <div className="project-meta-row">
                  <h3 className="project-title-heading">
                    <span>{project.title}</span>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} GitHub repository`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="eyebrow-icon" aria-hidden="true" />
                      </a>
                    )}
                  </h3>
                  <div className="project-year-group">
                    <time dateTime={project.year}>{project.year}</time>
                    {project.liveUrl && (
                      <>
                        <span>•</span>
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-live-link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Live</span>
                          <ExternalLink className="eyebrow-icon" aria-hidden="true" />
                        </a>
                      </>
                    )}
                  </div>
                </div>

                {/* Full Description */}
                <p className="project-summary">
                  {project.description}
                </p>

                {project.tags && project.tags.length > 0 && (
                  <ul className="project-tag-list" aria-label={`${project.title} technologies`}>
                    {project.tags.slice(0, 4).map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* See all projects link */}
        {limit && (
          <ScrollReveal direction="up" delay={0.4}>
            <div className="projects-footer">
              <Link
                href="/projects"
                className="editorial-arrow-link"
              >
                <span>See all projects</span>
                <ArrowUpRight className="eyebrow-icon" aria-hidden="true" />
              </Link>
            </div>
          </ScrollReveal>
        )}

      </div>
    </section>
  );
}
