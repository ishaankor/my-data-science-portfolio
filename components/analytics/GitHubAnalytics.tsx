'use client';

import React from 'react';
import { Github, Code2, Activity, ExternalLink, GitBranch, Terminal } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { useGitHubData } from '@/hooks/useGitHubData';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function GitHubAnalytics() {
  const { user, repos } = useGitHubData();
  const activeRepos = Array.isArray(repos) && repos.length > 0 ? repos : [];

  const languageMap = activeRepos.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topLanguageEntries = Object.entries(languageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topLanguages = topLanguageEntries;

  const recentRepos = [...activeRepos]
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 3);

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

  const primaryLang = topLanguages.length > 0 ? topLanguages[0][0] : 'Python';

  const totalTracked = activeRepos.length || 1;
  const topCount = topLanguageEntries.reduce((sum, [, count]) => sum + count, 0);
  const otherCount = Math.max(0, activeRepos.length - topCount);

  const languagesList = [
    ...topLanguageEntries.map(([lang, count]) => ({
      lang,
      count,
      percent: Math.round((count / totalTracked) * 100),
      color: languageColors[lang]?.hex || '#38bdf8',
    })),
    ...(otherCount > 0
      ? [
          {
            lang: 'Other',
            count: otherCount,
            percent: Math.max(0, 100 - topLanguageEntries.reduce((acc, [, c]) => acc + Math.round((c / totalTracked) * 100), 0)),
            color: '#64748b',
          },
        ]
      : []),
  ];

  return (
    <section className="border-t border-line/60 py-20 sm:py-28 relative">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted">
                <Github className="w-3.5 h-3.5 text-ember" />
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
              <div className="rounded-xl border border-line bg-surface p-5 shadow-panel flex flex-col justify-between h-full hover:border-line/80 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-ink border border-line flex items-center justify-center text-bone">
                    <Code2 className="w-4 h-4 text-bone-dim" />
                  </div>
                  <span className="font-mono text-[0.65rem] text-muted uppercase tracking-wider">Live API</span>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-bone">
                    {user?.public_repos ?? activeRepos.length ?? 23}
                  </p>
                  <p className="font-mono text-xs text-muted mt-1">Public Repos</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <div className="rounded-xl border border-line bg-surface p-5 shadow-panel flex flex-col justify-between h-full hover:border-line/80 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-ink border border-line flex items-center justify-center text-bone">
                    <Terminal className="w-4 h-4 text-bone-dim" />
                  </div>
                  <span className="font-mono text-[0.65rem] text-muted uppercase tracking-wider">Primary</span>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-bone truncate">
                    {primaryLang}
                  </p>
                  <p className="font-mono text-xs text-muted mt-1">Top Stack</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.25}>
              <div className="rounded-xl border border-line bg-surface p-5 shadow-panel flex flex-col justify-between h-full hover:border-line/80 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-ink border border-line flex items-center justify-center text-bone">
                    <GitBranch className="w-4 h-4 text-bone-dim" />
                  </div>
                  <span className="font-mono text-[0.65rem] text-muted uppercase tracking-wider">Active</span>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-bone">
                    {activeRepos.length}
                  </p>
                  <p className="font-mono text-xs text-muted mt-1">Active Projects</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="rounded-xl border border-line bg-surface p-5 shadow-panel flex flex-col justify-between h-full hover:border-line/80 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-ink border border-line flex items-center justify-center text-emerald-400">
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="font-mono text-[0.65rem] text-muted uppercase tracking-wider">Status</span>
                </div>
                <div>
                  <p className="font-mono text-xs font-semibold text-bone flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Active
                  </p>
                  <p className="font-mono text-[0.68rem] text-muted mt-1 truncate">
                    Public Repositories
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
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-semibold text-bone flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-ember" />
                      <span>Code Languages Breakdown</span>
                    </h3>
                    <span className="font-mono text-[10px] text-muted uppercase tracking-wider">
                      {activeRepos.length} Repos
                    </span>
                  </div>

                  {languagesList.length > 0 ? (
                    <div className="space-y-4">
                      {/* GitHub-style Multi-Segmented Language Distribution Bar */}
                      <div className="w-full h-2 rounded-full overflow-hidden flex bg-ink border border-line/60 p-0.5 gap-0.5">
                        {languagesList.map((item) => (
                          <div
                            key={item.lang}
                            style={{
                              width: `${Math.max(item.percent, 3)}%`,
                              backgroundColor: item.color,
                            }}
                            title={`${item.lang}: ${item.percent}% (${item.count} repos)`}
                            className="h-full rounded-full transition-all duration-500"
                          />
                        ))}
                      </div>

                      {/* Individual Language Bars */}
                      <div className="space-y-3 font-mono">
                        {languagesList.map((item) => (
                          <div key={item.lang} className="space-y-1.5">
                            <div className="flex justify-between items-center text-xs text-bone-dim">
                              <span className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 rounded-full shadow-xs shrink-0"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="font-medium text-bone">{item.lang}</span>
                              </span>
                              <span className="text-muted text-[11px] tabular-nums flex items-center gap-2">
                                <span className="text-muted/80">{item.count} {item.count === 1 ? 'repo' : 'repos'}</span>
                                <span className="text-bone font-semibold">{item.percent}%</span>
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-ink overflow-hidden border border-line/50">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${Math.max(item.percent, 4)}%`,
                                  backgroundColor: item.color,
                                  boxShadow: `0 0 8px ${item.color}50`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="font-mono text-xs text-muted">Python, TypeScript, SQL, C++, HTML/CSS</p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-line flex items-center justify-between text-[0.68rem] font-mono text-muted">
                  <span>Stack Distribution</span>
                  <span>Updated in real-time</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Recent Repositories List */}
          <div className="lg:col-span-4">
            <ScrollReveal direction="up" delay={0.35}>
              <div className="rounded-xl border border-line bg-surface p-6 shadow-panel flex flex-col justify-between h-full">
                <div>
                  <h3 className="font-display text-lg font-semibold text-bone mb-4 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-ember" />
                    <span>Recent Repositories</span>
                  </h3>

                  {recentRepos.length > 0 ? (
                    <div className="space-y-3">
                      {recentRepos.map((repo) => (
                        <a
                          key={repo.name}
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group p-3 rounded-lg bg-ink/70 border border-line hover:border-ember/40 flex items-center justify-between transition-colors"
                        >
                          <div className="overflow-hidden pr-2">
                            <p className="font-mono text-xs font-semibold text-bone group-hover:text-ember truncate">
                              {repo.name}
                            </p>
                            <p className="text-[0.72rem] text-muted truncate mt-0.5">
                              {repo.description || 'Data science & AI project repository'}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-xs text-muted shrink-0">
                            <span>{repo.language || 'Code'}</span>
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
                    className="hover:text-ember inline-flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ExternalLink className="w-3 h-3 text-ember" />
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
