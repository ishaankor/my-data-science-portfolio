'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Calendar,
  GitBranch,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Compass,
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

function buildMilestones(rawRepos?: any[]): TimelineMilestone[] {
  const map = new Map<string, TimelineMilestone>();

  const getRepoKey = (url: string, name: string) => {
    const parts = url.replace(/\/+$/, '').split('/');
    const slug = parts.pop() || name;
    return slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  // 1. Ingest raw GitHub repos
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

    map.set(key, {
      id: r.id || key,
      name: r.name,
      created_at: rawDate,
      formattedDate,
      year,
      monthYear,
      language: r.language || 'Code',
      html_url: r.html_url,
      description: r.description || 'Open-source repository engineered for production scale.',
      isFeatured: false,
    });
  });

  // 2. Enrich with curated portfolio flagships
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
      if (p.year) existing.year = p.year;
    } else {
      const year = p.year || '2025';
      const dateStr = `${year}-01-15T12:00:00Z`;
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
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    Math.max(0, allMilestones.length - 1)
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const scrollTrackRef = useRef<HTMLDivElement | null>(null);

  // Clamp active milestone index safely
  const clampedIndex = useMemo(() => {
    if (allMilestones.length === 0) return 0;
    if (activeIndex >= allMilestones.length) return allMilestones.length - 1;
    if (activeIndex < 0) return 0;
    return activeIndex;
  }, [allMilestones, activeIndex]);

  const activeMilestone = allMilestones[clampedIndex] || allMilestones[allMilestones.length - 1];

  // Auto-play / Walkthrough mode: Continues from current selection; restarts from beginning if at the end
  const handleTogglePlay = useCallback(() => {
    if (!isPlaying) {
      if (clampedIndex >= allMilestones.length - 1) {
        setActiveIndex(0);
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [isPlaying, clampedIndex, allMilestones.length]);

  // Step interval for auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        if (prev >= allMilestones.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, [isPlaying, allMilestones.length]);

  // Smoothly center active milestone node in horizontal scroll view
  useEffect(() => {
    if (!scrollTrackRef.current) return;
    const nodeEl = scrollTrackRef.current.querySelector(
      `[data-milestone-idx="${clampedIndex}"]`
    ) as HTMLElement | null;
    if (nodeEl) {
      const containerWidth = scrollTrackRef.current.clientWidth;
      const nodeLeft = nodeEl.offsetLeft;
      const nodeWidth = nodeEl.clientWidth;
      scrollTrackRef.current.scrollTo({
        left: nodeLeft - containerWidth / 2 + nodeWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [clampedIndex]);

  // Keyboard navigation shortcuts (Left/Right arrow)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => Math.min(allMilestones.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => Math.max(0, prev - 1));
      }
    },
    [allMilestones.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Sine Wave Geometry Calculations
  const NODE_SPACING = 170;
  const AMPLITUDE = 48; // Peak/Trough offset from center
  const CENTER_Y = 145; // Center of the sine wave stage
  const STAGE_HEIGHT = 290;
  const totalTrackWidth = Math.max(allMilestones.length * NODE_SPACING + 220, 880);

  // Compute exact (x, y) coordinates for each node on the sine wave
  const nodePositions = useMemo(() => {
    return allMilestones.map((_, idx) => {
      const x = 90 + idx * NODE_SPACING;
      // Even index: Crest (up at Y = CENTER_Y - AMPLITUDE)
      // Odd index: Trough (down at Y = CENTER_Y + AMPLITUDE)
      const isCrest = idx % 2 === 0;
      const y = isCrest ? CENTER_Y - AMPLITUDE : CENTER_Y + AMPLITUDE;
      return { x, y, isCrest };
    });
  }, [allMilestones]);

  // Generate SVG Sine-Wave Bezier Path String weaving through all nodes
  const fullSinePathD = useMemo(() => {
    if (nodePositions.length === 0) return '';
    const first = nodePositions[0];
    // Start curve smoothly from left
    let d = `M 20 ${CENTER_Y} C 50 ${CENTER_Y}, ${first.x - 45} ${first.y}, ${first.x} ${first.y}`;

    for (let i = 0; i < nodePositions.length - 1; i++) {
      const p1 = nodePositions[i];
      const p2 = nodePositions[i + 1];
      const dx = p2.x - p1.x;
      // Cubic Bezier with horizontal tangents at crests and troughs (dy/dx = 0)
      d += ` C ${p1.x + dx * 0.5} ${p1.y}, ${p2.x - dx * 0.5} ${p2.y}, ${p2.x} ${p2.y}`;
    }

    // End curve smoothly to right
    const last = nodePositions[nodePositions.length - 1];
    d += ` C ${last.x + 45} ${last.y}, ${totalTrackWidth - 40} ${CENTER_Y}, ${totalTrackWidth - 15} ${CENTER_Y}`;
    return d;
  }, [nodePositions, totalTrackWidth]);

  // Generate Illuminated Path up to current active milestone
  const activeSinePathD = useMemo(() => {
    if (nodePositions.length === 0 || clampedIndex < 0) return '';
    const first = nodePositions[0];
    let d = `M 20 ${CENTER_Y} C 50 ${CENTER_Y}, ${first.x - 45} ${first.y}, ${first.x} ${first.y}`;

    for (let i = 0; i < clampedIndex; i++) {
      const p1 = nodePositions[i];
      const p2 = nodePositions[i + 1];
      const dx = p2.x - p1.x;
      d += ` C ${p1.x + dx * 0.5} ${p1.y}, ${p2.x - dx * 0.5} ${p2.y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [nodePositions, clampedIndex]);

  // Compute dynamic min and max year range
  const yearRange = useMemo(() => {
    if (allMilestones.length === 0) return '2023 – 2026';
    const years = allMilestones
      .map((m) => parseInt(m.year))
      .filter((y) => !isNaN(y) && y > 2000 && y < 2100);
    if (years.length === 0) return '2023 – 2026';
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    return minYear === maxYear ? `${minYear}` : `${minYear} – ${maxYear}`;
  }, [allMilestones]);

  return (
    <ScrollReveal direction="up" delay={0.15}>
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 shadow-panel space-y-7 relative overflow-hidden">
        
        {/* CSS Keyframe Style for Flowing Sine-Wave Energy Beam */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes sineWaveFlow {
              0% { stroke-dashoffset: 320; }
              100% { stroke-dashoffset: 0; }
            }
            .animate-sine-flow {
              animation: sineWaveFlow 12s linear infinite;
            }
            .animate-fast-glow {
              animation: sineWaveFlow 6s linear infinite;
            }
          `
        }} />

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-ember/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

        {/* 1. Header & Timeline Stepper Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-line pb-6">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-ember" />
              Repository Trajectory ({yearRange})
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-bone flex items-center gap-2.5">
              <span>Interactive Repository Timeline</span>
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-ember/10 border border-ember/30 text-ember">
                {allMilestones.length} Inceptions
              </span>
            </h2>
            <p className="text-bone-dim text-xs sm:text-sm mt-1 max-w-2xl font-mono">
              Continuous flow documenting my repositories with live kinetic animations.
            </p>
          </div>

          {/* Stepper & Playback Controls */}
          <div className="flex items-center gap-2 font-mono text-xs shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
              disabled={clampedIndex === 0}
              className="p-2 rounded-lg bg-ink border border-line hover:border-ember/50 disabled:opacity-40 disabled:hover:border-line text-bone transition-colors"
              title="Previous Milestone (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-ember/10 border border-ember/40 text-ember hover:bg-ember/20 font-bold transition-colors shadow-sm"
              title={
                isPlaying
                  ? 'Pause Auto Walk'
                  : clampedIndex >= allMilestones.length - 1
                  ? 'Start Auto Walk from Beginning'
                  : 'Continue Auto Walk'
              }
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Auto Walk'}</span>
            </button>

            <button
              onClick={() => setActiveIndex((prev) => Math.min(allMilestones.length - 1, prev + 1))}
              disabled={clampedIndex >= allMilestones.length - 1}
              className="p-2 rounded-lg bg-ink border border-line hover:border-ember/50 disabled:opacity-40 disabled:hover:border-line text-bone transition-colors"
              title="Next Milestone (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setActiveIndex(allMilestones.length - 1);
                setIsPlaying(false);
              }}
              className="p-2 rounded-lg bg-ink border border-line hover:border-ember/50 text-muted hover:text-bone transition-colors ml-1"
              title="Jump to Latest"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Sine-Wave Animated Timeline Stage */}
        <div className="rounded-xl border border-line bg-[#060911] shadow-inner relative overflow-hidden">
          
          <div
            ref={scrollTrackRef}
            className="overflow-x-auto custom-scrollbar p-6 select-none relative"
            style={{ minHeight: `${STAGE_HEIGHT}px` }}
          >
            <div style={{ width: `${totalTrackWidth}px`, height: `${STAGE_HEIGHT - 30}px` }} className="relative">
              
              {/* SVG Sine-Wave Pathway & Animated Light Beams */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  {/* Glowing Gradients */}
                  <linearGradient id="sineGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                    <stop offset="45%" stopColor="#a855f7" stopOpacity="0.9" />
                    <stop offset="80%" stopColor="#38bdf8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>

                  <linearGradient id="sineBaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#818cf8" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.25" />
                  </linearGradient>

                  {/* Soft Blur Filter for Atmospheric Sine Glow */}
                  <filter id="sineBlur" x="-10%" y="-20%" width="120%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* 1. Subtle Center Reference Axis */}
                <line
                  x1="20"
                  y1={CENTER_Y}
                  x2={totalTrackWidth - 20}
                  y2={CENTER_Y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                  strokeDasharray="4 8"
                />

                {/* 2. Sine Wave Ambient Blurred Outer Halo */}
                {fullSinePathD && (
                  <path
                    d={fullSinePathD}
                    fill="none"
                    stroke="url(#sineGlowGrad)"
                    strokeWidth="8"
                    opacity="0.2"
                    filter="url(#sineBlur)"
                  />
                )}

                {/* 3. Base Sine-Wave Curve Track */}
                {fullSinePathD && (
                  <path
                    id="sinePathTrack"
                    d={fullSinePathD}
                    fill="none"
                    stroke="url(#sineBaseGrad)"
                    strokeWidth="2.5"
                  />
                )}

                {/* 4. Kinetic Moving Dash Energy Flow along Sine Wave */}
                {fullSinePathD && (
                  <path
                    d={fullSinePathD}
                    fill="none"
                    stroke="url(#sineGlowGrad)"
                    strokeWidth="2.5"
                    strokeDasharray="8 16"
                    className="animate-sine-flow"
                    opacity="0.75"
                  />
                )}

                {/* 5. Active Progress Illuminated Sine Path */}
                {activeSinePathD && (
                  <path
                    d={activeSinePathD}
                    fill="none"
                    stroke="url(#sineGlowGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="animate-fast-glow"
                    opacity="0.95"
                  />
                )}

                {/* 6. Continuous Traveling Photon Particle #1 (Ember) */}
                {fullSinePathD && (
                  <g>
                    <circle r="4" fill="#f97316" filter="drop-shadow(0 0 6px #f97316)">
                      <animateMotion
                        dur="9s"
                        repeatCount="indefinite"
                        path={fullSinePathD}
                      />
                    </circle>
                  </g>
                )}

                {/* 7. Continuous Traveling Photon Particle #2 (Cyan) */}
                {fullSinePathD && (
                  <g>
                    <circle r="3.5" fill="#38bdf8" filter="drop-shadow(0 0 6px #38bdf8)">
                      <animateMotion
                        dur="9s"
                        begin="4.5s"
                        repeatCount="indefinite"
                        path={fullSinePathD}
                      />
                    </circle>
                  </g>
                )}

                {/* 8. Continuous Traveling Photon Particle #3 (Purple) */}
                {fullSinePathD && (
                  <g>
                    <circle r="3" fill="#a855f7" filter="drop-shadow(0 0 5px #a855f7)">
                      <animateMotion
                        dur="12s"
                        begin="2s"
                        repeatCount="indefinite"
                        path={fullSinePathD}
                      />
                    </circle>
                  </g>
                )}
              </svg>

              {/* Milestone Nodes positioned at each Crest and Trough on the Sine Curve */}
              {allMilestones.map((m, idx) => {
                const pos = nodePositions[idx] || { x: 90 + idx * NODE_SPACING, y: CENTER_Y, isCrest: idx % 2 === 0 };
                const isSelected = idx === clampedIndex;
                const isCrest = pos.isCrest;
                const langColor = LANGUAGE_COLORS[m.language] || '#38bdf8';

                return (
                  <div
                    key={m.id}
                    data-milestone-idx={idx}
                    onClick={() => {
                      setActiveIndex(idx);
                      setIsPlaying(false);
                    }}
                    style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    {/* Pulsing Concentric Aura on Active Node */}
                    {isSelected && (
                      <div
                        className="absolute inset-0 -m-3.5 rounded-full animate-ping opacity-70"
                        style={{ backgroundColor: langColor }}
                      />
                    )}

                    {/* Milestone Node Circle */}
                    <div
                      className={`rounded-full transition-all duration-300 flex items-center justify-center ${
                        isSelected
                          ? 'w-10 h-10 bg-ink border-2 border-white shadow-xl scale-115'
                          : 'w-7 h-7 bg-ink/95 border-2 hover:scale-125 hover:bg-ink'
                      }`}
                      style={{
                        borderColor: isSelected ? '#ffffff' : langColor,
                        boxShadow: isSelected ? `0 0 24px ${langColor}` : undefined,
                      }}
                    >
                      <span
                        className={`rounded-full transition-all ${
                          isSelected ? 'w-4 h-4' : 'w-2.5 h-2.5'
                        }`}
                        style={{ backgroundColor: isSelected ? '#ffffff' : langColor }}
                      />
                    </div>

                    {/* Alternating Labels: Above Crests, Below Troughs */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 pointer-events-none font-mono text-center transition-all whitespace-nowrap ${
                        isCrest ? '-top-12' : 'top-10'
                      }`}
                    >
                      <span
                        className={`text-[0.7rem] font-bold block transition-colors ${
                          isSelected ? 'text-bone font-black' : 'text-bone-dim/80 group-hover:text-bone'
                        }`}
                      >
                        {m.name.length > 17 ? `${m.name.substring(0, 15)}…` : m.name}
                      </span>
                      <span className="text-[0.62rem] text-muted block -mt-0.5">{m.monthYear}</span>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
        </div>

        {/* 3. Active Milestone Spotlight HUD */}
        {activeMilestone && (
          <div className="p-6 rounded-xl border border-ember/40 bg-ink/95 shadow-panel relative overflow-hidden space-y-4">
            
            {/* Top Accent Gradient */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(to right, ${
                  LANGUAGE_COLORS[activeMilestone.language] || '#f97316'
                }, transparent)`,
              }}
            />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-2">
                
                {/* Milestone Counter & Inception Date */}
                <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-ember/10 border border-ember/30 text-ember font-bold text-[0.7rem]">
                    Milestone #{clampedIndex + 1} of {allMilestones.length}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-surface border border-line text-bone font-medium text-[0.7rem]">
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    <span>{activeMilestone.formattedDate}</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-surface border border-line text-bone-dim text-[0.7rem] font-semibold">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: LANGUAGE_COLORS[activeMilestone.language] || '#38bdf8' }}
                    />
                    <span>{activeMilestone.language}</span>
                  </span>
                </div>

                {/* Project Title */}
                <h3 className="font-display text-2xl font-bold text-bone flex items-center gap-2">
                  <span>{activeMilestone.name}</span>
                  {activeMilestone.isFeatured && (
                    <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-ember/15 border border-ember text-ember">
                      Flagship
                    </span>
                  )}
                </h3>

                {/* Description */}
                <p className="text-bone-dim text-xs sm:text-sm font-mono max-w-3xl leading-relaxed">
                  {activeMilestone.description}
                </p>

                {/* Production Metrics & Tech Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-2 font-mono">
                  {activeMilestone.metrics && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{activeMilestone.metrics}</span>
                    </span>
                  )}

                  {(activeMilestone.tags || []).slice(0, 4).map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded bg-surface/50 border border-line/60 text-[0.7rem] text-muted">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex sm:flex-col items-stretch gap-2.5 font-mono text-xs shrink-0 self-start">
                <a
                  href={activeMilestone.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-ember text-ink font-bold hover:bg-ember/90 shadow-md shadow-ember/20 transition-all"
                >
                  <GitBranch className="w-4 h-4" />
                  <span>View Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {activeMilestone.liveUrl && (
                  <a
                    href={activeMilestone.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-surface border border-line hover:border-cyan-400 text-bone hover:text-cyan-400 transition-colors"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </ScrollReveal>
  );
}
