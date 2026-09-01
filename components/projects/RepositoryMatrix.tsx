'use client';

import React, { useState, useMemo, useEffect } from 'react';
import githubCache from '@/data/github-cache.json';
import { portfolioData } from '@/data/portfolio';
import { Search, ExternalLink, Layers, X, GitBranch } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProjectsDeepDiveShowcase from './ProjectsDeepDiveShowcase';

export interface RepositoryItem {
  id: string | number;
  name: string;
  year: string;
  language: string | null;
  html_url: string;
  description: string | null;
  created_at?: string;
  pushed_at?: string;
  tags?: string[];
  metrics?: string;
}

const LANGUAGE_COLORS: Record<string, { hex: string }> = {
  Python: { hex: '#3572A5' },
  TypeScript: { hex: '#3178c6' },
  JavaScript: { hex: '#f1e05a' },
  HTML: { hex: '#e34c26' },
  CSS: { hex: '#563d7c' },
  'C++': { hex: '#f34b7d' },
  Shell: { hex: '#89e051' },
  Jupyter: { hex: '#DA5B0B' },
  'Jupyter Notebook': { hex: '#DA5B0B' },
};

const YEAR_COLORS: Record<string, { fill: string }> = {
  '2027': { fill: '#38bdf8' }, // Sky Blue
  '2026': { fill: '#06b6d4' }, // Cyan
  '2025': { fill: '#818cf8' }, // Indigo
  '2024': { fill: '#f43f5e' }, // Rose/Red
  '2023': { fill: '#f97316' }, // Ember/Orange
  '2022': { fill: '#2dd4bf' }, // Teal
  '2021': { fill: '#a855f7' }, // Purple
  '2020': { fill: '#eab308' }, // Amber
};

const PALETTE = [
  '#06b6d4',
  '#818cf8',
  '#f43f5e',
  '#f97316',
  '#2dd4bf',
  '#a855f7',
  '#38bdf8',
  '#eab308',
  '#ec4899',
  '#10b981',
];

function getYearColor(year: string, index: number) {
  if (YEAR_COLORS[year]) return YEAR_COLORS[year];
  return { fill: PALETTE[index % PALETTE.length] };
}

const EXCLUDED_REPOS = new Set([
  'lab7',
  'lab3',
  'list-examples-grader',
  'githubpractice',
  'cogs108_repo',
  'myfirstpullrequest',
  'it-cert-automation-practice',
]);

const GITHUB_API_ENDPOINT =
  process.env.NEXT_PUBLIC_GITHUB_FETCHER_URL ||
  'https://github-meta-fetcher.vercel.app/api/github';

