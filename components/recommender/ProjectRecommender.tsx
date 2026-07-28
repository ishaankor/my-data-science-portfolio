'use client';

import React, { useState, useMemo } from 'react';
import { portfolioData } from '@/data/portfolio';
import { Search, Sparkles, Calendar, ArrowUpRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

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
    <section className="border-t border-line/60 py-20 sm:py-28 relative">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="rounded-xl border border-line bg-surface p-8 sm:p-12 shadow-float relative overflow-hidden">
            
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-ember/10 blur-[100px] pointer-events-none rounded-full" />

            <div className="max-w-3xl mb-8">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ember/10 border border-ember/40 text-ember text-xs font-mono mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Recommender</span>
              </span>
              <h2 className="font-display text-[2rem] sm:text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.02em] text-bone mb-3">
                Smart AI Project Matcher
              </h2>
              <p className="text-bone-dim text-sm sm:text-base">
                Type a topic, skill, or tool below to get instant matching projects from this portfolio.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try 'machine learning', 'python bot', 'scraping', 'regression'..."
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-ink border border-line text-bone placeholder-muted focus:border-ember focus:outline-none text-base transition-colors font-sans"
                aria-label="Search portfolio projects"
              />
            </div>

            {/* Quick Filter Tag Chips */}
            <div className="flex flex-wrap items-center gap-2 mb-8 font-mono text-xs">
              <span className="text-muted mr-1">Suggestions:</span>
              {sampleKeywords.map((kw) => (
                <button
                  key={kw}
                  onClick={() => setQuery(kw)}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    query.toLowerCase() === kw.toLowerCase()
                      ? 'bg-ember/20 border border-ember/60 text-bone'
                      : 'bg-ink border border-line text-muted hover:border-ember hover:text-bone'
                  }`}
                >
                  {kw}
                </button>
              ))}
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="px-3 py-1 rounded-md text-muted hover:text-bone underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Results Grid */}
            {matchedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {matchedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-5 rounded-lg bg-ink border border-line hover:border-ember/50 transition-colors flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 font-mono text-xs">
                        <span className="px-2 py-0.5 rounded bg-surface border border-line text-ember">
                          {project.category}
                        </span>
                        <span className="text-muted flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {project.year}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-bold text-bone group-hover:text-ember transition-colors mb-2">
                        {project.title}
                      </h3>
                      <p className="text-bone-dim text-xs line-clamp-3 leading-relaxed mb-4">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-4 font-mono text-[10px]">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-surface border border-line text-muted"
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
                          className="inline-flex items-center gap-1.5 text-xs text-ember font-mono font-semibold hover:underline"
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
              <div className="p-8 text-center rounded-lg bg-ink border border-line">
                <p className="text-muted text-sm font-mono">
                  No matching projects found for &quot;{query}&quot;. Try keywords like &apos;Python&apos;, &apos;Bot&apos;, or &apos;ML&apos;.
                </p>
              </div>
            )}

          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
