'use client';

import React, { useEffect, useState } from 'react';
import { Github, Star, GitFork, Code2, Activity, ExternalLink } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import ScrollReveal from '@/components/ui/ScrollReveal';

interface GitHubUser {
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  html_url: string;
  bio: string;
}

interface GitHubRepo {
  name: string;
  stargazers_count: number;
  language: string | null;
  html_url: string;
  description: string | null;
  forks_count: number;
  updated_at: string;
}

export default function GitHubAnalytics() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const [userRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${portfolioData.githubUsername}`),
          fetch(`https://api.github.com/users/${portfolioData.githubUsername}/repos?per_page=100&sort=pushed`)
        ]);

        if (userRes.ok && reposRes.ok) {
          const userData = await userRes.json();
          const reposData = await reposRes.json();
          setUser(userData);
          setRepos(Array.isArray(reposData) ? reposData : []);
        }
      } catch (err) {
        console.error("Failed to fetch GitHub analytics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

  const languageMap = repos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topLanguages = Object.entries(languageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const popularRepos = [...repos]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 3);

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

  return (
    <section className="border-t border-line/60 py-20 sm:py-28 relative">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
                <span className="h-px w-7 bg-line" aria-hidden="true" />
                github activity
              </span>
              <h2 className="font-display text-[2rem] sm:text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.02em] text-bone mt-4">
                Real-time API metadata.
              </h2>
            </div>

            <a
              href={`https://github.com/${portfolioData.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-md border border-line bg-surface/60 px-4 py-2 font-mono text-xs text-bone transition-colors hover:border-ember hover:text-ember"
            >
              <Github className="w-4 h-4 text-ember" />
              <span>@{portfolioData.githubUsername}</span>
              <ExternalLink className="w-3.5 h-3.5 text-muted group-hover:text-ember" />
            </a>
          </div>
        </ScrollReveal>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Key Metrics Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <ScrollReveal direction="up" delay={0.15}>
              <div className="rounded-xl border border-indigo-500/20 bg-surface p-5 shadow-panel flex flex-col justify-between h-full hover:border-indigo-500/40 transition-colors">
                <div className="flex items-center justify-between text-indigo-400 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="font-mono text-[0.65rem] text-indigo-400/80 uppercase">Live API</span>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-bone">
                    {loading ? '...' : (user?.public_repos ?? portfolioData.stats[1].value)}
                  </p>
                  <p className="font-mono text-xs text-muted mt-1">Public Repos</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <div className="rounded-xl border border-amber-500/20 bg-surface p-5 shadow-panel flex flex-col justify-between h-full hover:border-amber-500/40 transition-colors">
                <div className="flex items-center justify-between text-amber-400 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="font-mono text-[0.65rem] text-amber-400/80 uppercase">Stars</span>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-bone">
                    {loading ? '...' : totalStars}
                  </p>
                  <p className="font-mono text-xs text-muted mt-1">Total Stars</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.25}>
              <div className="rounded-xl border border-purple-500/20 bg-surface p-5 shadow-panel flex flex-col justify-between h-full hover:border-purple-500/40 transition-colors">
                <div className="flex items-center justify-between text-purple-400 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <GitFork className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="font-mono text-[0.65rem] text-purple-400/80 uppercase">Network</span>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-bone">
                    {loading ? '...' : (user?.followers ?? 12)}
                  </p>
                  <p className="font-mono text-xs text-muted mt-1">Followers</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="rounded-xl border border-emerald-500/20 bg-surface p-5 shadow-panel flex flex-col justify-between h-full hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center justify-between text-emerald-400 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="font-mono text-[0.65rem] text-emerald-400/80 uppercase">Status</span>
                </div>
                <div>
                  <p className="font-mono text-xs font-semibold text-bone flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Active
                  </p>
                  <p className="font-mono text-[0.68rem] text-muted mt-1 truncate">
                    Building AI & ML
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Languages Breakdown */}
          <div className="lg:col-span-4">
            <ScrollReveal direction="up" delay={0.25}>
              <div className="rounded-xl border border-line bg-surface p-6 shadow-panel flex flex-col justify-between h-full">
                <div>
                  <h3 className="font-display text-lg font-semibold text-bone mb-4 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>Code Languages Breakdown</span>
                  </h3>

                  {loading ? (
                    <div className="space-y-3 animate-pulse">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-4 bg-ink rounded" />
                      ))}
                    </div>
                  ) : topLanguages.length > 0 ? (
                    <div className="space-y-3 font-mono">
                      {topLanguages.map(([lang, count]) => {
                        const percent = Math.round((count / repos.length) * 100);
                        const langInfo = languageColors[lang] || { hex: '#f97316', bg: 'from-orange-500 to-amber-500' };
                        return (
                          <div key={lang} className="space-y-1.5">
                            <div className="flex justify-between text-xs text-bone-dim">
                              <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: langInfo.hex }} />
                                <span>{lang}</span>
                              </span>
                              <span className="text-muted">{percent}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-ink overflow-hidden border border-line p-0.5">
                              <div
                                className={`h-full rounded-full bg-gradient-to-r ${langInfo.bg} transition-all duration-500`}
                                style={{ width: `${Math.max(percent, 8)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="font-mono text-xs text-muted">Python, TypeScript, SQL, C++, HTML/CSS</p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-line text-right">
                  <span className="font-mono text-[0.68rem] text-cyan-400">Updated in real-time</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Popular Repositories List */}
          <div className="lg:col-span-4">
            <ScrollReveal direction="up" delay={0.35}>
              <div className="rounded-xl border border-line bg-surface p-6 shadow-panel flex flex-col justify-between h-full">
                <div>
                  <h3 className="font-display text-lg font-semibold text-bone mb-4 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>Popular Repositories</span>
                  </h3>

                  {loading ? (
                    <div className="space-y-3 animate-pulse">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-ink rounded-lg" />
                      ))}
                    </div>
                  ) : popularRepos.length > 0 ? (
                    <div className="space-y-3">
                      {popularRepos.map((repo) => (
                        <a
                          key={repo.name}
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group p-3 rounded-lg bg-ink/70 border border-line hover:border-amber-500/40 flex items-center justify-between transition-colors"
                        >
                          <div className="overflow-hidden pr-2">
                            <p className="font-mono text-xs font-semibold text-bone group-hover:text-amber-400 truncate">
                              {repo.name}
                            </p>
                            <p className="text-[0.72rem] text-muted truncate mt-0.5">
                              {repo.description || 'Data science & AI project repository'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-xs text-muted shrink-0">
                            <Star className="w-3.5 h-3.5 text-amber-400" />
                            <span>{repo.stargazers_count}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="font-mono text-xs text-muted space-y-2">
                      <p>• transformi</p>
                      <p>• daily-motivation</p>
                      <p>• twitter-scraping-ai</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-line flex items-center justify-between font-mono text-[0.68rem] text-muted">
                  <span>GitHub API v3</span>
                  <a
                    href={`https://github.com/${portfolioData.githubUsername}?tab=repositories`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 inline-flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ExternalLink className="w-3 h-3 text-amber-400" />
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
