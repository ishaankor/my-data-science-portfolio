'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import { Github, ExternalLink, Calendar, Layers, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsShowcase({ limit }: { limit?: number }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Machine Learning', 'Automation', 'AI & Web', 'Data Visualization'];

  const filteredProjects = portfolioData.projects.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

  const displayedProjects = limit ? filteredProjects.slice(0, limit) : filteredProjects;

  return (
    <section className="py-20 relative border-t border-haze-border" id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-haze-indigo/10 border border-haze-border text-haze-indigo text-xs font-mono mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Projects Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Featured Work & AI Builds
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-haze-glow'
                    : 'glass-haze text-haze-muted hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project) => (
            <article
              key={project.id}
              className="glass-haze-card p-6 rounded-3xl flex flex-col justify-between group transform hover:-translate-y-1 duration-300"
            >
              <div>
                {/* Category & Year */}
                <div className="flex items-center justify-between mb-4 font-mono text-xs">
                  <span className="px-3 py-1 rounded-full bg-haze-indigo/10 border border-haze-border text-haze-indigo">
                    {project.category}
                  </span>
                  <span className="text-haze-muted flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {project.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-haze-indigo transition-colors mb-3">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-haze-dim text-xs sm:text-sm leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Metric Highlight */}
                {project.metrics && (
                  <div className="mb-6 p-3 rounded-xl bg-midnight/90 border border-haze-border text-xs font-mono text-haze-cyan">
                    ⚡ <span className="font-semibold text-white">Highlight:</span> {project.metrics}
                  </div>
                )}
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6 font-mono text-[11px]">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-midnight border border-haze-border text-haze-dim"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-haze-border font-mono text-xs">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-haze-dim hover:text-white transition-colors"
                    >
                      <Github className="w-4 h-4 text-haze-indigo" />
                      <span>Source Code</span>
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-haze-cyan hover:underline font-semibold ml-auto"
                    >
                      <span>Live App</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button if limited */}
        {limit && portfolioData.projects.length > limit && (
          <div className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl glass-haze text-haze-indigo hover:text-white font-semibold font-mono text-sm transition-all"
            >
              <span>See All Projects ({portfolioData.projects.length})</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}

      </div>
    </section>
  );
}
