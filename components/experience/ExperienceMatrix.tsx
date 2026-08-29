'use client';

import React, { useState } from 'react';
import { portfolioData, ExperienceItem } from '@/data/portfolio';
import {
  Briefcase,
  GraduationCap,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  ExternalLink,
  Github,
  Cpu,
  Terminal,
  Workflow,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ExperienceMatrix({ isTerminalMode }: { isTerminalMode: boolean }) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'work' | 'project' | 'education'>('all');
  const [terminalCommand, setTerminalCommand] = useState<string>('cat resume.json');

  const filteredItems = portfolioData.experience.filter((item) => {
    if (selectedFilter === 'all') return true;
    return item.type === selectedFilter;
  });

  const getIconForType = (item: ExperienceItem) => {
    if (item.type === 'education') return <GraduationCap className="w-5 h-5 text-cyan-400" />;
    if (item.id === 'exp-handshake-ai') return <Cpu className="w-5 h-5 text-indigo-400" />;
    if (item.id === 'exp-verizon') return <Award className="w-5 h-5 text-amber-400" />;
    if (item.type === 'project') return <Workflow className="w-5 h-5 text-ember" />;
    return <Briefcase className="w-5 h-5 text-ember" />;
  };

  const getBorderTheme = (item: ExperienceItem) => {
    if (item.id === 'exp-handshake-ai') return 'border-indigo-500/30 hover:border-indigo-500/60 shadow-indigo-500/5';
    if (item.id === 'exp-verizon') return 'border-amber-500/30 hover:border-amber-500/60 shadow-amber-500/5';
    if (item.type === 'education') return 'border-cyan-500/30 hover:border-cyan-500/60 shadow-cyan-500/5';
    return 'border-line hover:border-ember/50 shadow-panel';
  };

  const getBadgeColor = (item: ExperienceItem) => {
    if (item.id === 'exp-handshake-ai') return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
    if (item.id === 'exp-verizon') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    if (item.type === 'education') return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    return 'bg-ember/10 text-ember border-ember/30';
  };

  // Sync tab filter clicks with terminal command when in CLI mode
  const handleTabClick = (tabId: 'all' | 'work' | 'project' | 'education') => {
    setSelectedFilter(tabId);
    if (tabId === 'all') setTerminalCommand('cat resume.json');
    else if (tabId === 'work') setTerminalCommand('cat experience_work.json');
    else if (tabId === 'project') setTerminalCommand('cat ai_systems.json');
    else if (tabId === 'education') setTerminalCommand('cat academics_ucsd.json');
  };

  return (
    <section className="py-16 sm:py-24 relative" id="experience-matrix">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-10">
        
        {/* Section Header & Interactive Filter Bar */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-line">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider">
                <Workflow className="w-3.5 h-3.5 text-ember" />
                Technical Trajectory &amp; Operations
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-bone tracking-tight">
                {selectedFilter === 'all'
                  ? 'All Career Operations'
                  : selectedFilter === 'work'
                  ? 'Industry Experience & Contracts'
                  : selectedFilter === 'project'
                  ? 'Technical Systems & AI Platforms'
                  : 'Academics & Research'}
              </h2>
            </div>

            {/* Filter Pills with Counts */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              {[
                { id: 'all', label: 'All Operations', count: portfolioData.experience.length },
                {
                  id: 'work',
                  label: 'Work & Industry',
                  count: portfolioData.experience.filter((e) => e.type === 'work').length,
                },
                {
                  id: 'project',
                  label: 'AI Systems',
                  count: portfolioData.experience.filter((e) => e.type === 'project').length,
                },
                {
                  id: 'education',
                  label: 'Academics',
                  count: portfolioData.experience.filter((e) => e.type === 'education').length,
                },
              ].map((tab) => {
                const isActive = selectedFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id as any)}
                    className={`px-3.5 py-2 rounded-lg transition-all font-mono text-xs flex items-center gap-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-ember to-amber-500 text-ink font-bold shadow-md shadow-ember/25 transform scale-[1.02]'
                        : 'bg-surface border border-line text-muted hover:text-bone hover:border-line/90'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] ${
                        isActive ? 'bg-ink/30 text-ink font-extrabold' : 'bg-ink text-muted'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* CLI Terminal View Mode */}
        {isTerminalMode ? (
          <ScrollReveal direction="up" delay={0.15}>
            <div className="rounded-xl border border-indigo-500/30 bg-[#070b12] shadow-2xl overflow-hidden font-mono">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-ink/90">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs text-muted ml-2">ishaankor@portfolio: ~/work (zsh)</span>
                </div>

                <div className="flex items-center gap-2 text-[0.7rem] text-muted">
                  <span className="text-emerald-400">● live CLI session</span>
                  <span>UTF-8</span>
                </div>
              </div>

              {/* Command Shortcut Buttons */}
              <div className="px-4 py-2 bg-surface/40 border-b border-line flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted">Commands:</span>
                {[
                  { cmd: 'cat resume.json', label: 'All (resume.json)' },
                  { cmd: 'cat experience_work.json', label: 'Work (Handshake/Verizon)' },
                  { cmd: 'cat ai_systems.json', label: 'AI Systems (Datafy/IshaanBot)' },
                  { cmd: 'cat academics_ucsd.json', label: 'Academics (UCSD)' },
                  { cmd: 'git log --career', label: 'Git Timeline' },
                  { cmd: 'skills --verbose', label: 'Skills' },
                ].map((item) => (
                  <button
                    key={item.cmd}
                    onClick={() => {
                      setTerminalCommand(item.cmd);
                      if (item.cmd.includes('work')) setSelectedFilter('work');
                      else if (item.cmd.includes('ai_systems')) setSelectedFilter('project');
                      else if (item.cmd.includes('academics')) setSelectedFilter('education');
                      else if (item.cmd.includes('resume')) setSelectedFilter('all');
                    }}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      terminalCommand === item.cmd
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-ink border border-line text-muted hover:text-bone'
                    }`}
                  >
                    $ {item.cmd}
                  </button>
                ))}
              </div>

              {/* Terminal Body */}
              <div className="p-6 text-xs text-bone-dim leading-relaxed overflow-x-auto max-h-[550px] space-y-4">
                <div className="text-muted">
                  <span className="text-emerald-400">➜</span> <span className="text-cyan-400">~/work</span>{' '}
                  <span className="text-amber-400 font-semibold">$ {terminalCommand}</span>
                </div>

                {(terminalCommand === 'cat resume.json' ||
                  terminalCommand === 'cat experience_work.json' ||
                  terminalCommand === 'cat ai_systems.json' ||
                  terminalCommand === 'cat academics_ucsd.json') && (
                  <pre className="text-bone font-mono text-[0.75rem] leading-5 whitespace-pre-wrap">
                    {JSON.stringify(
                      {
                        categoryFilter: selectedFilter,
                        totalMatched: filteredItems.length,
                        operations: filteredItems.map((e) => ({
                          role: e.role,
                          organization: e.organization,
                          type: e.organizationType || e.type,
                          period: e.period,
                          location: e.location,
                          highlight: e.awardOrHighlight,
                          metrics: e.featuredMetric,
                          deliverables: e.description,
                          techStack: e.skills,
                        })),
                      },
                      null,
                      2
                    )}
                  </pre>
                )}

                {terminalCommand === 'git log --career' && (
                  <pre className="text-amber-300 font-mono text-[0.75rem] leading-5 whitespace-pre-wrap">
{`* commit 2026-08 (HEAD -> main) Lead Architect: Datafy! Agentic Visual Canvas (25k+ req/wk)
* commit 2025-10 AI Engineer: Handshake AI & NVIDIA Nemotron-12B Evaluation (~95% accuracy)
* commit 2025-07 Creator: IshaanBot MCP Architecture (15+ composable tools, FastAPI)
* commit 2025-06 Lead Systems: Transformi! ML Discord Bot (10k+ users served)
* commit 2023-09 UCSD B.S. in Cognitive Science (Machine Learning & Neural Computation, GPA 3.76)
* commit 2021-07 Verizon Project Engineer Intern (Ranked #1 of 15 Teams for Innovation)`}
                  </pre>
                )}

                {terminalCommand === 'skills --verbose' && (
                  <pre className="text-cyan-300 font-mono text-[0.75rem] leading-5 whitespace-pre-wrap">
{`[AI ECOSYSTEM] : ChatGPT, Gemini, Claude, GitHub Copilot, Sora, Quillbot, n8n
[TECH STACK]   : LangChain, Model Context Protocol (MCP), RAG, Prompt Engineering, RLHF
[LANGUAGES]    : Python, Java, Javascript, SQL, Postgres, HTML, CSS
[FRAMEWORKS]   : FastAPI, FastMCP, TensorFlow, Keras, scikit-learn, Selenium
[DEVOPS/TOOLS] : Docker, Linux, Bash, GCP, cronjob, Git, GitHub
[LIBRARIES]    : pandas, numpy, matplotlib, seaborn, OpenCV, asyncio`}
                  </pre>
                )}
              </div>
            </div>
          </ScrollReveal>
        ) : (
          /* Visual Architecture View with Smooth AnimatePresence */
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFilter}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="space-y-8"
            >
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border bg-surface/80 p-6 sm:p-8 transition-all duration-300 relative overflow-hidden group ${getBorderTheme(
                    item
                  )}`}
                >
                  {/* Subtle card top glow indicator */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-line/40 to-transparent group-hover:via-ember/50 transition-all" />

                  {/* Header Row: Role Title, Organization, Badge, Period */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-ink border border-line flex items-center justify-center shrink-0 shadow-sm">
                          {getIconForType(item)}
                        </div>

                        <div>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-bone group-hover:text-ember transition-colors">
                            {item.role}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs font-mono mt-1">
                            <span className="font-semibold text-bone-dim">{item.organization}</span>
                            <span className="text-muted">•</span>
                            <span className="text-muted flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-ember" />
                              {item.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right side Badges: Highlight Badge & Date */}
                    <div className="flex flex-wrap lg:flex-col lg:items-end gap-2 font-mono text-xs">
                      {item.awardOrHighlight && (
                        <span
                          className={`px-3 py-1 rounded-full border text-[0.7rem] font-bold inline-flex items-center gap-1.5 shadow-sm ${getBadgeColor(
                            item
                          )}`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{item.awardOrHighlight}</span>
                        </span>
                      )}

                      <span className="text-muted flex items-center gap-1.5 text-[0.72rem] bg-ink px-3 py-1 rounded-md border border-line/60">
                        <Calendar className="w-3 h-3 text-ember" />
                        <span>{item.period}</span>
                      </span>
                    </div>
                  </div>

                  {/* Technical Bullet Points with High-Signal Formatting */}
                  <ul className="space-y-3 mb-6">
                    {item.description.map((bullet, bIdx) => (
                      <li
                        key={bIdx}
                        className="text-bone-dim text-xs sm:text-sm leading-relaxed flex items-start gap-2.5"
                      >
                        <span className="text-ember font-bold mt-0.5 shrink-0 text-base leading-none">›</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Card Footer: Skills and Deliverables */}
                  <div className="pt-5 border-t border-line/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Skills pills */}
                    <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                      <span className="text-muted text-[0.68rem] mr-1">Stack:</span>
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 rounded bg-ink border border-line text-bone-dim hover:text-bone hover:border-line/90 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Metric or Link Shortcut */}
                    <div className="flex items-center gap-3 font-mono text-xs shrink-0">
                      {item.featuredMetric && (
                        <span className="text-[0.68rem] text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20 font-semibold">
                          {item.featuredMetric}
                        </span>
                      )}

                      {item.githubUrl && (
                        <a
                          href={item.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted hover:text-ember transition-colors inline-flex items-center gap-1"
                        >
                          <Github className="w-3.5 h-3.5" />
                          <span>Repository</span>
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

      </div>
    </section>
  );
}
