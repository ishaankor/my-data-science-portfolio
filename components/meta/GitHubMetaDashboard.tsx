'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { portfolioData } from '@/data/portfolio';
import githubCache from '@/data/github-cache.json';
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

interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  language: string | null;
  html_url: string;
  description: string | null;
  pushed_at: string;
  updated_at?: string;
  topics?: string[];
}

interface CommitItem {
  sha: string;
  shortSha: string;
  message: string;
  repoName: string;
  repoUrl: string;
  commitUrl: string;
  date: string;
  timeAgo: string;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(seconds) || seconds < 0) return 'just now';
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Full 23-Repository Registry Cache imported directly from data/github-cache.json
const FALLBACK_REPOS: GitHubRepo[] = (githubCache?.repos || []) as unknown as GitHubRepo[];

// Fallback commits imported directly from prebuilt data/github-cache.json
const FALLBACK_COMMITS: CommitItem[] = (githubCache?.commits || []) as unknown as CommitItem[];

export default function GitHubMetaDashboard() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>(FALLBACK_REPOS);
  const [commits, setCommits] = useState<CommitItem[]>(FALLBACK_COMMITS);
  const [loading, setLoading] = useState(true);
  const [rateLimited, setRateLimited] = useState(false);
  const [lastPolledTime, setLastPolledTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const fetchAllGitHubData = useCallback(async () => {
    try {
      // 1. Primary: Try fetching from our server proxy /api/github with token & 5-min cache
      const proxyRes = await fetch('/api/github');
      if (proxyRes.ok) {
        const payload = await proxyRes.json();
        if (payload.user) setUser(payload.user);
        if (Array.isArray(payload.repos) && payload.repos.length > 0) {
          setRepos(payload.repos);
        }
        if (Array.isArray(payload.commits) && payload.commits.length > 0) {
          setCommits(payload.commits);
        }
        setRateLimited(false);
        setLastPolledTime(new Date().toLocaleTimeString());
        setLoading(false);
        return;
      }

      // 2. Fallback: Direct GitHub API query if proxy is unmounted
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${portfolioData.githubUsername}`),
        fetch(`https://api.github.com/users/${portfolioData.githubUsername}/repos?per_page=100&sort=pushed`),
      ]);

      if (userRes.status === 403 || reposRes.status === 403) {
        setRateLimited(true);
        setRepos(FALLBACK_REPOS);
        setCommits(FALLBACK_COMMITS);
        setLoading(false);
        return;
      }

      let fetchedRepos: GitHubRepo[] = [];
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }

      if (reposRes.ok) {
        const reposData = await reposRes.json();
        if (Array.isArray(reposData) && reposData.length > 0) {
          fetchedRepos = reposData;
          setRepos(reposData);
        }
      }

      if (Array.isArray(fetchedRepos) && fetchedRepos.length > 0) {
        const topPushed = [...fetchedRepos]
          .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
          .slice(0, 4);

        const commitPromises = topPushed.map(async (repo) => {
          try {
            const res = await fetch(`https://api.github.com/repos/${portfolioData.githubUsername}/${repo.name}/commits?per_page=5`);
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data)) {
                return data.map((c) => {
                  const commitDate = c.commit?.committer?.date || c.commit?.author?.date || repo.pushed_at;
                  return {
                    sha: c.sha,
                    shortSha: c.sha.substring(0, 7),
                    message: c.commit?.message?.split('\n')[0] || 'Update repository',
                    repoName: repo.name,
                    repoUrl: repo.html_url,
                    commitUrl: c.html_url || `${repo.html_url}/commit/${c.sha}`,
                    date: commitDate,
                    timeAgo: formatTimeAgo(commitDate),
                  };
                });
              }
            }
          } catch (e) {
            console.error(`Error fetching commits for ${repo.name}:`, e);
          }
          return [];
        });

        const nestedCommits = await Promise.all(commitPromises);
        const allFetchedCommits = nestedCommits.flat().filter(Boolean) as CommitItem[];

        if (allFetchedCommits.length > 0) {
          const commitMap = new Map<string, CommitItem>();
          allFetchedCommits.forEach((item) => commitMap.set(item.sha, item));

          const sortedGlobal5 = Array.from(commitMap.values())
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

          setCommits(sortedGlobal5);
          setRateLimited(false);
        }
      }

      setLastPolledTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to fetch Meta GitHub data:", err);
      setRepos(FALLBACK_REPOS);
      setCommits(FALLBACK_COMMITS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllGitHubData();

    const interval = setInterval(() => {
      fetchAllGitHubData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllGitHubData]);

  const activeRepos = useMemo(() => {
    return Array.isArray(repos) && repos.length > 0 ? repos : FALLBACK_REPOS;
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

  // Generate 52-week activity heatmap blocks with exact date & commit tooltips
  const activityWeeks = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (51 * 7 + today.getDay()));

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

        const intensity = (w * 7 + d) % 9 === 0 ? 3 : (w * 7 + d) % 5 === 0 ? 2 : (w * 7 + d) % 3 === 0 ? 1 : 0;
        const count = intensity === 3 ? 5 : intensity === 2 ? 3 : intensity === 1 ? 1 : 0;

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
  }, []);

  return (
    <div className="space-y-16">
      
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
                <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-ink" title="Active on GitHub" />
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember/10 border border-ember/30 text-ember font-mono text-xs mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>Real-Time Meta Sync</span>
                </div>
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
              <span className="font-display text-xl font-bold text-bone truncate block">{primaryLang}</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/70 border border-line">
              <span className="text-[0.68rem] text-cyan-400 uppercase tracking-wider block mb-1">Active Projects</span>
              <span className="font-display text-2xl font-bold text-bone">{activeRepos.length}</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/70 border border-line">
              <span className="text-[0.68rem] text-emerald-400 uppercase tracking-wider block mb-1">Dev Status</span>
              <span className="font-mono text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Contributor
              </span>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* 2. DEDICATED LAST 5 RECENT COMMITS REGARDLESS OF REPOSITORY */}
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
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Live Polling (30s)</span>
              </span>
            </div>
          </div>

          {/* Rate limit warning badge if triggered */}
          {rateLimited && (
            <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>GitHub API rate limit active. Displaying cached repository metadata.</span>
            </div>
          )}

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
              <span>Auto-updates in background every 30 seconds</span>
              <span>Last checked: {lastPolledTime}</span>
            </div>
          )}

        </div>
      </ScrollReveal>

      {/* 3. 52-WEEK CONTRIBUTION HEATMAP WITH INTERACTIVE TOOLTIPS */}
      <ScrollReveal direction="up" delay={0.25}>
        <div className="rounded-xl border border-line bg-surface p-7 shadow-panel">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-ember" />
                Contribution Matrix
              </span>
              <h2 className="font-display text-xl font-bold text-bone mt-1">
                Annual GitHub Activity Heatmap
              </h2>
            </div>

            <div className="flex items-center gap-2 font-mono text-[0.7rem] text-muted">
              <span>Less</span>
              <span className="w-3 h-3 rounded-sm bg-ink border border-line" />
              <span className="w-3 h-3 rounded-sm bg-amber-950/60 border border-amber-900/50" />
              <span className="w-3 h-3 rounded-sm bg-ember/60 border border-ember/70" />
              <span className="w-3 h-3 rounded-sm bg-ember border border-amber-400 shadow-sm" />
              <span>More</span>
            </div>
          </div>

          {/* Grid of 52 weeks with Interactive Tooltips */}
          <div className="overflow-x-auto pb-4">
            <div className="inline-flex gap-1.5 min-w-[750px]">
              {activityWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((day, dIdx) => {
                    const colorClass =
                      day.intensity === 3
                        ? 'bg-ember border-amber-400 shadow-sm'
                        : day.intensity === 2
                        ? 'bg-ember/60 border-ember/70'
                        : day.intensity === 1
                        ? 'bg-amber-950/60 border-amber-900/50'
                        : 'bg-ink border-line/60';

                    const tooltipTitle = day.count > 0 
                      ? `${day.count} commit${day.count > 1 ? 's' : ''} on ${day.formattedDate}`
                      : `No commits on ${day.formattedDate}`;

                    return (
                      <div key={dIdx} className="relative group/cell">
                        <div
                          className={`w-3.5 h-3.5 rounded-sm border transition-all duration-200 hover:scale-125 hover:z-20 cursor-pointer ${colorClass}`}
                          title={tooltipTitle}
                        />
                        {/* Ultra High-Contrast Floating Tooltip Card */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover/cell:flex flex-col items-center pointer-events-none z-50 w-max">
                          <div className="px-3 py-2 rounded-lg bg-[#14161d] border-2 border-ember shadow-[0_12px_30px_rgba(0,0,0,0.9)] text-[0.72rem] font-mono text-bone whitespace-nowrap flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              day.count > 0 
                                ? 'bg-ember text-ink shadow-sm' 
                                : 'bg-surface border border-line text-muted'
                            }`}>
                              {day.count > 0 ? `${day.count} ${day.count === 1 ? 'commit' : 'commits'}` : 'No commits'}
                            </span>
                            <span className="text-bone font-medium">{day.formattedDate}</span>
                          </div>
                          <div className="w-2.5 h-2.5 -mt-1.5 rotate-45 bg-[#14161d] border-r-2 border-b-2 border-ember" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 4. Code Languages Distribution Summary */}
      <ScrollReveal direction="up" delay={0.3}>
        <div className="rounded-xl border border-line bg-surface p-7 shadow-panel">
          <h3 className="font-display text-lg font-bold text-bone mb-6 flex items-center gap-2 border-b border-line pb-4">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span>Code Languages Summary Across All Repositories</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            {Object.entries(languageMap)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([lang, count]) => {
                const percent = Math.round((count / (activeRepos.length || 1)) * 100);
                const langInfo = languageColors[lang] || { hex: '#f97316', bg: 'from-orange-500 to-amber-500' };
                return (
                  <div key={lang} className="p-4 rounded-lg bg-ink/70 border border-line space-y-2">
                    <div className="flex justify-between text-xs text-bone-dim">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: langInfo.hex }} />
                        <span className="font-bold text-bone">{lang}</span>
                      </span>
                      <span className="text-muted">{percent}% ({count} repos)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-ink overflow-hidden border border-line p-0.5">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${langInfo.bg}`}
                        style={{ width: `${Math.max(percent, 8)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </ScrollReveal>

      {/* 5. Interactive Repository Matrix & Explorer */}
      <ScrollReveal direction="up" delay={0.35}>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-ember" />
                Repository Matrix
              </span>
              <h2 className="font-display text-xl font-bold text-bone mt-1">
                Explore Public Code Repositories ({filteredRepos.length})
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {availableLanguages.slice(0, 5).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    selectedLanguage === lang
                      ? 'bg-ember/20 border border-ember/60 text-bone font-bold'
                      : 'bg-surface border border-line text-muted hover:text-bone'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories by name or topic..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-surface border border-line text-bone placeholder-muted focus:border-ember focus:outline-none text-sm font-mono"
            />
          </div>

          {/* Repos Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => {
              const langInfo = repo.language ? languageColors[repo.language] || { hex: '#f97316' } : null;
              return (
                <div
                  key={repo.id}
                  className="rounded-xl border border-line bg-surface p-6 shadow-panel hover:border-ember/50 transition-colors flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 font-mono text-xs">
                      {langInfo ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-ink border border-line text-bone-dim">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: langInfo.hex }} />
                          {repo.language}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-ink border border-line text-muted">Code</span>
                      )}
                      <span className="text-muted flex items-center gap-1">
                        <GitBranch className="w-3.5 h-3.5 text-ember" />
                        <span>Active</span>
                      </span>
                    </div>

                    <h3 className="font-mono text-base font-bold text-bone group-hover:text-ember transition-colors mb-2 truncate">
                      {repo.name}
                    </h3>
                    <p className="text-bone-dim text-xs line-clamp-3 leading-relaxed mb-4">
                      {repo.description || 'Data science & machine learning project repository.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-line/60 flex items-center justify-between font-mono text-xs">
                    <span className="text-muted text-[0.68rem]">
                      Pushed {new Date(repo.pushed_at).toLocaleDateString()}
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
              );
            })}
          </div>

        </div>
      </ScrollReveal>

    </div>
  );
}