function buildRepositoryMatrix(rawRepos: any[]): RepositoryItem[] {
  const map = new Map<string, RepositoryItem>();

  const getRepoKey = (url: string, name: string) => {
    const parts = url.replace(/\/+$/, '').split('/');
    const slug = parts.pop() || name;
    return slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  // 1. Ingest GitHub repos (filtering out private repos and course assignment labs)
  (rawRepos || []).forEach((r: any) => {
    if (r.private) return;
    if (!r.html_url || !r.html_url.startsWith('https://github.com/')) return;
    const nameLower = (r.name || '').toLowerCase();
    if (EXCLUDED_REPOS.has(nameLower)) return;
    if (nameLower.startsWith('lab') || nameLower.startsWith('test')) return;

    // Use created_at to accurately represent project inception year
    const creationDate = r.created_at || r.pushed_at;
    const year = creationDate ? new Date(creationDate).getFullYear().toString() : '2024';
    const key = getRepoKey(r.html_url, r.name);

    map.set(key, {
      id: r.id || key,
      name: r.name,
      year,
      language: r.language || 'Code',
      html_url: r.html_url,
      description: r.description,
      created_at: r.created_at || `${year}-01-01T00:00:00Z`,
      pushed_at: r.pushed_at,
    });
  });

  // 2. Merge public portfolio projects, enriching or adding items seamlessly without duplicates
  (portfolioData.projects || []).forEach((p) => {
    if (!p.githubUrl || !p.githubUrl.startsWith('https://github.com/')) {
      const fallbackKey = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!map.has(fallbackKey)) {
        map.set(fallbackKey, {
          id: p.id,
          name: p.title,
          year: p.year || '2024',
          language: p.tags[0] || 'Code',
          html_url: p.liveUrl || '#',
          description: p.description,
          created_at: `${p.year || '2024'}-01-01T00:00:00Z`,
          pushed_at: `${p.year || '2024'}-06-15T12:00:00Z`,
          tags: p.tags,
          metrics: p.metrics,
        });
      }
      return;
    }

    const key = getRepoKey(p.githubUrl, p.title);
    const existing = map.get(key);

    if (existing) {
      existing.name = p.title;
      existing.description = p.description || existing.description;
      existing.tags = p.tags;
      existing.metrics = p.metrics;
      // Curated project creation year takes precedence
      if (p.year) {
        existing.year = p.year;
      }
    } else {
      map.set(key, {
        id: p.id,
        name: p.title,
        year: p.year || '2024',
        language: p.tags[0] || 'Code',
        html_url: p.githubUrl,
        description: p.description,
        created_at: `${p.year || '2024'}-01-01T00:00:00Z`,
        pushed_at: `${p.year || '2024'}-06-15T12:00:00Z`,
        tags: p.tags,
        metrics: p.metrics,
      });
    }
  });

  return Array.from(map.values()).sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });
}

