'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { GitCommit, FileCode, Sparkles, Clock, Sliders, ExternalLink, Code, ArrowUpDown } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import locStaticRecords from '@/data/loc-static.json';

interface LocRecord {
  file: string;
  added: number;
  deleted: number;
  type: string;
  commit: string;
  author: string;
  date: string;
  time: string;
  timezone: string;
  datetime: string;
  depth: number;
  message: string;
}

interface CommitMeta {
  commit: string;
  author: string;
  date: string;
  time: string;
  datetime: string;
  linesEdited: number;
  added: number;
  deleted: number;
  filesEdited: number;
  message: string;
}

const TYPE_COLORS: Record<string, string> = {
  css: '#563d7c',
  html: '#e34c26',
  js: '#f1e05a',
  ts: '#3178c6',
  tsx: '#2b7489',
  json: '#292929',
  md: '#083fa1',
  mjs: '#f1e05a',
  yml: '#cb171e',
  yaml: '#cb171e',
};

// Robust CSV Line Parser (handles quotes and embedded commas)
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export default function CodebaseEvolutionSuite() {
  // Synchronous initial state from prebuilt static build JSON
  const [records, setRecords] = useState<LocRecord[]>(locStaticRecords as LocRecord[]);
  // sliderIndex === null means "Show ALL commits" (default max position)
  const [sliderIndex, setSliderIndex] = useState<number | null>(null);
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [hoveredCommit, setHoveredCommit] = useState<CommitMeta | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // 'asc' = Chronological (oldest first)

  // Client-side hydration: optional live update from /loc.csv if more recent rows exist
  useEffect(() => {
    async function loadLocCsv() {
      try {
        const res = await fetch('/loc.csv', { cache: 'no-store' });
        if (res.ok) {
          const text = await res.text();
          const lines = text.trim().split('\n');
          if (lines.length < 2) return;

          const parsedRows: LocRecord[] = lines.slice(1).map((line) => {
            const parts = parseCsvLine(line);
            return {
              file: parts[0] || 'file',
              added: parseInt(parts[1], 10) || 0,
              deleted: parseInt(parts[2], 10) || 0,
              type: parts[3] || 'code',
              commit: parts[4] || 'head',
              author: parts[5] || 'Developer',
              date: parts[6] || '2025-01-11',
              time: parts[7] || '12:00:00',
              timezone: parts[8] || '-08:00',
              datetime: parts[9] || parts[6] || '2025-01-11T12:00:00Z',
              depth: parseInt(parts[10], 10) || 0,
              message: (parts[11] || 'codebase update').replace(/^"|"$/g, ''),
            };
          });

          // Safeguard: only update if live fetch is at least as complete as static fallback
          if (parsedRows.length >= (locStaticRecords as LocRecord[]).length) {
            setRecords(parsedRows);
          }
        }
      } catch (err) {
        console.error('Dynamic loc.csv fetch error:', err);
      }
    }

    loadLocCsv();
  }, []);

  // 1. DYNAMIC COMMIT AGGREGATOR: Group rows by commit hash & sort CHRONOLOGICALLY (oldest to newest)
  const commitList = useMemo<CommitMeta[]>(() => {
    if (records.length === 0) return [];

    const commitMap = new Map<string, {
      author: string;
      date: string;
      time: string;
      datetime: string;
      message: string;
      added: number;
      deleted: number;
      lines: number;
      files: Set<string>;
    }>();

    records.forEach((r) => {
      if (!commitMap.has(r.commit)) {
        commitMap.set(r.commit, {
          author: r.author,
          date: r.date,
          time: r.time,
          datetime: r.datetime,
          message: r.message,
          added: 0,
          deleted: 0,
          lines: 0,
          files: new Set<string>(),
        });
      }
      const item = commitMap.get(r.commit)!;
      item.added += (r.added || 0);
      item.deleted += (r.deleted || 0);
      item.lines += ((r.added || 0) + (r.deleted || 0));
      item.files.add(r.file);
    });

    return Array.from(commitMap.entries())
      .map(([commit, data]) => ({
        commit,
        author: data.author,
        date: data.date,
        time: data.time,
        datetime: data.datetime,
        linesEdited: data.lines,
        added: data.added,
        deleted: data.deleted,
        filesEdited: data.files.size,
        message: data.message || `codebase update (${data.files.size} files edited)`,
      }))
      .filter((c) => {
        const authorLower = c.author.toLowerCase();
        const msgLower = c.message.toLowerCase();
        const isBot = authorLower.includes('github-actions') || authorLower.includes('bot');
        const isWorkflowMsg = msgLower.includes('[skip ci]') || msgLower.includes('chore: update loc.csv');
        return !isBot && !isWorkflowMsg;
      })
      // Sort strictly chronologically from oldest (Jan 2025) to newest (today)
      .sort((a, b) => new Date(a.datetime || a.date).getTime() - new Date(b.datetime || b.date).getTime());
  }, [records]);

  // Resolve effective active index (defaults to max index = newest commit)
  const activeIndex = useMemo(() => {
    if (commitList.length === 0) return 0;
    if (sliderIndex === null || sliderIndex < 0 || sliderIndex >= commitList.length) {
      return commitList.length - 1;
    }
    return sliderIndex;
  }, [commitList, sliderIndex]);

  // 2. DYNAMIC METRICS: Computed dynamically from filtered active commits
  const filteredCommits = useMemo(() => {
    if (commitList.length === 0) return [];
    return commitList.slice(0, activeIndex + 1);
  }, [commitList, activeIndex]);

  const activeCommitHashes = useMemo(() => {
    return new Set(filteredCommits.map((c) => c.commit));
  }, [filteredCommits]);

  const activeRecords = useMemo(() => {
    if (activeCommitHashes.size === 0) return records;
    return records.filter((r) => activeCommitHashes.has(r.commit));
  }, [records, activeCommitHashes]);

  // Dynamic stat metrics
  const totalLoc = useMemo(() => {
    return activeRecords.reduce((sum, r) => sum + (r.added || 0), 0);
  }, [activeRecords]);

  const totalDeletedLoc = useMemo(() => {
    return activeRecords.reduce((sum, r) => sum + (r.deleted || 0), 0);
  }, [activeRecords]);

  const uniqueFiles = useMemo(() => {
    return [...new Set(activeRecords.map((r) => r.file))];
  }, [activeRecords]);

  const maxDepth = useMemo(() => {
    if (activeRecords.length === 0) return 0;
    const depths = activeRecords.map((r) => r.depth).filter((d) => !isNaN(d));
    return depths.length > 0 ? Math.max(...depths) : 0;
  }, [activeRecords]);

  const fileLocCounts = useMemo(() => {
    const counts: Record<string, { loc: number; type: string }> = {};
    activeRecords.forEach((r) => {
      if (!counts[r.file]) counts[r.file] = { loc: 0, type: r.type };
      counts[r.file].loc += (r.added || 0);
    });
    return Object.entries(counts).sort((a, b) => b[1].loc - a[1].loc);
  }, [activeRecords]);

  const maxLinesInfo = useMemo(() => {
    if (fileLocCounts.length === 0) return { file: 'none', loc: 0 };
    return { file: fileLocCounts[0][0], loc: fileLocCounts[0][1].loc };
  }, [fileLocCounts]);

  // Display commits in feed according to selected sort order (Chronological vs Reverse)
  const displayCommits = useMemo(() => {
    if (sortOrder === 'desc') {
      return [...filteredCommits].reverse();
    }
    return filteredCommits;
  }, [filteredCommits, sortOrder]);

  const currentCommit = commitList[activeIndex] || commitList[commitList.length - 1];

  return (
    <div className="space-y-12">
      {/* 1. Dynamic Summary Stat Strip Cards */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="rounded-xl border border-line bg-surface p-6 shadow-panel">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-line pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-ember/10 border border-ember/30 text-ember">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider">
                  Complete Historical Telemetry (Jan 2025 – Present)
                </span>
                <h2 className="font-display text-xl font-bold text-bone">
                  Codebase Evolution & Analytics
                </h2>
              </div>
            </div>

            {/* Time Filter Slider */}
            {commitList.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 font-mono text-xs bg-ink/70 p-3 rounded-lg border border-line">
                <div className="flex items-center gap-2 text-bone-dim">
                  <Sliders className="w-3.5 h-3.5 text-ember" />
                  <span>Show commit until:</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={commitList.length - 1}
                  value={activeIndex}
                  onInput={(e) => setSliderIndex(parseInt(e.currentTarget.value, 10))}
                  onChange={(e) => setSliderIndex(parseInt(e.target.value, 10))}
                  className="w-36 accent-ember cursor-pointer touch-none z-10 py-1"
                />
                <span className="text-ember font-bold px-2 py-0.5 rounded bg-ember/10 border border-ember/30">
                  {currentCommit?.date || '2025-01-11'}
                </span>
              </div>
            )}
          </div>

          {/* Dynamic Stat Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 font-mono">
            <div className="p-4 rounded-lg bg-ink/80 border border-line">
              <span className="text-[0.65rem] text-muted uppercase tracking-wider block mb-1">COMMITS</span>
              <span className="font-display text-2xl font-bold text-bone">{filteredCommits.length}</span>
              <span className="text-[0.65rem] text-ember block mt-0.5">/ {commitList.length} total</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/80 border border-line">
              <span className="text-[0.65rem] text-muted uppercase tracking-wider block mb-1">FILES</span>
              <span className="font-display text-2xl font-bold text-bone">{uniqueFiles.length}</span>
              <span className="text-[0.65rem] text-cyan-400 block mt-0.5">tracked</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/80 border border-line">
              <span className="text-[0.65rem] text-muted uppercase tracking-wider block mb-1">TOTAL LOC</span>
              <span className="font-display text-2xl font-bold text-bone">{totalLoc.toLocaleString()}</span>
              <span className="text-[0.65rem] text-emerald-400 block mt-0.5">lines of code</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/80 border border-line">
              <span className="text-[0.65rem] text-muted uppercase tracking-wider block mb-1">MAX DEPTH</span>
              <span className="font-display text-2xl font-bold text-bone">{maxDepth}</span>
              <span className="text-[0.65rem] text-purple-400 block mt-0.5">folder depth</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/80 border border-line">
              <span className="text-[0.65rem] text-muted uppercase tracking-wider block mb-1">LINES DELETED</span>
              <span className="font-display text-2xl font-bold text-bone">{totalDeletedLoc.toLocaleString()}</span>
              <span className="text-[0.65rem] text-amber-400 block mt-0.5">total deleted</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/80 border border-line">
              <span className="text-[0.65rem] text-muted uppercase tracking-wider block mb-1">MAX LINES</span>
              <span className="font-display text-2xl font-bold text-bone">{maxLinesInfo.loc.toLocaleString()}</span>
              <span className="text-[0.65rem] text-indigo-400 block mt-0.5 truncate" title={maxLinesInfo.file}>
                in {maxLinesInfo.file.split('/').pop()}
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. Interactive Scrollytelling Feed & Time-of-Day Scatterplot */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="rounded-xl border border-line bg-surface p-6 shadow-panel space-y-6">
          
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-ember/10 border border-ember/30 text-ember">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-display text-lg font-bold text-bone">
                Commits by Time of Day &amp; Interactive Scrollytelling
              </h3>
            </div>

            {/* Sort Toggle Button */}
            <button
              onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-ink border border-line hover:border-ember/50 text-bone text-xs font-mono transition-colors self-start sm:self-auto"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-ember" />
              <span>
                Order: {sortOrder === 'asc' ? 'Chronological (Oldest First)' : 'Reverse (Newest First)'}
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Scrollytelling Commit Cards Feed */}
            <div className="lg:col-span-6 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar font-mono text-xs">
              {displayCommits.map((c) => {
                const isSelected = selectedCommit === c.commit;
                return (
                  <div
                    key={c.commit}
                    onClick={() => setSelectedCommit(isSelected ? null : c.commit)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-ember/10 border-ember text-bone shadow-md'
                        : 'bg-ink/80 border-line hover:border-ember/50 text-bone-dim'
                    }`}
                  >
                    <p className="leading-relaxed text-bone">
                      On <strong className="text-ember font-semibold">{c.date}</strong> at{' '}
                      <span className="text-indigo-400">{c.time}</span>, I made{' '}
                      <a
                        href={`https://github.com/ishaankor/my-data-science-portfolio/commit/${c.commit}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ember underline font-bold hover:text-ember/80 inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>{c.message}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      . I edited <span className="text-emerald-400 font-bold">{c.linesEdited.toLocaleString()} lines</span> ({c.added > 0 ? `+${c.added.toLocaleString()}` : '0'}{c.deleted > 0 ? ` / -${c.deleted.toLocaleString()}` : ''}) across{' '}
                      <span className="text-cyan-400 font-bold">{c.filesEdited} {c.filesEdited === 1 ? 'file' : 'files'}</span>.
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Time-of-Day Interactive Scatterplot */}
            <div className="lg:col-span-6 p-6 rounded-lg bg-ink border border-line space-y-4 relative">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-bone font-bold">Time of Day Scatterplot (24h vs Date)</span>
                <span className="text-muted text-[0.68rem] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Size = Lines Changed</span>
                </span>
              </div>

              {/* Scatterplot Canvas Grid */}
              <div className="h-72 border-l border-b border-line/80 relative flex items-end justify-between p-4 overflow-hidden rounded-bl-lg bg-surface/30">
                {/* Y-Axis Time Gridlines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[0.6rem] font-mono text-muted/50 p-2">
                  <div className="border-b border-line/30 w-full pt-1 flex items-center justify-between"><span>24:00</span></div>
                  <div className="border-b border-line/30 w-full flex items-center justify-between"><span>18:00</span></div>
                  <div className="border-b border-line/30 w-full flex items-center justify-between"><span>12:00</span></div>
                  <div className="border-b border-line/30 w-full flex items-center justify-between"><span>06:00</span></div>
                  <div className="border-b border-line/30 w-full pb-1 flex items-center justify-between"><span>00:00</span></div>
                </div>

                {/* Plot Commit Bubbles with bounded margins */}
                {filteredCommits.map((c, i) => {
                  const parts = (c.time || '12:00:00').split(':').map(Number);
                  const timeInHours = (parts[0] || 12) + (parts[1] || 0) / 60;
                  // Bounded Y percent between 10% and 88% so bubbles never overlap top header or bottom axis
                  const yPercent = 10 + (timeInHours / 24) * 78;
                  // Bounded X percent between 6% and 94%
                  const xPercent = (i / (filteredCommits.length - 1 || 1)) * 88 + 6;
                  // Logarithmic bubble size (min 8px, max 22px) to prevent gigantic overlapping bubbles
                  const sizePx = Math.max(8, Math.min(22, Math.round(Math.log2((c.linesEdited || 0) + 1) * 2.8)));
                  const isSelected = selectedCommit === c.commit;
                  const isHovered = hoveredCommit?.commit === c.commit;

                  return (
                    <div
                      key={c.commit}
                      onClick={() => setSelectedCommit(isSelected ? null : c.commit)}
                      onMouseEnter={() => setHoveredCommit(c)}
                      onMouseLeave={() => setHoveredCommit(null)}
                      className={`absolute rounded-full transition-all duration-200 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                        isSelected
                          ? 'bg-ember ring-4 ring-ember/50 z-30 scale-125 shadow-lg shadow-ember/50'
                          : isHovered
                          ? 'bg-cyan-400 ring-4 ring-cyan-400/40 z-20 scale-125 shadow-md shadow-cyan-500/30'
                          : 'bg-rose-500/75 hover:bg-rose-400 border border-rose-300/60 shadow-sm hover:scale-110'
                      }`}
                      style={{
                        left: `${xPercent}%`,
                        bottom: `${yPercent}%`,
                        width: `${sizePx}px`,
                        height: `${sizePx}px`,
                      }}
                    />
                  );
                })}

                {/* Floating Sleek Tooltip */}
                {hoveredCommit && (
                  <div className="absolute top-3 right-3 z-40 p-3 rounded-lg bg-surface/95 border border-ember/50 backdrop-blur-md shadow-lg text-[0.7rem] font-mono max-w-xs space-y-1 pointer-events-none transition-all">
                    <div className="flex items-center justify-between gap-2 text-bone font-semibold border-b border-line pb-1">
                      <span className="text-ember font-bold">#{hoveredCommit.commit.substring(0, 7)}</span>
                      <span className="text-muted">{hoveredCommit.date} {hoveredCommit.time}</span>
                    </div>
                    <p className="text-bone-dim truncate font-medium">{hoveredCommit.message}</p>
                    <div className="flex items-center gap-3 text-[0.65rem]">
                      <span className="text-emerald-400 font-bold">{hoveredCommit.linesEdited.toLocaleString()} lines ({hoveredCommit.added > 0 ? `+${hoveredCommit.added}` : '0'}{hoveredCommit.deleted > 0 ? ` / -${hoveredCommit.deleted}` : ''})</span>
                      <span className="text-cyan-400 font-bold">{hoveredCommit.filesEdited} {hoveredCommit.filesEdited === 1 ? 'file' : 'files'}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[0.68rem] font-mono text-muted pt-1">
                <span>Earliest ({commitList[0]?.date || '2025-01-11'})</span>
                <span>Latest ({commitList[commitList.length - 1]?.date || 'Today'})</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
