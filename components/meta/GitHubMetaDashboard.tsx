'use client';

import React, { useState, useMemo } from 'react';
import { portfolioData } from '@/data/portfolio';
import { useGitHubData } from '@/hooks/useGitHubData';
import CodebaseEvolutionSuite from './CodebaseEvolutionSuite';
import RepositoryTimeline from './RepositoryTimeline';
import {
  Github,
  Code2,
  ExternalLink,
  Terminal as TerminalIcon,
  Search,
  Calendar,
  Layers,
  Sparkles,
  GitBranch,
  Clock,
  Radio,
  AlertCircle,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function GitHubMetaDashboard() {
  const {
    user,
    repos,
    commits,
    contributionCalendar,
    lastPolledTime,
  } = useGitHubData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const activeRepos = useMemo(() => {
    return Array.isArray(repos) && repos.length > 0 ? repos : [];
  }, [repos]);

  const languageMap = useMemo(() => {
    return activeRepos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [activeRepos]);

  const availableLanguages = useMemo(() => ['All', ...Object.keys(languageMap)], [languageMap]);

  const filteredRepos = useMemo(() => {
    return activeRepos.filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLang = selectedLanguage === 'All' || repo.language === selectedLanguage;
      return matchesSearch && matchesLang;
    });
  }, [activeRepos, searchQuery, selectedLanguage]);

  const languageColors: Record<string, { hex: string; bg: string }> = {
    Python: { hex: '#38bdf8', bg: 'from-sky-400 to-blue-600' },
    TypeScript: { hex: '#818cf8', bg: 'from-indigo-400 to-purple-600' },
    JavaScript: { hex: '#facc15', bg: 'from-amber-300 to-yellow-500' },
    'C++': { hex: '#f43f5e', bg: 'from-rose-400 to-pink-600' },
    HTML: { hex: '#fb923c', bg: 'from-orange-400 to-red-500' },
    CSS: { hex: '#c084fc', bg: 'from-purple-400 to-violet-600' },
    Jupyter: { hex: '#f97316', bg: 'from-orange-500 to-amber-600' },
    'Jupyter Notebook': { hex: '#f97316', bg: 'from-orange-500 to-amber-600' },
    Shell: { hex: '#4ade80', bg: 'from-emerald-400 to-teal-500' },
  };

  const topLanguages = useMemo(() => {
    return Object.entries(languageMap).sort((a, b) => b[1] - a[1]);
  }, [languageMap]);

  const primaryLang = topLanguages.length > 0 ? topLanguages[0][0] : 'Python';

  const activityWeeks = useMemo(() => {
    if (contributionCalendar?.weeks && contributionCalendar.weeks.length > 0) {
      return contributionCalendar.weeks.slice(-52).map((w) =>
        w.contributionDays.map((d) => {
          const cellDate = new Date(d.date);
          const formattedDate = cellDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          const count = d.contributionCount || 0;
          const intensity = count >= 4 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0;

          return {
            date: d.date,
            formattedDate,
            intensity,
            count,
          };
        })
      );
    }

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (51 * 7 + today.getDay()));

    const commitDateCounts: Record<string, number> = {};

    commits.forEach((c) => {
      if (c.date) {
        const dStr = new Date(c.date).toISOString().split('T')[0];
        commitDateCounts[dStr] = (commitDateCounts[dStr] || 0) + 1;
      }
    });

    activeRepos.forEach((r) => {
      if (r.pushed_at) {
        const dStr = new Date(r.pushed_at).toISOString().split('T')[0];
        commitDateCounts[dStr] = (commitDateCounts[dStr] || 0) + 1;
      }
    });

    const weeks = [];
    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(startDate.getDate() + (w * 7 + d));

        const dateStr = cellDate.toISOString().split('T')[0];
        const formattedDate = cellDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });

        const count = commitDateCounts[dateStr] || 0;
        const intensity = count >= 4 ? 3 : count >= 2 ? 2 : count >= 1 ? 1 : 0;

        days.push({
          date: dateStr,
          formattedDate,
          intensity,
          count,
        });
      }
      weeks.push(days);
    }
    return weeks;
  }, [contributionCalendar, commits, activeRepos]);

  return (
    <div className="space-y-16">

      {/* Top Telemetry Path & Status Tag */}
      <ScrollReveal direction="up" delay={0.05}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-muted">
            <span className="text-bone">03 // REPOSITORY TELEMETRY</span>
            <span className="text-line">/</span>
            <span className="text-ember">PRODUCTION LOG</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 font-mono text-xs text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            <span>Real-Time Meta Sync</span>
          </div>
        </div>
      </ScrollReveal>

      {/* 1. Hero Header & Profile Summary */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="rounded-xl border border-line bg-surface p-8 sm:p-10 shadow-float relative overflow-hidden">

          {/* Ambient Ember Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-ember/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
            <div className="flex items-center gap-6">
              {/* GitHub Avatar */}
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-ember p-1 bg-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user?.avatar_url || `https://github.com/${portfolioData.githubUsername}.png`}
                    alt={portfolioData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-ink" title="Active on GitHub" />
              </div>

              <div>
                {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember/10 border border-ember/30 text-ember font-mono text-xs mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>Real-Time Meta Sync</span>
                </div> */}
                <h1 className="font-display text-2xl sm:text-4xl font-bold text-bone">
                  {portfolioData.name} <span className="font-mono text-muted text-lg sm:text-xl">(@{portfolioData.githubUsername})</span>
                </h1>
                <p className="text-bone-dim text-xs sm:text-sm max-w-xl mt-1 leading-relaxed">
                  {user?.bio || portfolioData.bio}
                </p>
              </div>
            </div>

            <a
              href={`https://github.com/${portfolioData.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-ember/50 bg-ember/10 hover:border-ember hover:bg-ember/20 text-bone font-mono text-xs transition-colors shrink-0"
            >
              <Github className="w-4 h-4 text-ember" />
              <span>View GitHub Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-ember" />
            </a>
          </div>

          {/* Focused Metrics Counter Grid */}
          <div className="mt-8 pt-8 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-lg bg-ink/70 border border-line">
              <span className="text-[0.68rem] text-indigo-400 uppercase tracking-wider block mb-1">Public Repos</span>
              <span className="font-display text-2xl font-bold text-bone">{user?.public_repos ?? activeRepos.length ?? 23}</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/70 border border-line">
              <span className="text-[0.68rem] text-purple-400 uppercase tracking-wider block mb-1">Top Stack</span>
              <span className="font-display text-2xl font-bold text-bone truncate block">{primaryLang}</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/70 border border-line">
              <span className="text-[0.68rem] text-cyan-400 uppercase tracking-wider block mb-1">Active Projects</span>
              <span className="font-display text-2xl font-bold text-bone">{activeRepos.length}</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/70 border border-line">
              <span className="text-[0.68rem] text-cyan-400 uppercase tracking-wider block mb-1">Dev Status</span>
              <span className="font-mono text-xs font-semibold text-cyan-400 flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Active Contributor
              </span>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* 2. INTERACTIVE REPOSITORY TIMELINE (ABOVE MIDDLE 1) */}
      <RepositoryTimeline repos={activeRepos} />

      {/* 3. DEDICATED LAST 5 RECENT COMMITS REGARDLESS OF REPOSITORY (MIDDLE 1) */}
      <ScrollReveal direction="up" delay={0.2}>
        <div className="rounded-xl border border-line bg-surface p-7 shadow-panel">

          {/* Terminal Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-line pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <h2 className="font-mono text-sm font-bold text-bone flex items-center gap-2 ml-2">
                <TerminalIcon className="w-4 h-4 text-ember" />
                <span>$ git log -n 5 --all --oneline</span>
              </h2>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Live Stream (1m)</span>
              </span>
            </div>
          </div>



          {/* Commits List Feed */}
          {commits.length > 0 ? (
            <div className="space-y-3 font-mono text-xs">
              {commits.map((commit, idx) => (
                <div
                  key={`${commit.sha}-${idx}`}
                  className="p-4 rounded-lg bg-ink/80 border border-line hover:border-ember/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start sm:items-center gap-3 overflow-hidden">
                    {/* Commit Hash Pill */}
                    <a
                      href={commit.commitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded bg-ember/10 border border-ember/40 text-ember font-bold shrink-0 hover:bg-ember/20"
                    >
                      {commit.shortSha}
                    </a>

                    {/* Target Repository Name Pill */}
                    <a
                      href={commit.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-0.5 rounded bg-surface border border-line text-bone-dim hover:text-bone shrink-0 font-semibold flex items-center gap-1.5"
                    >
                      <GitBranch className="w-3 h-3 text-ember" />
                      <span>{commit.repoName}</span>
                    </a>

                    {/* Commit Message */}
                    <p className="text-bone text-xs group-hover:text-ember transition-colors truncate">
                      {commit.message}
                    </p>
                  </div>

                  {/* Date & Link */}
                  <div className="flex items-center gap-3 text-muted shrink-0 text-[0.7rem] self-end sm:self-auto">
                    <span className="flex items-center gap-1 text-bone-dim">
                      <Clock className="w-3 h-3 text-ember" />
                      {commit.timeAgo}
                    </span>
                    <a
                      href={commit.commitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-ember transition-colors text-muted hover:underline flex items-center gap-1"
                      title="View Commit Diff on GitHub"
                    >
                      <span>Diff</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center font-mono text-xs text-muted rounded-lg bg-ink border border-line">
              <p>Commits pushed across public repositories will stream live right here.</p>
            </div>
          )}

          {lastPolledTime && (
            <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between font-mono text-[0.68rem] text-muted">
              <span>Live commits stream updates every 1 minute</span>
              <span>Last checked: {lastPolledTime}</span>
            </div>
          )}

        </div>
      </ScrollReveal>

      {/* 4. CODEBASE EVOLUTION & SCROLLYTELLING SUITE (MIDDLE 2) */}
      <CodebaseEvolutionSuite />

    </div>
  );
}
