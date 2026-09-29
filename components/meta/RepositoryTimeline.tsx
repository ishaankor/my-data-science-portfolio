'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Calendar,
  GitBranch,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Globe,
  Filter,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { portfolioData } from '@/data/portfolio';
import { useGitHubData } from '@/hooks/useGitHubData';

export interface TimelineMilestone {
  id: string | number;
  name: string;
  created_at: string;
  formattedDate: string;
  year: string;
  monthYear: string;
  language: string;
  html_url: string;
  liveUrl?: string;
  description: string;
  metrics?: string;
  tags?: string[];
  isFeatured?: boolean;
  migratedDate?: string;
  inceptionDate?: string;
  category: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#38bdf8',
  TypeScript: '#818cf8',
  JavaScript: '#facc15',
  HTML: '#fb923c',
  CSS: '#c084fc',
  'C++': '#f43f5e',
  Shell: '#4ade80',
  Jupyter: '#f97316',
  'Jupyter Notebook': '#f97316',
  Electron: '#38bdf8',
  React: '#61dafb',
  'Next.js': '#e2e8f0',
  Code: '#94a3b8',
};

const EXCLUDED_REPOS = new Set([
  'lab7',
  'lab3',
  'list-examples-grader',
  'githubpractice',
  'cogs108_repo',
  'myfirstpullrequest',
  'it-cert-automation-practice',
]);

function inferCategory(name: string, description: string, language: string): string {
  const text = `${name} ${description}`.toLowerCase();
  if (text.includes('deal') || text.includes('copilot') || text.includes('ai') || text.includes('bot') || text.includes('mcp') || text.includes('agent')) {
    return 'Agentic AI & Web';
  }
  if (text.includes('analysis') || text.includes('stats') || text.includes('obesity') || text.includes('surgery') || text.includes('bikewatching') || text.includes('eda') || language.includes('Jupyter')) {
    return 'Data Science & EDA';
  }
  if (text.includes('automation') || text.includes('merger') || text.includes('upkeeper') || text.includes('notes') || text.includes('claimer') || text.includes('claimr') || text.includes('selenium')) {
    return 'Automation & Tooling';
  }
  if (language === 'TypeScript' || language === 'JavaScript' || language === 'HTML') {
    return 'Web Platform';
  }
  return 'Systems & Codebase';
}

function buildMilestones(rawRepos?: any[]): TimelineMilestone[] {
  const map = new Map<string, TimelineMilestone>();

  const getRepoKey = (url: string, name: string) => {
    const parts = (url || '').replace(/\/+$/, '').split('/');
    const slug = parts.pop() || name;
    return slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const reposToProcess = Array.isArray(rawRepos) ? rawRepos : [];

  reposToProcess.forEach((r) => {
    if (r.private) return;
    if (!r.html_url || !r.html_url.startsWith('https://github.com/')) return;
    const nameLower = (r.name || '').toLowerCase();
    if (EXCLUDED_REPOS.has(nameLower)) return;

    const rawDate = r.created_at || r.pushed_at || '2025-01-01T00:00:00Z';
    const dateObj = new Date(rawDate);
    const year = !isNaN(dateObj.getFullYear()) ? dateObj.getFullYear().toString() : '2025';

    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const monthYear = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    const key = getRepoKey(r.html_url, r.name);
    const lang = r.language || 'Code';
    const desc = r.description || 'Open-source repository engineered for production scale.';

    map.set(key, {
      id: r.id || key,
      name: r.name,
      created_at: rawDate,
      formattedDate,
      year,
      monthYear,
      language: lang,
      html_url: r.html_url,
      description: desc,
      isFeatured: false,
      category: inferCategory(r.name, desc, lang),
    });
  });

  (portfolioData.projects || []).forEach((p) => {
    const key = p.githubUrl ? getRepoKey(p.githubUrl, p.title) : p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existing = map.get(key);

    if (existing) {
      existing.name = p.title;
      existing.description = p.description || existing.description;
      existing.metrics = p.metrics;
      existing.tags = p.tags;
      existing.liveUrl = p.liveUrl;
      existing.isFeatured = p.featured;
      if (p.category) existing.category = p.category;
      if (p.tags && p.tags[0] && (!existing.language || existing.language === 'Code')) {
        existing.language = p.tags[0];
      }
      if (p.year) existing.year = p.year;
      if (p.inceptionDate) {
        existing.created_at = p.inceptionDate;
        existing.inceptionDate = p.inceptionDate;
        const dateObj = new Date(p.inceptionDate);
        existing.formattedDate = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        existing.monthYear = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        });
      }
      if (p.migratedDate) {
        existing.migratedDate = p.migratedDate;
      }
    } else {
      const year = p.year || '2025';
      const dateStr = p.inceptionDate || `${year}-01-15T12:00:00Z`;
      const dateObj = new Date(dateStr);
      map.set(key, {
        id: p.id,
        name: p.title,
        created_at: dateStr,
        formattedDate: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        year,
        monthYear: dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        language: p.tags[0] || 'Code',
        html_url: p.githubUrl || p.liveUrl || '#',
        liveUrl: p.liveUrl,
        description: p.description,
        metrics: p.metrics,
        tags: p.tags,
        isFeatured: p.featured,
        migratedDate: p.migratedDate,
        inceptionDate: p.inceptionDate,
        category: p.category || inferCategory(p.title, p.description, p.tags[0] || 'Code'),
      });
    }
  });

  return Array.from(map.values()).sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}

