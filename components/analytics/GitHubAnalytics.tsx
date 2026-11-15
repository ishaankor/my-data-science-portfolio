'use client';

import React, { useMemo } from 'react';
import { Github, Code2, Activity, ExternalLink, Calendar, GitBranch, Terminal } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import { useGitHubData, calculateWeeklyContributions, calculateDevStatus } from '@/hooks/useGitHubData';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function GitHubAnalytics() {
  const { user, repos, commits, contributionCalendar } = useGitHubData();
  const activeRepos = useMemo(() => (Array.isArray(repos) && repos.length > 0 ? repos : []), [repos]);

  const weeklyContributions = useMemo(() => {
    return calculateWeeklyContributions(contributionCalendar, commits);
  }, [contributionCalendar, commits]);

  const devStatus = useMemo(() => {
    return calculateDevStatus(commits, activeRepos);
  }, [commits, activeRepos]);

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
    <section aria-labelledby="heading-github-analytics" className="telemetry-section">
      <div className="telemetry-container">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <header className="telemetry-header-row">
            <div>
              <span className="section-eyebrow">
                <Github className="icon-xs-accent" aria-hidden="true" />
                <span>github activity</span>
              </span>
              <h2 id="heading-github-analytics" className="section-headline">
                Real-time API metadata.
              </h2>
            </div>

            <a
              href={`https://github.com/${portfolioData.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="telemetry-profile-btn"
            >
              <Github className="icon-sm-accent" aria-hidden="true" />
              <span>@{portfolioData.githubUsername}</span>
              <ExternalLink className="icon-xs" aria-hidden="true" />
            </a>
          </header>
        </ScrollReveal>

        {/* Analytics Grid */}
        <div className="telemetry-bento-grid">
          
          {/* Key Metrics Cards */}
          <div className="telemetry-kpi-grid">
            <ScrollReveal direction="up" delay={0.15}>
              <article className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-icon-well">
                    <Code2 className="icon-sm" aria-hidden="true" />
                  </div>
                  <span className="kpi-tag">Live API</span>
                </div>
                <div>
                  <p className="kpi-metric-lg">
                    {typeof user?.public_repos === 'number' ? user.public_repos : activeRepos.length}
                  </p>
                  <p className="kpi-caption">Public Repos</p>
                </div>
              </article>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <article className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-icon-well">
                    <Terminal className="icon-sm" aria-hidden="true" />
                  </div>
                  <span className="kpi-tag">Primary</span>
                </div>
                <div>
                  <p className="kpi-metric-md">
                    {primaryLang}
                  </p>
                  <p className="kpi-caption">Top Stack</p>
                </div>
              </article>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.25}>
              <article className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-icon-well">
                    <Calendar className="icon-sm" aria-hidden="true" />
                  </div>
                  <span className="kpi-tag">Weekly</span>
                </div>
                <div>
                  <p suppressHydrationWarning className="kpi-metric-lg">
                    {weeklyContributions}
                  </p>
                  <p className="kpi-caption">Weekly Commits</p>
                </div>
              </article>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <article className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-icon-well">
                    <Activity className="icon-sm" aria-hidden="true" />
                  </div>
                  <span className="kpi-tag">Dev Status</span>
                </div>
                <div>
                  <p suppressHydrationWarning className={`kpi-caption ${devStatus.textColor}`}>
                    <span className="memoji-status-indicator" style={{ marginRight: '0.375rem', verticalAlign: 'middle' }}>
                      {devStatus.isPulsing && (
                        <span className={`memoji-status-ping ${devStatus.bgColor}`} />
                      )}
                      <span className={`memoji-status-dot ${devStatus.bgColor}`} />
                    </span>
                    <span>{devStatus.label}</span>
                  </p>
                  <p className="kpi-caption">GitHub Stream</p>
                </div>
              </article>
            </ScrollReveal>
          </div>

          {/* Languages Breakdown */}
          <div className="telemetry-col">
            <ScrollReveal direction="up" delay={0.25}>
              <article className="surface-panel">
                <div>
                  <div className="panel-header-row">
                    <h3 className="panel-heading">
                      <Code2 className="icon-sm-accent" aria-hidden="true" />
                      <span>Code Languages Breakdown</span>
                    </h3>
                    <span className="kpi-tag">
                      {activeRepos.length} Repos
                    </span>
                  </div>

                  {languagesList.length > 0 ? (
                    <div>
                      {/* GitHub-style Multi-Segmented Language Distribution Bar */}
                      <div className="lang-segmented-bar">
                        {languagesList.map((item) => (
                          <div
                            key={item.lang}
                            style={{
                              width: `${Math.max(item.percent, 3)}%`,
                              backgroundColor: item.color,
                            }}
                            title={`${item.lang}: ${item.percent}% (${item.count} repos)`}
                          />
                        ))}
                      </div>

                      {/* Individual Language Bars */}
                      <ul className="lang-breakdown-list">
                        {languagesList.map((item) => (
                          <li key={item.lang}>
                            <div>
                              <span>
                                <i style={{ backgroundColor: item.color }} aria-hidden="true" />
                                <strong>{item.lang}</strong>
                              </span>
                              <small>
                                <span>{item.count} {item.count === 1 ? 'repo' : 'repos'}</span>
                                <strong>{item.percent}%</strong>
                              </small>
                            </div>
                            <div role="progressbar" aria-valuenow={item.percent} aria-valuemin={0} aria-valuemax={100} aria-label={`${item.lang} repository share`}>
                              <span
                                style={{
                                  width: `${Math.max(item.percent, 4)}%`,
                                  backgroundColor: item.color,
                                  boxShadow: `0 0 8px ${item.color}50`,
                                }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="kpi-caption">Python, TypeScript, SQL, C++, HTML/CSS</p>
                  )}
                </div>

                <footer className="panel-footer-row">
                  <span>Stack Distribution</span>
                  <span>Updated in real-time</span>
                </footer>
              </article>
            </ScrollReveal>
          </div>

          {/* Recent Repositories List */}
          <div className="telemetry-col">
            <ScrollReveal direction="up" delay={0.35}>
              <article className="surface-panel">
                <div>
                  <div className="panel-header-row">
                    <h3 className="panel-heading">
                      <GitBranch className="icon-sm-accent" aria-hidden="true" />
                      <span>Recent Repositories</span>
                    </h3>
                  </div>

                  {recentRepos.length > 0 ? (
                    <ul className="recent-repos-list">
                      {recentRepos.map((repo) => (
                        <li key={repo.name}>
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div>
                              <strong>{repo.name}</strong>
                              <p>{repo.description || 'Data science & AI project repository'}</p>
                            </div>
                            <span>{repo.language || 'Code'}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="recent-repos-list">
                      <li className="kpi-caption">transformi</li>
                      <li className="kpi-caption">daily-motivation</li>
                      <li className="kpi-caption">twitter-scraping-ai</li>
                    </ul>
                  )}
                </div>

                <footer className="panel-footer-row">
                  <span>GitHub API v3</span>
                  <a
                    href={`https://github.com/${portfolioData.githubUsername}?tab=repositories`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-action-secondary"
                  >
                    <span>View all</span>
                    <ExternalLink className="icon-xs-accent" aria-hidden="true" />
                  </a>
                </footer>
              </article>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
