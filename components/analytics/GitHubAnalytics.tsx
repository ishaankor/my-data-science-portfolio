'use client';

import React, { useEffect, useState } from 'react';
import { Github, Star, GitFork, Code2, Activity, ExternalLink } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

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
}

export default function GitHubAnalytics() {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch GitHub analytics:", err);
        setError(true);
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
    .slice(0, 4);

  const popularRepos = [...repos]
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 3);

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>Real-Time GitHub API Integration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Live Profile Analytics
            </h2>
          </div>
          <a
            href={`https://github.com/${portfolioData.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-slate-300 hover:text-white text-sm font-medium transition-all"
          >
            <Github className="w-4 h-4 text-cyan-400" />
            <span>@{portfolioData.githubUsername}</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Key Metrics Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-cyan-400 mb-2">
                <Code2 className="w-5 h-5" />
                <span className="text-xs font-mono text-slate-500">API Live</span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white">
                  {loading ? '...' : (user?.public_repos ?? portfolioData.stats[1].value)}
                </p>
                <p className="text-xs text-slate-400 mt-1">Public Repositories</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-yellow-400 mb-2">
                <Star className="w-5 h-5" />
                <span className="text-xs font-mono text-slate-500">Stars</span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white">
                  {loading ? '...' : totalStars}
                </p>
                <p className="text-xs text-slate-400 mt-1">Total Stargazers</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-violet-400 mb-2">
                <GitFork className="w-5 h-5" />
                <span className="text-xs font-mono text-slate-500">Network</span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-white">
                  {loading ? '...' : (user?.followers ?? 12)}
                </p>
                <p className="text-xs text-slate-400 mt-1">GitHub Followers</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-400 mb-2">
                <Activity className="w-5 h-5" />
                <span className="text-xs font-mono text-slate-500">Status</span>
              </div>
              <div>
                <p className="text-base font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </p>
                <p className="text-xs text-slate-400 mt-1">Building & Committing</p>
              </div>
            </div>
          </div>

          {/* Languages Breakdown */}
          <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>Top Code Languages</span>
            </h3>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-4 bg-slate-800 rounded" />
                ))}
              </div>
            ) : topLanguages.length > 0 ? (
              <div className="space-y-3.5">
                {topLanguages.map(([lang, count]) => {
                  const percent = Math.round((count / repos.length) * 100);
                  return (
                    <div key={lang} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300 font-mono">
                        <span>{lang}</span>
                        <span>{percent}% ({count} repos)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                          style={{ width: `${Math.max(percent, 8)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Python, TypeScript, SQL, HTML/CSS</p>
            )}
          </div>

          {/* Featured GitHub Repos */}
          <div className="lg:col-span-4 p-6 rounded-2xl glass-panel border border-slate-800 flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Popular Repositories</span>
            </h3>
            {loading ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-slate-800 rounded-xl" />
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
                    className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between group transition-all"
                  >
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors">
                        {repo.name}
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {repo.description || 'Data science & analytics code repository'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 shrink-0 ml-2">
                      <Star className="w-3.5 h-3.5 text-yellow-400" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 space-y-2">
                <p>• daily-motivation</p>
                <p>• twitter-scraping-ai</p>
                <p>• transformi</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
