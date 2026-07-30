'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { GitCommit, FileCode, Layers, Maximize2, Sparkles, Clock, Sliders, ExternalLink, Code } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface LocRecord {
  file: string;
  line: number;
  type: string;
  commit: string;
  author: string;
  date: string;
  time: string;
  timezone: string;
  datetime: string;
  depth: number;
  length: number;
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
};

export default function CodebaseEvolutionSuite() {
  const [records, setRecords] = useState<LocRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null);

  // 1. DYNAMIC CSV PARSER: Fetch and parse /loc.csv live on mount
  useEffect(() => {
    async function loadLocCsv() {
      try {
        const res = await fetch('/loc.csv', { cache: 'no-store' });
        if (res.ok) {
          const text = await res.text();
          const lines = text.trim().split('\n');
          const parsedRows: LocRecord[] = lines.slice(1).map((l) => {
            const parts = l.split(',');
            return {
              file: parts[0] || 'file',
              line: Number(parts[1] || 0),
              type: parts[2] || 'code',
              commit: parts[3] || 'head',
              author: parts[4] || 'Developer',
              date: parts[5] || '2025-01-01',
              time: parts[6] || '12:00:00',
              timezone: parts[7] || '-08:00',
              datetime: parts[8] || '',
              depth: Number(parts[9] || 0),
              length: Number(parts[10] || 0),
            };
          });

          setRecords(parsedRows);
        }
      } catch (err) {
        console.error('Dynamic loc.csv fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadLocCsv();
  }, []);

  // 2. DYNAMIC COMMIT AGGREGATOR: Group rows by commit hash
  const commitList = useMemo<CommitMeta[]>(() => {
    if (records.length === 0) return [];

    const commitMap = new Map<string, {
      author: string;
      date: string;
      time: string;
      datetime: string;
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
          lines: 0,
          files: new Set(),
        });
      }
      const item = commitMap.get(r.commit)!;
      item.lines += 1;
      item.files.add(r.file);
    });

    const messages: Record<string, string> = {
      'f189fd9d': 'refactored codebase structure and updated styles',
      'c6478c7f': 'my first commit, and it was glorious',
      'ba48eace': 'another glorious commit with expanded components',
      '74746bc0': 'initial site layout and core assets setup',
    };

    return Array.from(commitMap.entries()).map(([commit, data]) => ({
      commit,
      author: data.author,
      date: data.date,
      time: data.time,
      datetime: data.datetime,
      linesEdited: data.lines,
      filesEdited: data.files.size,
      message: messages[commit] || `codebase update (${data.files.size} files edited)`,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [records]);

  useEffect(() => {
    if (commitList.length > 0) {
      setSliderIndex(commitList.length - 1);
    }
  }, [commitList]);

  // 3. DYNAMIC METRICS: Computed dynamically from loc.csv records
  const filteredCommits = useMemo(() => {
    return commitList.slice(0, sliderIndex + 1);
  }, [commitList, sliderIndex]);

  const activeCommitHashes = useMemo(() => {
    return new Set(filteredCommits.map((c) => c.commit));
  }, [filteredCommits]);

  const activeRecords = useMemo(() => {
    if (activeCommitHashes.size === 0) return records;
    return records.filter((r) => activeCommitHashes.has(r.commit));
  }, [records, activeCommitHashes]);

  const totalLoc = activeRecords.length;

  const uniqueFiles = useMemo(() => {
    return [...new Set(activeRecords.map((r) => r.file))];
  }, [activeRecords]);

  const maxDepth = useMemo(() => {
    if (activeRecords.length === 0) return 0;
    return Math.max(...activeRecords.map((r) => r.depth));
  }, [activeRecords]);

  const longestLine = useMemo(() => {
    if (activeRecords.length === 0) return 0;
    return Math.max(...activeRecords.map((r) => r.length));
  }, [activeRecords]);

  const fileLocCounts = useMemo(() => {
    const counts: Record<string, { loc: number; type: string }> = {};
    activeRecords.forEach((r) => {
      if (!counts[r.file]) {
        counts[r.file] = { loc: 0, type: r.type };
      }
      counts[r.file].loc += 1;
    });
    return Object.entries(counts).sort((a, b) => b[1].loc - a[1].loc);
  }, [activeRecords]);

  const maxLinesInfo = useMemo(() => {
    if (fileLocCounts.length === 0) return { file: 'none', loc: 0 };
    return { file: fileLocCounts[0][0], loc: fileLocCounts[0][1].loc };
  }, [fileLocCounts]);

  // 4. DYNAMIC LANGUAGE SHARE: Computed dynamically per file type
  const languageShare = useMemo(() => {
    const counts: Record<string, number> = {};
    activeRecords.forEach((r) => {
      counts[r.type] = (counts[r.type] || 0) + 1;
    });

    return Object.entries(counts).map(([type, count]) => ({
      type,
      loc: count,
      color: TYPE_COLORS[type] || '#f97316',
      percent: totalLoc > 0 ? Math.round((count / totalLoc) * 100) : 0,
    })).sort((a, b) => b.loc - a.loc);
  }, [activeRecords, totalLoc]);

  const currentCommit = commitList[sliderIndex] || commitList[0];

  if (loading) {
    return (
      <div className="p-8 rounded-xl border border-line bg-surface font-mono text-xs text-muted text-center flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-ember animate-ping" />
        <span>Parsing live loc.csv codebase telemetry...</span>
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
                  Live Codebase Telemetry (Dynamic loc.csv)
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
                  value={sliderIndex}
                  onChange={(e) => setSliderIndex(parseInt(e.target.value))}
                  className="w-32 accent-ember cursor-pointer"
                />
                <span className="text-ember font-bold px-2 py-0.5 rounded bg-ember/10 border border-ember/30">
                  {currentCommit?.date || '2025-01-01'}
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
              <span className="text-[0.65rem] text-muted uppercase tracking-wider block mb-1">LONGEST LINE</span>
              <span className="font-display text-2xl font-bold text-bone">{longestLine}</span>
              <span className="text-[0.65rem] text-amber-400 block mt-0.5">characters</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/80 border border-line">
              <span className="text-[0.65rem] text-muted uppercase tracking-wider block mb-1">MAX LINES</span>
              <span className="font-display text-2xl font-bold text-bone">{maxLinesInfo.loc}</span>
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
          <h3 className="font-display text-lg font-bold text-bone mb-6 flex items-center gap-2 border-b border-line pb-4">
            <Clock className="w-4.5 h-4.5 text-ember" />
            <span>Commits by Time of Day & Interactive Scrollytelling</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Dynamic Scrollytelling Feed */}
            <div className="lg:col-span-6 space-y-3 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar font-mono text-xs">
              {filteredCommits.map((c) => {
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
            <div className="lg:col-span-6 p-6 rounded-lg bg-ink border border-line space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span>Time of Day Scatterplot (24h vs Date)</span>
                <span className="text-ember">● Circle Size = Lines Changed</span>
              </div>

              {/* Scatterplot Grid */}
              <div className="h-64 border-l border-b border-line/80 relative flex items-end justify-between p-4">
                {/* Horizontal Y-Axis Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[0.6rem] font-mono text-muted/40">
                  <div className="border-b border-line/20 w-full pt-1">24:00</div>
                  <div className="border-b border-line/20 w-full">18:00</div>
                  <div className="border-b border-line/20 w-full">12:00</div>
                  <div className="border-b border-line/20 w-full">06:00</div>
                  <div className="border-b border-line/20 w-full pb-1">00:00</div>
                </div>

                {/* Plot Commit Bubbles */}
                {filteredCommits.map((c, i) => {
                  const parts = c.time.split(':').map(Number);
                  const timeInHours = (parts[0] || 12) + (parts[1] || 0) / 60;
                  const yPercent = (timeInHours / 24) * 100;
                  const xPercent = (i / (filteredCommits.length - 1 || 1)) * 90 + 5;
                  const sizePx = Math.max(14, Math.min(38, Math.round(c.linesEdited / 20)));
                  const isSelected = selectedCommit === c.commit;

                  return (
                    <div
                      key={c.commit}
                      onClick={() => setSelectedCommit(c.commit)}
                      title={`${c.message} (${c.date} ${c.time}) - ${c.linesEdited} lines`}
                      className={`absolute rounded-full transition-all duration-300 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-mono text-[0.6rem] font-bold ${
                        isSelected
                          ? 'bg-ember text-ink ring-4 ring-ember/40 z-30 scale-125'
                          : 'bg-rose-500/70 hover:bg-rose-400 text-bone border border-rose-300 shadow-md hover:scale-110'
                      }`}
                      style={{
                        left: `${xPercent}%`,
                        bottom: `${yPercent}%`,
                        width: `${sizePx}px`,
                        height: `${sizePx}px`,
                      }}
                    >
                      {c.commit.substring(0, 3)}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[0.68rem] font-mono text-muted">
                <span>Earliest Commit ({commitList[0]?.date})</span>
                <span>Latest Commit ({currentCommit?.date})</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 3. Codebase Evolution: Dynamic Dot Matrix & Language Share Breakdown */}
      <ScrollReveal direction="up" delay={0.25}>
        <div className="rounded-xl border border-line bg-surface p-6 shadow-panel">
          <h3 className="font-display text-lg font-bold text-bone mb-6 flex items-center gap-2 border-b border-line pb-4">
            <Layers className="w-4.5 h-4.5 text-cyan-400" />
            <span>Codebase Evolution & File Matrix</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: File Dot Grid Unit Matrix */}
            <div className="lg:col-span-7 p-6 rounded-lg bg-ink border border-line space-y-6">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-bone font-semibold">Visual Lines of Code Grid (Unit Dot Matrix)</span>
                <span className="text-muted">1 dot ≈ 20 LOC</span>
              </div>

              <div className="space-y-4 font-mono text-xs max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {fileLocCounts.map(([file, info]) => {
                  const dotsCount = Math.max(3, Math.round(info.loc / 20));
                  const fileColor = TYPE_COLORS[info.type] || '#f97316';
                  return (
                    <div key={file} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[0.72rem]">
                        <span className="text-bone font-medium flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: fileColor }}
                          />
                          {file}
                        </span>
                        <span className="text-muted">{info.loc} lines</span>
                      </div>

                      {/* Dynamic Dot Grid */}
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: dotsCount }).map((_, dIdx) => (
                          <span
                            key={dIdx}
                            className="w-2.5 h-2.5 rounded-full transition-transform hover:scale-125 cursor-pointer shadow-sm"
                            style={{ backgroundColor: fileColor }}
                            title={`${file}: ~20 LOC`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Codebase File Type Percentages */}
            <div className="lg:col-span-5 p-6 rounded-lg bg-ink border border-line space-y-6 font-mono text-xs">
              <h4 className="text-bone font-bold text-sm border-b border-line pb-3">
                File Breakdown by Type
              </h4>

              <div className="space-y-4">
                {languageShare.map((lang) => (
                  <div key={lang.type} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-bone font-semibold uppercase">{lang.type}</span>
                      <span className="text-bone font-bold">
                        {lang.loc.toLocaleString()} lines ({lang.percent}%)
                      </span>
                    </div>

                    {/* Dynamic Progress Bar */}
                    <div className="w-full h-3 rounded-full bg-surface border border-line overflow-hidden p-0.5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${lang.percent}%`,
                          backgroundColor: lang.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-line/60 text-muted text-[0.68rem] leading-relaxed">
                <p>
                  * Codebase metrics are parsed dynamically from <code>loc.csv</code> ({totalLoc.toLocaleString()} lines across {uniqueFiles.length} files).
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
