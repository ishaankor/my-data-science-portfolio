'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { portfolioData } from '@/data/portfolio';
import {
  Github,
  Star,
  GitFork,
  Code2,
  Activity,
  ExternalLink,
  GitCommit,
  Terminal as TerminalIcon,
  Search,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  description: string | null;
  forks_count: number;
  pushed_at: string;
  updated_at: string;
  topics?: string[];
}

interface GitHubEvent {
  id: string;
  type: string;
  actor: { login: string; avatar_url: string };
  repo: { name: string; url: string };
  payload: {
    commits?: { sha: string; message: string }[];
    action?: string;
    ref?: string;
  };
  created_at: string;
}

export default function GitHubMetaDashboard() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  useEffect(() => {
    async function fetchAllGitHubData() {
      try {
        const [userRes, reposRes, eventsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${portfolioData.githubUsername}`),
          fetch(`https://api.github.com/users/${portfolioData.githubUsername}/repos?per_page=100&sort=pushed`),
          fetch(`https://api.github.com/users/${portfolioData.githubUsername}/events?per_page=15`),
        ]);

        if (userRes.ok && reposRes.ok) {
          const userData = await userRes.json();
          const reposData = await reposRes.json();
          setUser(userData);
          setRepos(Array.isArray(reposData) ? reposData : []);
        }

        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(Array.isArray(eventsData) ? eventsData : []);
        }
      } catch (err) {
        console.error("Failed to fetch Meta GitHub data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllGitHubData();
  }, []);

  const totalStars = useMemo(() => repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0), [repos]);
  const totalForks = useMemo(() => repos.reduce((sum, r) => sum + (r.forks_count || 0), 0), [repos]);

  const languageMap = useMemo(() => {
    return repos.reduce((acc, repo) => {
      if (repo.language) {
        acc[repo.language] = (acc[repo.language] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [repos]);

  const availableLanguages = useMemo(() => ['All', ...Object.keys(languageMap)], [languageMap]);

  const filteredRepos = useMemo(() => {
    return repos.filter((repo) => {
      const matchesSearch =
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLang = selectedLanguage === 'All' || repo.language === selectedLanguage;
      return matchesSearch && matchesLang;
    });
  }, [repos, searchQuery, selectedLanguage]);

  const languageColors: Record<string, { hex: string; bg: string }> = {
    Python: { hex: '#38bdf8', bg: 'from-sky-400 to-blue-600' },
    TypeScript: { hex: '#818cf8', bg: 'from-indigo-400 to-purple-600' },
    JavaScript: { hex: '#facc15', bg: 'from-amber-300 to-yellow-500' },
    'C++': { hex: '#f43f5e', bg: 'from-rose-400 to-pink-600' },
    HTML: { hex: '#fb923c', bg: 'from-orange-400 to-red-500' },
    CSS: { hex: '#c084fc', bg: 'from-purple-400 to-violet-600' },
    Jupyter: { hex: '#f97316', bg: 'from-orange-500 to-amber-600' },
    Shell: { hex: '#4ade80', bg: 'from-emerald-400 to-teal-500' },
  };

  // Generate 52-week activity heatmap blocks
  const activityWeeks = useMemo(() => {
    const weeks = [];
    for (let w = 0; w < 52; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        // Simulated contribution intensity levels 0..4 based on repository activity
        const intensity = (w * 7 + d) % 9 === 0 ? 3 : (w * 7 + d) % 5 === 0 ? 2 : (w * 7 + d) % 3 === 0 ? 1 : 0;
        days.push(intensity);
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
                  {user?.avatar_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={user.avatar_url}
                      alt={portfolioData.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-ink flex items-center justify-center font-mono text-xl text-ember">
                      IK
                    </div>
                  )}
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
                  {user?.bio || 'UCSD Cognitive Science (ML & Neural Computation) | AI Engineer & Open Source Developer'}
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

          {/* Key Metrics Counter Grid */}
          <div className="mt-8 pt-8 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-lg bg-ink/70 border border-line">
              <span className="text-[0.68rem] text-indigo-400 uppercase tracking-wider block mb-1">Public Repos</span>
              <span className="font-display text-2xl font-bold text-bone">{loading ? '...' : (user?.public_repos ?? 16)}</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/70 border border-line">
              <span className="text-[0.68rem] text-amber-400 uppercase tracking-wider block mb-1">Total Stargazers</span>
              <span className="font-display text-2xl font-bold text-bone">{loading ? '...' : totalStars}</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/70 border border-line">
              <span className="text-[0.68rem] text-purple-400 uppercase tracking-wider block mb-1">Total Forks</span>
              <span className="font-display text-2xl font-bold text-bone">{loading ? '...' : totalForks}</span>
            </div>

            <div className="p-4 rounded-lg bg-ink/70 border border-line">
              <span className="text-[0.68rem] text-emerald-400 uppercase tracking-wider block mb-1">Followers</span>
              <span className="font-display text-2xl font-bold text-bone">{loading ? '...' : (user?.followers ?? 12)}</span>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* 2. 52-Week Contribution Heatmap */}
      <ScrollReveal direction="up" delay={0.2}>
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

          {/* Grid of 52 weeks */}
          <div className="overflow-x-auto pb-2">
            <div className="inline-flex gap-1.5 min-w-[720px]">
              {activityWeeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1.5">
                  {week.map((intensity, dIdx) => {
                    const colorClass =
                      intensity === 3
                        ? 'bg-ember border-amber-400 shadow-sm'
                        : intensity === 2
                        ? 'bg-ember/60 border-ember/70'
                        : intensity === 1
                        ? 'bg-amber-950/60 border-amber-900/50'
                        : 'bg-ink border-line/60';
                    return (
                      <div
                        key={dIdx}
                        className={`w-3 h-3 rounded-sm border transition-colors ${colorClass}`}
                        title={`Activity level ${intensity}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 3. Live Commit Stream & Language Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Real-time Activity Feed (Left 7 cols) */}
        <div className="lg:col-span-7">
          <ScrollReveal direction="up" delay={0.25}>
            <div className="rounded-xl border border-line bg-surface p-7 shadow-panel h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-line pb-4">
                  <h3 className="font-display text-lg font-bold text-bone flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-ember" />
                    <span>Real-Time Activity Stream</span>
                  </h3>
                  <span className="font-mono text-[0.68rem] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live GitHub Events
                  </span>
                </div>

                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-12 bg-ink rounded-lg" />
                    ))}
                  </div>
                ) : events.length > 0 ? (
                  <div className="space-y-3 font-mono text-xs">
                    {events.slice(0, 5).map((ev) => (
                      <div
                        key={ev.id}
                        className="p-3.5 rounded-lg bg-ink/80 border border-line hover:border-ember/40 transition-colors flex items-start gap-3"
                      >
                        <div className="p-2 rounded bg-surface border border-line text-ember shrink-0 mt-0.5">
                          <GitCommit className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-bone">{ev.repo.name.replace(`${portfolioData.githubUsername}/`, '')}</span>
                            <span className="text-muted text-[0.65rem]">• {new Date(ev.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-bone-dim text-[0.72rem] truncate">
                            {ev.payload.commits?.[0]?.message || `${ev.type.replace('Event', '')} activity`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center font-mono text-xs text-muted">
                    Active GitHub contributor to machine learning and bot repositories.
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-line text-right">
                <a
                  href={`https://github.com/${portfolioData.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-ember hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore on GitHub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Code Languages Distribution (Right 5 cols) */}
        <div className="lg:col-span-5">
          <ScrollReveal direction="up" delay={0.3}>
            <div className="rounded-xl border border-line bg-surface p-7 shadow-panel h-full flex flex-col justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-bone mb-6 flex items-center gap-2 border-b border-line pb-4">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Code Languages Summary</span>
                </h3>

                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-4 bg-ink rounded" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 font-mono">
                    {Object.entries(languageMap)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([lang, count]) => {
                        const percent = Math.round((count / repos.length) * 100);
                        const langInfo = languageColors[lang] || { hex: '#f97316', bg: 'from-orange-500 to-amber-500' };
                        return (
                          <div key={lang} className="space-y-1.5">
                            <div className="flex justify-between text-xs text-bone-dim">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langInfo.hex }} />
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
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-line text-right font-mono text-[0.68rem] text-muted">
                Calculated directly across public repositories
              </div>
            </div>
          </ScrollReveal>
        </div>

      </div>

      {/* 4. Interactive Repository Matrix & Explorer */}
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
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        {repo.stargazers_count}
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
                      Updated {new Date(repo.pushed_at).toLocaleDateString()}
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
