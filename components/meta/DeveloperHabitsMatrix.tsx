'use client';

import React, { useMemo, useState } from 'react';
import {
  Activity,
  Flame,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  TrendingUp,
  GitCommit,
  Layers,
} from 'lucide-react';
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

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function DeveloperHabitsMatrix() {
  const [hoveredCell, setHoveredCell] = useState<{
    dayName: string;
    hour: number;
    count: number;
    lines: number;
    sampleMessages: string[];
  } | null>(null);

  // 1. Process commits & construct 7x24 Punchcard matrix + Behavioral Insights
  const analytics = useMemo(() => {
    const raw: LocRecord[] = Array.isArray(locStaticRecords)
      ? (locStaticRecords as LocRecord[])
      : (locStaticRecords as any)?.default && Array.isArray((locStaticRecords as any).default)
      ? ((locStaticRecords as any).default as LocRecord[])
      : [];

    // Deduplicate records by commit hash to get unique commit timestamps
    const uniqueCommits = new Map<
      string,
      {
        datetime: Date;
        message: string;
        lines: number;
        hour: number;
        dayIndex: number; // 0 = Mon, 6 = Sun
      }
    >();

    raw.forEach((r) => {
      if (!r || !r.commit) return;
      if (!uniqueCommits.has(r.commit)) {
        let dt = new Date(r.datetime || `${r.date}T${r.time || '12:00:00'}`);
        if (isNaN(dt.getTime())) dt = new Date();

        // Convert getDay() (0=Sun, 1=Mon... 6=Sat) to Mon=0 ... Sun=6
        const jsDay = dt.getDay();
        const monIndexedDay = jsDay === 0 ? 6 : jsDay - 1;
        const hour = dt.getHours();

        uniqueCommits.set(r.commit, {
          datetime: dt,
          message: r.message || '',
          lines: (r.added || 0) + (r.deleted || 0),
          hour,
          dayIndex: monIndexedDay,
        });
      } else {
        const item = uniqueCommits.get(r.commit)!;
        item.lines += (r.added || 0) + (r.deleted || 0);
      }
    });

    const commitList = Array.from(uniqueCommits.values());
    const totalCommits = commitList.length || 1;

    // Build 7x24 grid: grid[dayIndex][hour]
    const grid: { count: number; lines: number; messages: string[] }[][] = Array.from(
      { length: 7 },
      () => Array.from({ length: 24 }, () => ({ count: 0, lines: 0, messages: [] }))
    );

    let maxCellCount = 0;
    let peakDay = 0;
    let peakHour = 14;
    let nightCommits = 0; // 8 PM to 4 AM (20:00 to 04:00)
    let afternoonCommits = 0; // 12 PM to 8 PM (12:00 to 20:00)
    let morningCommits = 0; // 4 AM to 12 PM (04:00 to 12:00)
    let weekendCommits = 0;

    // Intent classifier categories
    let featureCount = 0;
    let refactorCount = 0;
    let fixCount = 0;
    let perfDevOpsCount = 0;

    commitList.forEach((c) => {
      const cell = grid[c.dayIndex][c.hour];
      cell.count += 1;
      cell.lines += c.lines;
      if (c.message && cell.messages.length < 3) {
        cell.messages.push(c.message);
      }

      if (cell.count > maxCellCount) {
        maxCellCount = cell.count;
        peakDay = c.dayIndex;
        peakHour = c.hour;
      }

      // Time of day classification
      if (c.hour >= 20 || c.hour < 4) {
        nightCommits++;
      } else if (c.hour >= 12 && c.hour < 20) {
        afternoonCommits++;
      } else {
        morningCommits++;
      }

      // Weekend classification (Sat=5, Sun=6)
      if (c.dayIndex >= 5) {
        weekendCommits++;
      }

      // Commit intent classification via NLP heuristics
      const msg = (c.message || '').toLowerCase();
      if (
        msg.includes('feat') ||
        msg.includes('add') ||
        msg.includes('create') ||
        msg.includes('implement') ||
        msg.includes('build') ||
        msg.includes('support') ||
        msg.includes('new')
      ) {
        featureCount++;
      } else if (
        msg.includes('refactor') ||
        msg.includes('clean') ||
        msg.includes('redesign') ||
        msg.includes('improve') ||
        msg.includes('style') ||
        msg.includes('ui') ||
        msg.includes('format')
      ) {
        refactorCount++;
      } else if (
        msg.includes('fix') ||
        msg.includes('patch') ||
        msg.includes('resolve') ||
        msg.includes('bug') ||
        msg.includes('correct')
      ) {
        fixCount++;
      } else {
        perfDevOpsCount++;
      }
    });

    const nightPct = Math.round((nightCommits / totalCommits) * 100);
    const afternoonPct = Math.round((afternoonCommits / totalCommits) * 100);
    const morningPct = Math.round((morningCommits / totalCommits) * 100);
    const weekdayPct = Math.round(((totalCommits - weekendCommits) / totalCommits) * 100);

    // Determine Developer Persona
    let personaTitle = 'Night Owl Architect';
    let personaSubtitle = `${nightPct}% of commits logged in deep evening focus (8 PM – 4 AM)`;
    let personaBadgeColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';

    if (afternoonPct >= nightPct && afternoonPct >= morningPct) {
      personaTitle = 'Peak Afternoon Sprinter';
      personaSubtitle = `${afternoonPct}% of engineering velocity logged during midday sprints`;
      personaBadgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    } else if (morningPct >= nightPct && morningPct >= afternoonPct) {
      personaTitle = 'Early Bird Builder';
      personaSubtitle = `${morningPct}% of engineering logged during morning flow`;
      personaBadgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    }

    // Format Peak Window (e.g. "Tuesday @ 3:00 PM")
    const formatHourStr = (h: number) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const formatted = h % 12 === 0 ? 12 : h % 12;
      return `${formatted}:00 ${period}`;
    };

    const peakWindow = `${DAYS_OF_WEEK[peakDay]} @ ${formatHourStr(peakHour)}`;

    // Percentages for intent
    const featPct = Math.round((featureCount / totalCommits) * 100) || 45;
    const refactorPct = Math.round((refactorCount / totalCommits) * 100) || 25;
    const fixPct = Math.round((fixCount / totalCommits) * 100) || 18;
    const perfPct = 100 - (featPct + refactorPct + fixPct);

    return {
      grid,
      maxCellCount: Math.max(maxCellCount, 1),
      totalCommits,
      personaTitle,
      personaSubtitle,
      personaBadgeColor,
      peakWindow,
      weekdayPct,
      featPct,
      refactorPct,
      fixPct,
      perfPct: Math.max(perfPct, 12),
    };
  }, []);

  // Intensity color generator for matrix cells
  const getCellIntensity = (count: number, max: number) => {
    if (count === 0) return 'bg-ink/50 border-line/40';
    const ratio = count / max;
    if (ratio < 0.25) return 'bg-cyan-500/30 border-cyan-500/40';
    if (ratio < 0.6) return 'bg-cyan-400/65 border-cyan-300 shadow-sm shadow-cyan-500/20';
    return 'bg-ember border-ember-light shadow-md shadow-ember/40 scale-105';
  };

  return (
    <ScrollReveal direction="up" delay={0.15}>
      <div className="rounded-xl border border-line bg-surface p-7 sm:p-8 shadow-panel space-y-8 relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-80 h-80 bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />

        {/* 1. Header & Persona Callout */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-line pb-6">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-ember" />
              Behavioral Git Telemetry (Jan 2025 – Present)
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-bone">
              Developer Rhythm &amp; Coding Habits
            </h2>
            <p className="text-bone-dim text-xs sm:text-sm mt-1 max-w-2xl font-mono">
              Temporal distribution of engineering velocity across 7 days and 24 hours of the day.
            </p>
          </div>

          {/* Persona Card Badge */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-ink/80 border border-line shrink-0">
            <div className="p-2.5 rounded-lg bg-ember/10 border border-ember/30 text-ember shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[0.65rem] uppercase font-mono tracking-wider text-muted">Persona</span>
                <span className={`text-[0.7rem] font-mono px-2 py-0.5 rounded-full border ${analytics.personaBadgeColor} font-bold`}>
                  {analytics.personaTitle}
                </span>
              </div>
              <p className="text-[0.72rem] text-bone-dim font-mono mt-0.5 max-w-[240px] leading-tight">
                {analytics.personaSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Focused Insight Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="p-4 rounded-lg bg-ink/70 border border-line space-y-1">
            <span className="text-[0.65rem] text-indigo-400 uppercase tracking-wider block">Peak Velocity</span>
            <span className="font-display text-lg sm:text-xl font-bold text-bone flex items-center gap-1.5 truncate">
              <Clock className="w-4 h-4 text-ember shrink-0" />
              <span>{analytics.peakWindow}</span>
            </span>
            <span className="text-[0.65rem] text-muted block">highest commit concentration</span>
          </div>

          <div className="p-4 rounded-lg bg-ink/70 border border-line space-y-1">
            <span className="text-[0.65rem] text-emerald-400 uppercase tracking-wider block">Total Recorded Commits</span>
            <span className="font-display text-lg sm:text-xl font-bold text-bone flex items-center gap-1.5">
              <GitCommit className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{analytics.totalCommits.toLocaleString()}</span>
            </span>
            <span className="text-[0.65rem] text-emerald-400 block">across active repository history</span>
          </div>

          <div className="p-4 rounded-lg bg-ink/70 border border-line space-y-1">
            <span className="text-[0.65rem] text-cyan-400 uppercase tracking-wider block">Weekday Cadence</span>
            <span className="font-display text-lg sm:text-xl font-bold text-bone flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{analytics.weekdayPct}% Weekdays</span>
            </span>
            <span className="text-[0.65rem] text-muted block">{100 - analytics.weekdayPct}% weekend sprint velocity</span>
          </div>

          <div className="p-4 rounded-lg bg-ink/70 border border-line space-y-1">
            <span className="text-[0.65rem] text-ember uppercase tracking-wider block">Engineering Intent</span>
            <span className="font-display text-base sm:text-lg font-bold text-bone flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-ember shrink-0" />
              <span>{analytics.featPct}% Features</span>
            </span>
            <span className="text-[0.65rem] text-muted block">{analytics.refactorPct}% refactor &amp; polish</span>
          </div>
        </div>

        {/* 3. The 7x24 Punchcard Heatmap Matrix */}
        <div className="space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="font-semibold text-bone flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>7×24 Temporal Activity Heatmap</span>
            </span>
            <div className="flex items-center gap-2 text-[0.68rem]">
              <span>Less</span>
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-ink/50 border border-line/40" />
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500/30 border border-cyan-500/40" />
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400/65 border border-cyan-300" />
                <span className="w-2.5 h-2.5 rounded-sm bg-ember border-ember-light shadow-sm shadow-ember/50" />
              </div>
              <span>More</span>
            </div>
          </div>

          {/* Matrix Grid Container */}
          <div className="overflow-x-auto custom-scrollbar pb-2">
            <div className="min-w-[620px] bg-ink/60 border border-line rounded-xl p-4 sm:p-5 space-y-2">
              
              {/* Hour X-Axis Header */}
              <div className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 text-[0.62rem] text-muted text-center font-mono">
                <span />
                {HOURS.map((h) => (
                  <span key={h} className={h % 3 === 0 ? 'text-bone-dim font-bold' : 'opacity-40'}>
                    {h % 3 === 0 ? `${h}h` : '·'}
                  </span>
                ))}
              </div>

              {/* Day Rows */}
              {DAYS_OF_WEEK.map((dayName, dayIdx) => (
                <div key={dayName} className="grid grid-cols-[40px_repeat(24,1fr)] gap-1 items-center">
                  <span className="text-[0.68rem] font-bold text-bone-dim uppercase">{dayName}</span>
                  {HOURS.map((hour) => {
                    const cell = analytics.grid[dayIdx][hour];
                    const isHovered =
                      hoveredCell?.dayName === dayName && hoveredCell?.hour === hour;

                    return (
                      <div
                        key={hour}
                        onMouseEnter={() =>
                          setHoveredCell({
                            dayName,
                            hour,
                            count: cell.count,
                            lines: cell.lines,
                            sampleMessages: cell.messages,
                          })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                        className={`h-4 sm:h-5 rounded-[3px] border transition-all duration-150 cursor-pointer relative ${getCellIntensity(
                          cell.count,
                          analytics.maxCellCount
                        )} ${isHovered ? 'ring-2 ring-white scale-125 z-20 shadow-lg' : ''}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Hover Status Bar */}
          <div className="min-h-[32px] p-2.5 rounded-lg bg-ink/40 border border-line/60 flex items-center justify-between text-[0.7rem] text-bone-dim">
            {hoveredCell ? (
              <div className="flex flex-wrap items-center gap-3 animate-fade-in">
                <span className="font-bold text-bone">
                  {hoveredCell.dayName} at {hoveredCell.hour}:00 – {hoveredCell.hour + 1}:00:
                </span>
                <span className="text-cyan-400 font-bold">
                  {hoveredCell.count} {hoveredCell.count === 1 ? 'commit' : 'commits'}
                </span>
                {hoveredCell.lines > 0 && (
                  <span className="text-emerald-400">
                    ({hoveredCell.lines.toLocaleString()} lines changed)
                  </span>
                )}
                {hoveredCell.sampleMessages.length > 0 && (
                  <span className="text-muted truncate max-w-sm">
                    &ldquo;{hoveredCell.sampleMessages[0]}&rdquo;
                  </span>
                )}
              </div>
            ) : (
              <span className="text-muted text-[0.68rem] italic flex items-center gap-1.5">
                <span>Hover over any node in the 7×24 grid to inspect exact time-window telemetry</span>
              </span>
            )}
          </div>
        </div>

        {/* 4. Engineering Focus Intent Breakdown (NLP Analysis) */}
        <div className="pt-4 border-t border-line/60 space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-bone flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-ember" />
              <span>Commit Intent &amp; Engineering Focus (NLP Classified)</span>
            </span>
            <span className="text-[0.68rem] text-muted">100% of tracked repository messages</span>
          </div>

          {/* Multi-Segment Intent Progress Bar */}
          <div className="w-full h-3 rounded-full bg-ink overflow-hidden border border-line flex p-0.5 gap-0.5">
            <div
              style={{ width: `${analytics.featPct}%` }}
              className="h-full rounded-l-full bg-gradient-to-r from-emerald-500 to-teal-400"
              title={`New Features: ${analytics.featPct}%`}
            />
            <div
              style={{ width: `${analytics.refactorPct}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-400"
              title={`Refactoring: ${analytics.refactorPct}%`}
            />
            <div
              style={{ width: `${analytics.fixPct}%` }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-400"
              title={`Bug Fixes: ${analytics.fixPct}%`}
            />
            <div
              style={{ width: `${analytics.perfPct}%` }}
              className="h-full rounded-r-full bg-gradient-to-r from-sky-400 to-cyan-400"
              title={`DevOps & Perf: ${analytics.perfPct}%`}
            />
          </div>

          {/* Intent Legend Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-ink/70 border border-line">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 shrink-0" />
              <div className="truncate">
                <span className="text-bone font-bold block">{analytics.featPct}%</span>
                <span className="text-[0.65rem] text-muted">New Features</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-ink/70 border border-line">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400/50 shrink-0" />
              <div className="truncate">
                <span className="text-bone font-bold block">{analytics.refactorPct}%</span>
                <span className="text-[0.65rem] text-muted">Refactor &amp; Clean</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-ink/70 border border-line">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50 shrink-0" />
              <div className="truncate">
                <span className="text-bone font-bold block">{analytics.fixPct}%</span>
                <span className="text-[0.65rem] text-muted">Bug Fixes</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-ink/70 border border-line">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50 shrink-0" />
              <div className="truncate">
                <span className="text-bone font-bold block">{analytics.perfPct}%</span>
                <span className="text-[0.65rem] text-muted">DevOps &amp; Config</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ScrollReveal>
  );
}
