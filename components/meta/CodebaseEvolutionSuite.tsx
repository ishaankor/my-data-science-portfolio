'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { GitCommit, FileCode, Layers, Maximize2, Sparkles, Clock, Sliders, ExternalLink, Code, ArrowUpDown } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

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

import locStaticRecords from '@/data/loc-static.json';

export default function CodebaseEvolutionSuite() {
  const [records, setRecords] = useState<LocRecord[]>(locStaticRecords as LocRecord[]);
  const [loading, setLoading] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(-1);
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);
  const [hoveredCommit, setHoveredCommit] = useState<CommitMeta | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // 'asc' = Chronological (oldest first)

  // 1. DYNAMIC CSV PARSER: Fetch and parse /loc.csv live on mount
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

          // Only update state if live fetch parsed rows are as comprehensive as prebuilt static fallback
          if (parsedRows.length >= (locStaticRecords as LocRecord[]).length) {
            setRecords(parsedRows);
          }
        }
      } catch (err) {
        console.error('Dynamic loc.csv fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLocCsv();
  }, []);

  // 2. DYNAMIC COMMIT AGGREGATOR: Group rows by commit hash & sort CHRONOLOGICALLY (oldest to newest)
  const commitList = useMemo<CommitMeta[]>(() => {
    if (records.length === 0) return [];

    const commitMap = new Map<string, {
      author: string;
      date: string;
      time: string;
      datetime: string;
      message: string;
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
          lines: 0,
          files: new Set<string>(),
        });
      }
      const item = commitMap.get(r.commit)!;
      item.lines += (r.added + r.deleted);
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
      // Strictly sort chronologically from oldest (Jan 2025) to newest (today)
      .sort((a, b) => new Date(a.datetime || a.date).getTime() - new Date(b.datetime || b.date).getTime());
  }, [records]);

  // Set default slider index to newest commit when loaded
  useEffect(() => {
    if (commitList.length > 0 && (sliderIndex === -1 || sliderIndex >= commitList.length)) {
      setSliderIndex(commitList.length - 1);
    }
  }, [commitList.length, sliderIndex]);

  const effectiveIndex =
    sliderIndex < 0 || sliderIndex >= commitList.length ? Math.max(0, commitList.length - 1) : sliderIndex;

  // 3. DYNAMIC METRICS: Computed dynamically from filtered commits
  const filteredCommits = useMemo(() => {
    return commitList.slice(0, effectiveIndex + 1);
  }, [commitList, effectiveIndex]);

  const activeCommitHashes = useMemo(() => {
    return new Set(filteredCommits.map((c) => c.commit));
  }, [filteredCommits]);

  const activeRecords = useMemo(() => {
    if (activeCommitHashes.size === 0) return records;
    return records.filter((r) => activeCommitHashes.has(r.commit));
  }, [records, activeCommitHashes]);

  // Total LOC = sum of all real added lines across active commits
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

  // 4. DYNAMIC LANGUAGE SHARE: weighted by actual lines added
  const languageShare = useMemo(() => {
    const counts: Record<string, number> = {};
    activeRecords.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + (r.added || 0);
    });

    return Object.entries(counts).map(([type, count]) => ({
      type,
      loc: count,
      color: TYPE_COLORS[type] || '#f97316',
      percent: totalLoc > 0 ? Math.round((count / totalLoc) * 100) : 0,
    })).sort((a, b) => b.loc - a.loc);
  }, [activeRecords, totalLoc]);

  // Display commits in feed according to selected sort order (Chronological vs Reverse)
  const displayCommits = useMemo(() => {
    if (sortOrder === 'desc') {
      return [...filteredCommits].reverse();
    }
    return filteredCommits;
  }, [filteredCommits, sortOrder]);

  const currentCommit = commitList[effectiveIndex] || commitList[commitList.length - 1];

  if (loading) {
    return (
      <div className="p-8 rounded-xl border border-line bg-surface font-mono text-xs text-muted text-center flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-ember animate-ping" />
        <span>Parsing complete historical loc.csv telemetry...</span>
      </div>
    );
  }

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
                  value={effectiveIndex}
                  onChange={(e) => setSliderIndex(parseInt(e.target.value, 10))}
                  className="w-32 accent-ember cursor-pointer"
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
                in {maxLinesInfo.file}
              </span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. Commits by Time of Day: Interactive Scatterplot & Scrollytelling Feed */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="rounded-xl border border-line bg-surface p-6 shadow-panel">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-line pb-4">
            <h3 className="font-display text-lg font-bold text-bone flex items-center gap-2">
              <Clock className="w-4.5 h-4.5 text-ember" />
              <span>Commits by Time of Day & Interactive Scrollytelling</span>
            </h3>

            {/* Sort Order Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="inline-flex items-center gap-2 font-mono text-xs text-bone-dim hover:text-ember bg-ink/80 px-3 py-1.5 rounded-lg border border-line hover:border-ember/50 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-ember" />
              <span>Order: {sortOrder === 'asc' ? 'Chronological (Oldest First)' : 'Newest First'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Dynamic Scrollytelling Feed */}
            <div className="lg:col-span-6 space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar font-mono text-xs">
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
                      . I edited <span className="text-emerald-400 font-bold">{c.linesEdited} lines</span> across{' '}
                      <span className="text-cyan-400 font-bold">{c.filesEdited} files</span>.
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right: Time-of-Day Interactive Scatterplot */}
            <div className="lg:col-span-6 p-6 rounded-lg bg-ink border border-line space-y-4 relative">
              <div className="flex items-center justify-between text-xs font-mono text-muted border-b border-line/40 pb-2">
                <span className="font-semibold text-bone">Time of Day Scatterplot (24h vs Date)</span>
                <span className="text-ember">● Size = Lines Changed</span>
              </div>

              {/* Scatterplot Grid Box with bounded height and overflow-hidden */}
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
                      <span className="text-emerald-400 font-bold">{hoveredCommit.linesEdited} lines edited</span>
                      <span className="text-cyan-400 font-bold">{hoveredCommit.filesEdited} files</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-[0.68rem] font-mono text-muted pt-1">
                <span>Earliest ({commitList[0]?.date || '2025-01-11'})</span>
                <span>Latest ({currentCommit?.date || 'Today'})</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
