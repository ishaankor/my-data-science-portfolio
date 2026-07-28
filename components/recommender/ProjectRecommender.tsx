'use client';

import React, { useState, useMemo } from 'react';
import { portfolioData } from '@/data/portfolio';
import { Search, Sparkles, Calendar, ArrowUpRight } from 'lucide-react';

export default function ProjectRecommender() {
  const [query, setQuery] = useState('');

  const normalizeText = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const sampleKeywords = ['Machine Learning', 'Python', 'Bot', 'Web Scraping', 'Linear Regression', 'PostgreSQL'];

  const matchedProjects = useMemo(() => {
    const rawQuery = normalizeText(query);
    if (!rawQuery) {
      return portfolioData.projects.slice(0, 3);
    }

    const queryTokens = rawQuery.split(' ').filter(Boolean);

    const scored = portfolioData.projects.map((project) => {
      const content = normalizeText(
        `${project.title} ${project.description} ${project.detailedDescription || ''} ${project.tags.join(' ')} ${project.category}`
      );
      const contentTokens = new Set(content.split(' '));

      let score = 0;
      queryTokens.forEach((token) => {
        if (contentTokens.has(token)) {
          score += 3;
        } else if ([...contentTokens].some((word) => word.startsWith(token))) {
          score += 1.5;
        }
      });

      if (parseInt(project.year) >= 2023) {
        score += 0.5;
      }

      return { project, score };
    });

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.project);
  }, [query]);

  return (
    <section className="py-20 relative border-t border-haze-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-haze-card p-8 sm:p-12 rounded-3xl relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-haze-purple/10 border border-haze-border text-haze-purple text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Recommender Demo</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
              Smart AI Project Matcher
            </h2>
            <p className="text-haze-dim text-base sm:text-lg">
              Type a topic, skill, or tool below to get instant matching projects from this portfolio.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-haze-muted">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 'machine learning', 'python bot', 'scraping', 'regression'..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-midnight/90 border border-haze-border text-white placeholder-haze-muted focus:outline-none focus:ring-2 focus:ring-haze-indigo text-base sm:text-lg transition-all font-sans"
              aria-label="Search portfolio projects"
            />
          </div>

          {/* Quick Filter Tag Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-8 font-mono text-xs">
            <span className="text-haze-muted mr-1">Quick suggestions:</span>
            {sampleKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => setQuery(kw)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  query.toLowerCase() === kw.toLowerCase()
                    ? 'bg-haze-indigo text-black font-bold'
                    : 'bg-midnight border border-haze-border text-haze-dim hover:border-haze-indigo hover:text-white'
                }`}
              >
                {kw}
              </button>
            ))}
            {query && (
              <button
                onClick={() => setQuery('')}
                className="px-3 py-1.5 rounded-lg text-haze-muted hover:text-white underline"
              >
                Reset query
              </button>
            )}
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-xs font-mono text-haze-cyan uppercase tracking-wider">
              {query
                ? `Matches for "${query}" (${matchedProjects.length})`
                : `Featured Recommendations (${matchedProjects.length})`}
            </p>
          </div>

          {/* Results Cards Grid */}
          {matchedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchedProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-6 rounded-2xl bg-midnight/80 border border-haze-border hover:border-haze-indigo/50 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 font-mono text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-haze-indigo/10 border border-haze-border text-haze-indigo">
                        {project.category}
                      </span>
                      <span className="text-haze-muted flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {project.year}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-haze-indigo transition-colors mb-2">
                      {project.title}
                    </h3>
                    <p className="text-haze-dim text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-4 font-mono text-[10px]">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-haze-dark border border-haze-border text-haze-dim"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-haze-cyan font-mono font-semibold hover:underline"
                      >
                        <span>View Source</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-midnight/60 border border-haze-border">
              <p className="text-haze-dim text-base">
                No matching projects found for &quot;{query}&quot;. Try keywords like &apos;Python&apos;, &apos;Bot&apos;, or &apos;ML&apos;.
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