export interface RepositoryTimelineProps {
  repos?: any[];
}

export default function RepositoryTimeline({ repos: propRepos }: RepositoryTimelineProps = {}) {
  const { repos: hookRepos } = useGitHubData();
  const liveRepos = useMemo(() => {
    return Array.isArray(propRepos) && propRepos.length > 0 ? propRepos : hookRepos;
  }, [propRepos, hookRepos]);

  const allMilestones = useMemo(() => buildMilestones(liveRepos), [liveRepos]);

  const [selectedYear, setSelectedYear] = useState<string>('All');
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(allMilestones.map((m) => m.year))).sort((a, b) => b.localeCompare(a));
    return ['All', ...years];
  }, [allMilestones]);

  const filteredMilestones = useMemo(() => {
    if (selectedYear === 'All') return allMilestones;
    return allMilestones.filter((m) => m.year === selectedYear);
  }, [allMilestones, selectedYear]);

  const [activeId, setActiveId] = useState<string | number>(() => {
    return allMilestones[allMilestones.length - 1]?.id || '';
  });

  useEffect(() => {
    if (!activeId && allMilestones.length > 0) {
      setActiveId(allMilestones[allMilestones.length - 1].id);
    }
  }, [allMilestones, activeId]);

  const activeMilestone = useMemo(() => {
    const found = allMilestones.find((m) => m.id === activeId);
    return found || allMilestones[allMilestones.length - 1] || null;
  }, [allMilestones, activeId]);

  const activeOverallIndex = useMemo(() => {
    if (!activeMilestone) return 0;
    const idx = allMilestones.findIndex((m) => m.id === activeMilestone.id);
    return idx >= 0 ? idx : 0;
  }, [allMilestones, activeMilestone]);

  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const isFirstMountRef = useRef(true);

  const handleStep = useCallback((direction: number) => {
    const targetIdx = activeOverallIndex + direction;
    if (targetIdx >= 0 && targetIdx < allMilestones.length) {
      const nextMilestone = allMilestones[targetIdx];
      setActiveId(nextMilestone.id);
      if (selectedYear !== 'All' && nextMilestone.year !== selectedYear) {
        setSelectedYear('All');
      }
    }
  }, [activeOverallIndex, allMilestones, selectedYear]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowRight') handleStep(1);
      else if (e.key === 'ArrowLeft') handleStep(-1);
    },
    [handleStep]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Center active node into view on initial mount and when activeId changes
  useEffect(() => {
    if (!scrollTrackRef.current || !activeMilestone) return;

    const timer = setTimeout(() => {
      if (!scrollTrackRef.current) return;
      const nodeEl = scrollTrackRef.current.querySelector(
        `[data-milestone-id="${activeMilestone.id}"]`
      ) as HTMLElement | null;

      if (nodeEl) {
        const container = scrollTrackRef.current;
        const nodeLeft = nodeEl.offsetLeft;
        const nodeWidth = nodeEl.clientWidth;
        const targetScrollLeft = nodeLeft - container.clientWidth / 2 + nodeWidth / 2;
        
        const behavior = isFirstMountRef.current ? 'auto' : 'smooth';
        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior,
        });
        isFirstMountRef.current = false;
      }
    }, 20);

    return () => clearTimeout(timer);
  }, [activeMilestone, selectedYear]);

  const handleWheelScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollTrackRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !e.shiftKey) {
      scrollTrackRef.current.scrollLeft += e.deltaY;
    }
  };

  const scrollRunway = (direction: 'left' | 'right') => {
    if (!scrollTrackRef.current) return;
    scrollTrackRef.current.scrollBy({
      left: direction === 'left' ? -360 : 360,
      behavior: 'smooth',
    });
  };

  const handleSelectYear = (year: string) => {
    setSelectedYear(year);
    if (year !== 'All') {
      const firstInYear = allMilestones.find((m) => m.year === year);
      if (firstInYear) setActiveId(firstInYear.id);
    }
  };

  // Group milestones by year for integrated epoch dividers
  const milestonesWithYearMarkers = useMemo(() => {
    const result: Array<{ type: 'epoch'; year: string; count: number } | { type: 'milestone'; milestone: TimelineMilestone; indexInFiltered: number }> = [];
    let lastYear = '';

    filteredMilestones.forEach((m, idx) => {
      if (m.year !== lastYear) {
        lastYear = m.year;
        const countInThisYear = allMilestones.filter((item) => item.year === m.year).length;
        result.push({ type: 'epoch', year: m.year, count: countInThisYear });
      }
      result.push({ type: 'milestone', milestone: m, indexInFiltered: idx });
    });

    return result;
  }, [filteredMilestones, allMilestones]);

  const activeLangColor = activeMilestone ? (LANGUAGE_COLORS[activeMilestone.language] || '#38bdf8') : '#38bdf8';

  return (
    <ScrollReveal direction="up" delay={0.15}>
      <div className="rounded-xl border border-line bg-surface p-4 sm:p-5 shadow-panel space-y-3.5 relative overflow-hidden">
        
        {/* 1. Ultra-Compact Header & Era Filter Bar (Single Row) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3.5">
          <div className="flex items-center gap-2.5">
            <GitBranch className="w-4 h-4 text-ember shrink-0" />
            <h2 className="font-display text-base sm:text-lg font-bold text-bone">
              Repository Timeline
            </h2>
            <span className="text-[0.68rem] font-mono px-2 py-0.5 rounded-full bg-ink border border-line text-muted">
              {allMilestones.length} Inceptions
            </span>
          </div>

          {/* Era Filter Pills & Stepper */}
          <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto custom-scrollbar pb-0.5">
            <div className="flex items-center gap-1 bg-ink/70 border border-line rounded-lg p-0.5 shrink-0">
              {availableYears.map((year) => {
                const isSelected = selectedYear === year;
                return (
                  <button
                    key={year}
                    onClick={() => handleSelectYear(year)}
                    className={`px-2 py-0.5 rounded text-[0.68rem] transition-all ${
                      isSelected
                        ? 'bg-ember/20 text-ember font-bold shadow-xs'
                        : 'text-muted hover:text-bone'
                    }`}
                  >
                    {year === 'All' ? 'All' : year}
                  </button>
                );
              })}
            </div>

            {/* Stepper */}
            <div className="flex items-center bg-ink border border-line rounded-lg p-0.5 shrink-0">
              <button
                onClick={() => handleStep(-1)}
                disabled={activeOverallIndex === 0}
                className="p-1 rounded hover:bg-surface disabled:opacity-30 text-bone transition-colors"
                title="Previous (←)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-1.5 text-[0.68rem] font-mono text-bone-dim select-none">
                {String(activeOverallIndex + 1).padStart(2, '0')}/{String(allMilestones.length).padStart(2, '0')}
              </span>

              <button
                onClick={() => handleStep(1)}
                disabled={activeOverallIndex === allMilestones.length - 1}
                className="p-1 rounded hover:bg-surface disabled:opacity-30 text-bone transition-colors"
                title="Next (→)"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => {
                setActiveId(allMilestones[allMilestones.length - 1]?.id);
                setSelectedYear('All');
              }}
              className="p-1.5 rounded-lg bg-ink border border-line hover:border-ember/50 text-muted hover:text-bone transition-colors shrink-0"
              title="Jump to latest"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Compact Horizontal Trunk Runway (Height ~88px) */}
        <div className="rounded-lg border border-line bg-[#060911] relative overflow-hidden group/runway">
          
          {/* Scroll arrow buttons */}
          <button
            onClick={() => scrollRunway('left')}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-ink/90 border border-line hover:border-ember text-bone shadow-md opacity-0 group-hover/runway:opacity-100 transition-all backdrop-blur-sm"
            title="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => scrollRunway('right')}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-ink/90 border border-line hover:border-ember text-bone shadow-md opacity-0 group-hover/runway:opacity-100 transition-all backdrop-blur-sm"
            title="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Fade edges */}
          <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-[#060911] to-transparent pointer-events-none z-10" />
          <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-[#060911] to-transparent pointer-events-none z-10" />

          {/* Scroll Track */}
          <div
            ref={scrollTrackRef}
            onWheel={handleWheelScroll}
            className="overflow-x-auto custom-scrollbar px-4 py-3 select-none"
          >
            <div className="relative pt-2 pb-1 inline-flex">
              
              {/* Horizontal Trunk Rail (Mathematically centered at 20px) */}
              <div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-line via-line/80 to-line pointer-events-none"
                style={{ top: '19px' }}
              />

              {/* Items strip */}
              <div className="flex items-start gap-2.5">
                {milestonesWithYearMarkers.map((item, idx) => {
                  if (item.type === 'epoch') {
                    return (
                      <div
                        key={`epoch-${item.year}-${idx}`}
                        className="shrink-0 flex flex-col items-center justify-start px-1"
                        style={{ width: '70px' }}
                      >
                        <div className="flex items-center justify-center h-6 mb-2">
                          <div className="w-2 h-2 rounded-full bg-ember/70 border border-ember" />
                        </div>
                        <div className="w-full px-1.5 py-1 rounded bg-ink/90 border border-line/80 text-center">
                          <span className="font-mono text-[0.65rem] font-bold text-ember block leading-tight">
                            {item.year}
                          </span>
                          <span className="font-mono text-[0.55rem] text-muted block leading-tight">
                            {item.count} repos
                          </span>
                        </div>
                      </div>
                    );
                  }

                  const m = item.milestone;
                  const isSelected = activeMilestone?.id === m.id;
                  const langColor = LANGUAGE_COLORS[m.language] || '#38bdf8';

                  return (
                    <div
                      key={m.id}
                      data-milestone-id={m.id}
                      onClick={() => setActiveId(m.id)}
                      className={`shrink-0 cursor-pointer flex flex-col items-center group transition-transform duration-150 ${
                        isSelected ? 'scale-102' : 'hover:scale-101 opacity-80 hover:opacity-100'
                      }`}
                      style={{ width: '135px' }}
                    >
                      {/* Commit Node Marker (Mathematically centered at 20px) */}
                      <div className="relative mb-2 flex items-center justify-center h-6">
                        {isSelected && (
                          <div
                            className="absolute w-5 h-5 rounded-full opacity-35 blur-xs pointer-events-none"
                            style={{ backgroundColor: langColor }}
                          />
                        )}
                        <div
                          className={`rounded-full transition-all flex items-center justify-center ${
                            isSelected
                              ? 'w-4 h-4 bg-ink border-2 border-white shadow-sm'
                              : 'w-3 h-3 bg-ink border-2 group-hover:border-bone'
                          }`}
                          style={{ borderColor: isSelected ? '#ffffff' : langColor }}
                        >
                          <div
                            className={`rounded-full ${isSelected ? 'w-1.5 h-1.5 bg-white' : 'w-1 h-1'}`}
                            style={{ backgroundColor: isSelected ? '#ffffff' : langColor }}
                          />
                        </div>
                      </div>

                      {/* Milestone Chip */}
                      <div
                        className={`w-full px-2.5 py-1.5 rounded-md border text-left transition-all ${
                          isSelected
                            ? 'bg-surface border-ember shadow-sm ring-1 ring-ember/30'
                            : 'bg-ink/80 border-line/70 hover:border-line'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[0.58rem] font-mono text-muted mb-0.5">
                          <span>{m.monthYear}</span>
                          {m.isFeatured && (
                            <span className="text-amber-400 font-bold" title="Flagship Platform">★</span>
                          )}
                        </div>
                        <h4
                          className={`text-[0.72rem] font-bold font-sans line-clamp-1 leading-tight transition-colors ${
                            isSelected ? 'text-bone' : 'text-bone-dim group-hover:text-bone'
                          }`}
                          title={m.name}
                        >
                          {m.name}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Compact Active Milestone Telemetry Deck */}
        {activeMilestone && (
          <div className="p-3.5 sm:p-4 rounded-lg border border-line bg-ink/85 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-panel relative">
            
            {/* Top Accent Strip */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] rounded-t-lg bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(to right, ${activeLangColor}, transparent)`,
              }}
            />

            {/* Left: Metadata & Project Information */}
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-[0.68rem]">
                <span className="px-2 py-0.2 rounded bg-ember/10 border border-ember/30 text-ember font-bold">
                  #{activeOverallIndex + 1} of {allMilestones.length}
                </span>

                <span className="text-bone-dim flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-400" />
                  <span>{activeMilestone.formattedDate}</span>
                </span>

                <span className="text-muted/60">•</span>

                <span className="text-bone-dim flex items-center gap-1">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: activeLangColor }}
                  />
                  <span>{activeMilestone.language}</span>
                </span>

                <span className="text-muted/60">•</span>
                <span className="text-muted truncate max-w-[140px]">{activeMilestone.category}</span>

                {activeMilestone.migratedDate && (
                  <span className="text-amber-400/90 text-[0.62rem]">
                    (Synced: {activeMilestone.migratedDate})
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-bold text-bone truncate">
                  {activeMilestone.name}
                </h3>
                {activeMilestone.isFeatured && (
                  <span className="text-[0.6rem] font-mono px-2 py-0.2 rounded-full bg-ember/15 border border-ember text-ember shrink-0">
                    Flagship
                  </span>
                )}
              </div>

              <p className="text-bone-dim text-xs line-clamp-1 font-mono text-muted max-w-3xl">
                {activeMilestone.description}
              </p>
            </div>

            {/* Right: Metric badge & Action links */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-1 md:pt-0">
              {activeMilestone.metrics && (
                <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[0.68rem]">
                  <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate max-w-[170px]">{activeMilestone.metrics}</span>
                </span>
              )}

              <a
                href={activeMilestone.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ember text-ink font-bold hover:bg-ember/90 transition-all text-xs"
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Repo</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {activeMilestone.liveUrl && (
                <a
                  href={activeMilestone.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-cyan-400 text-bone hover:text-cyan-400 transition-colors text-xs"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Demo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

          </div>
        )}

      </div>
    </ScrollReveal>
  );
}