export default function RepositoryMatrix({ limit }: { limit?: number }) {
  const [repos, setRepos] = useState<RepositoryItem[]>(() =>
    buildRepositoryMatrix(githubCache?.repos || [])
  );
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredYear, setHoveredYear] = useState<string | null>(null);

  // Synchronize and fetch live GitHub repos in real-time
  useEffect(() => {
    async function fetchLiveRepositories() {
      try {
        const proxyRes = await fetch(GITHUB_API_ENDPOINT, { cache: 'no-store' });
        if (proxyRes.ok) {
          const payload = await proxyRes.json();
          if (Array.isArray(payload.repos) && payload.repos.length > 0) {
            setRepos(buildRepositoryMatrix(payload.repos));
          }
        }
      } catch {
        // Fallback gracefully to cache if offline
      }
    }

    fetchLiveRepositories();
    const interval = setInterval(fetchLiveRepositories, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute available languages
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((r) => {
      if (r.language && r.language !== 'Code') langs.add(r.language);
    });
    return ['All', ...Array.from(langs).sort()];
  }, [repos]);

  // Calculate year distribution for the Pie Chart
  const yearDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    repos.forEach((r) => {
      const y = r.year || '2026';
      counts[y] = (counts[y] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year));
  }, [repos]);

  const totalRepos = repos.length || 1;

  // Compute SVG Pie Slices
  const pieSlices = useMemo(() => {
    let cumulativeAngle = 0;
    return yearDistribution.map((item, idx) => {
      const fraction = item.count / totalRepos;
      const angle = fraction * 360;

      // Handle single item (100% full circle)
      if (item.count === totalRepos || fraction >= 0.999) {
        const pathData = `M 0 -90 A 90 90 0 1 1 0 90 A 90 90 0 1 1 0 -90 Z`;
        return {
          ...item,
          pathData,
          percentage: 100,
          color: getYearColor(item.year, idx),
        };
      }

      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle += angle;

      const startRad = (startAngle - 90) * (Math.PI / 180);
      const endRad = (endAngle - 90) * (Math.PI / 180);

      const r = 90;
      const x1 = r * Math.cos(startRad);
      const y1 = r * Math.sin(startRad);
      const x2 = r * Math.cos(endRad);
      const y2 = r * Math.sin(endRad);

      const largeArcFlag = angle > 180 ? 1 : 0;
      const pathData = `M 0 0 L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;

      return {
        ...item,
        pathData,
        percentage: Math.round(fraction * 100),
        color: getYearColor(item.year, idx),
      };
    });
  }, [yearDistribution, totalRepos]);

  // Filtered repositories by Year, Language, and Search Query
  const filteredRepos = useMemo(() => {
    return repos.filter((r) => {
      // 1. Year Filter
      if (selectedYear && r.year !== selectedYear) return false;

      // 2. Language Filter
      if (selectedLanguage !== 'All' && r.language !== selectedLanguage) return false;

      // 3. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const text = `${r.name} ${r.description || ''} ${r.language || ''} ${r.year} ${(r.tags || []).join(' ')}`.toLowerCase();
        return text.includes(q);
      }

      return true;
    });
  }, [repos, selectedYear, selectedLanguage, searchQuery]);

  const displayedRepos = limit ? filteredRepos.slice(0, limit) : filteredRepos;

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-20">

        {/* Flagship Showcase: Things I've Built, End to End */}
        <ProjectsDeepDiveShowcase />

        {/* 1. Header & Dynamic Project Count */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line pt-10">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5 text-ember" />
                Repository Matrix &amp; Work Archive
              </span>
              <h1 className="font-display text-4xl sm:text-6xl font-black text-bone tracking-tight">
                {filteredRepos.length} {filteredRepos.length === 1 ? 'Project' : 'Projects'}
              </h1>
            </div>

            {/* Language Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {availableLanguages.slice(0, 6).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    selectedLanguage === lang
                      ? 'bg-ember text-ink font-bold shadow-md shadow-ember/20'
                      : 'bg-surface border border-line text-muted hover:text-bone hover:border-line/80'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 2. Interactive Pie Chart & Year Legend Card */}
        <ScrollReveal direction="up" delay={0.15}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center rounded-xl border border-line bg-surface p-8 shadow-panel relative overflow-hidden">
            
            {/* Ambient Ember Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-ember/5 blur-[120px] pointer-events-none rounded-full" />

            {/* Left: SVG Pie Chart */}
            <div className="md:col-span-6 flex flex-col items-center justify-center relative">
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
                <svg
                  viewBox="-110 -110 220 220"
                  className="w-full h-full transform -rotate-90 drop-shadow-lg overflow-visible"
                >
                  {pieSlices.map((slice) => {
                    const isSelected = selectedYear === slice.year;
                    const isHovered = hoveredYear === slice.year;
                    return (
                      <path
                        key={slice.year}
                        d={slice.pathData}
                        fill={slice.color.fill}
                        stroke="#090d16"
                        strokeWidth="3"
                        className={`transition-all duration-300 cursor-pointer ${
                          isSelected || isHovered
                            ? 'scale-105 opacity-100 filter drop-shadow(0 0 12px rgba(249,115,22,0.4))'
                            : 'opacity-85 hover:opacity-100'
                        }`}
                        onClick={() => setSelectedYear(isSelected ? null : slice.year)}
                        onMouseEnter={() => setHoveredYear(slice.year)}
                        onMouseLeave={() => setHoveredYear(null)}
                      />
                    );
                  })}
                </svg>

                {/* Center Badge / Hover Info */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none font-mono text-center">
                  {hoveredYear || selectedYear ? (
                    <div className="bg-ink/90 px-3 py-1.5 rounded-lg border border-line shadow-md backdrop-blur-sm animate-fade-in">
                      <span className="text-xs text-muted block">Year</span>
                      <span className="text-sm font-bold text-bone">{hoveredYear || selectedYear}</span>
                    </div>
                  ) : (
                    <div className="bg-ink/60 px-3 py-1 rounded-full border border-line/60 backdrop-blur-sm">
                      <span className="text-[0.65rem] text-muted uppercase font-bold tracking-wider">
                        Distribution
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Year Legend Card Box */}
            <div className="md:col-span-6 space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-line pb-3 text-xs text-muted">
                <span>Filter by Year</span>
                {selectedYear && (
                  <button
                    onClick={() => setSelectedYear(null)}
                    className="text-ember hover:underline flex items-center gap-1 text-[0.7rem]"
                  >
                    <span>Clear Filter</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pieSlices.map((slice) => {
                  const isSelected = selectedYear === slice.year;
                  const isHovered = hoveredYear === slice.year;
                  return (
                    <button
                      key={slice.year}
                      onClick={() => setSelectedYear(isSelected ? null : slice.year)}
                      onMouseEnter={() => setHoveredYear(slice.year)}
                      onMouseLeave={() => setHoveredYear(null)}
                      className={`p-3 rounded-lg border transition-all text-left flex items-center justify-between ${
                        isSelected
                          ? 'bg-ember/15 border-ember text-bone shadow-md'
                          : isHovered
                          ? 'bg-ink border-line text-bone'
                          : 'bg-ink/60 border-line/70 text-bone-dim hover:bg-ink hover:text-bone'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                          style={{ backgroundColor: slice.color.fill }}
                        />
                        <span className="font-bold text-xs sm:text-sm">{slice.year}</span>
                      </div>
                      <span className="text-xs text-muted font-semibold">({slice.count})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 3. Search Bar Input (Search Projects...) */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted">
              <Search className="w-4 h-4 text-muted" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search public repositories by name, language, or description..."
              className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-surface border border-line text-bone placeholder-muted focus:border-ember focus:outline-none text-sm font-mono shadow-panel transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted hover:text-bone"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </ScrollReveal>

        {/* 4. Repository Matrix Grid Cards */}
        {displayedRepos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedRepos.map((repo, idx) => {
              const langInfo = repo.language ? LANGUAGE_COLORS[repo.language] || { hex: '#f97316' } : null;
              return (
                <ScrollReveal key={repo.id} direction="up" delay={0.05 + (idx % 6) * 0.05}>
                  <div className="rounded-xl border border-line bg-surface p-6 shadow-panel hover:border-ember/50 transition-colors flex flex-col justify-between group h-full">
                    <div>
                      {/* Card Top Meta */}
                      <div className="flex items-center justify-between mb-3 font-mono text-xs">
                        {langInfo ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-ink border border-line text-bone-dim">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langInfo.hex }} />
                            {repo.language}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded bg-ink border border-line text-muted">Code</span>
                        )}
                        <span className="text-muted flex items-center gap-1 text-[0.7rem]">
                          <GitBranch className="w-3.5 h-3.5 text-ember" />
                          <span>{repo.year}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-mono text-base font-bold text-bone group-hover:text-ember transition-colors mb-2 truncate">
                        {repo.name}
                      </h3>

                      {/* Description */}
                      <p className="text-bone-dim text-xs line-clamp-3 leading-relaxed mb-4">
                        {repo.description || 'Data science & machine learning project repository.'}
                      </p>
                    </div>

                    {/* Card Bottom Link */}
                    <div className="pt-4 border-t border-line/60 flex items-center justify-between font-mono text-xs">
                      <span className="text-muted text-[0.68rem]">
                        Created {repo.created_at ? new Date(repo.created_at).toLocaleDateString() : repo.year}
                      </span>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ember hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        <span>Repository</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center font-mono text-sm text-muted rounded-xl bg-surface border border-line space-y-3">
            <p className="text-bone font-semibold">No repositories matched your criteria.</p>
            <p className="text-xs">Try adjusting your search query or language/year filter.</p>
            <button
              onClick={() => {
                setSelectedYear(null);
                setSelectedLanguage('All');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-lg bg-ember text-ink font-bold text-xs inline-flex items-center gap-2"
            >
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
