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
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ExperienceMatrix({ isTerminalMode }: { isTerminalMode: boolean }) {
  const [terminalCommand, setTerminalCommand] = useState<string>('whoami');
  const [customInput, setCustomInput] = useState<string>('');

  const items = portfolioData.experience;

  const getIconForType = (item: ExperienceItem) => {
    if (item.type === 'education') return <GraduationCap className="w-5 h-5 text-cyan-400" />;
    if (item.id === 'exp-handshake-ai') return <Cpu className="w-5 h-5 text-indigo-400" />;
    if (item.id === 'exp-verizon') return <Award className="w-5 h-5 text-amber-400" />;
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

  return (
    <section className="py-16 sm:py-24 relative" id="experience-matrix">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-line">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider">
                <Workflow className="w-3.5 h-3.5 text-ember" />
                Career &amp; Academic Trajectory
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-bold text-bone tracking-tight">
                Work Experience &amp; Education
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">
              {items.length} Verified Milestones
            </span>
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
                <span className="text-muted">Quick run:</span>
                {[
                  { cmd: 'whoami', label: 'whoami' },
                  { cmd: 'tree', label: 'tree (career)' },
                  { cmd: 'git log', label: 'git log' },
                  { cmd: 'stack', label: 'cat stack.txt' },
                  { cmd: 'status', label: 'status' },
                  { cmd: 'help', label: 'help' },
                ].map((item) => (
                  <button
                    key={item.cmd}
                    onClick={() => {
                      setTerminalCommand(item.cmd);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      terminalCommand.startsWith(item.cmd)
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-ink border border-line text-muted hover:text-bone'
                    }`}
                  >
                    $ {item.label}
                  </button>
                ))}
              </div>

              {/* Terminal Body */}
              <div className="p-6 text-xs text-bone-dim leading-relaxed overflow-x-auto max-h-[550px] space-y-4">
                <div className="text-muted">
                  <span className="text-emerald-400">➜</span> <span className="text-cyan-400">~/work</span>{' '}
                  <span className="text-amber-400 font-semibold">$ {terminalCommand}</span>
                </div>

                {/* whoami / summary */}
                {(terminalCommand === 'whoami' || terminalCommand === 'summary') && (
                  <pre className="text-cyan-300 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap">
{`┌────────────────────────────────────────────────────────────────────────┐
│ ishaankor@portfolio-vm                                                 │
├────────────────────────────────────────────────────────────────────────┤
│ Developer:   Ishaan Koradia                                            │
│ Focus:       Frontier LLM Evaluation & Agentic Architecture (MCP)      │
│ Status:      Available for AI/ML Engineering Roles                     │
│ Education:   UC San Diego — B.S. Cognitive Science (ML Specialization) │
│ Honors:      UCSD Honors (GPA 3.76) | Verizon Innovation (#1 of 15)    │
│ Production:  Handshake AI & NVIDIA Nemotron-12B Evaluation (~95% Acc)  │
│ Core Stack:  Python, PyTorch, FastAPI, FastMCP, OpenCV, Docker, GCP    │
└────────────────────────────────────────────────────────────────────────┘`}
                  </pre>
                )}

                {/* tree */}
                {terminalCommand.startsWith('tree') && (
                  <pre className="text-emerald-300 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap">
{`~/career
├── 📁 01_work/
│   ├── 📄 handshake-ai/    [Oct 2025 – Present] AI Engineer (Nemotron-12B, ~95% Acc)
│   │   ├── golden-baselines.json
│   │   ├── instruction-tuning.py
│   │   └── rlhf-benchmarks.yaml
│   └── 📄 verizon/         [Jul 2021 – Aug 2021] Project Engineer Intern (Ranked #1 of 15)
│       ├── opencv-pipeline.py
│       └── environmental-ml.onnx
├── 📁 02_education/
│   └── 🎓 ucsd/            [2023 – 2025] B.S. Cognitive Science (Machine Learning)
│       ├── transcript-gpa-3.76.pdf
│       ├── neural-computation-models/
│       └── ds3-student-society/
└── 📁 03_credentials/
    ├── 🏅 ibm-ai/          AI Engineer for Data Scientists (PyTorch, MLOps, SQL)
    ├── 🏅 anthropic-mcp/   Model Context Protocol: Advanced Topics (FastMCP, SSE)
    └── 🏅 google-it/       Google IT Automation with Python (Linux, Bash, Git)

3 directories, 8 files`}
                  </pre>
                )}

                {/* git log */}
                {terminalCommand.startsWith('git') && (
                  <pre className="text-amber-300 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap">
{`* 8f4a21e (HEAD -> main, origin/main) feat(eval): Handshake AI & NVIDIA Nemotron-12B benchmarks (~95% acc)
* 4c19d02 feat(degree): Graduate UC San Diego B.S. Cognitive Science ML specialization (GPA 3.76)
* 1b82e44 feat(innovation): Verizon OpenCV real-time environmental detection (Ranked #1 of 15 Teams)
* 0a73f18 init(career): career trajectory repository initialized`}
                  </pre>
                )}

                {/* stack / cat stack.txt */}
                {(terminalCommand === 'stack' || terminalCommand === 'cat stack.txt') && (
                  <pre className="text-purple-300 font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap">
{`+---------------+-------------------------------------------------------------------------+
| DOMAIN        | CORE TECHNOLOGIES & TOOLS                                               |
+---------------+-------------------------------------------------------------------------+
| 01_Work       | Python, FastAPI, NVIDIA Nemotron-12B, OpenCV, Docker, Linux/Bash, GCP  |
| 02_Education  | PyTorch, C++, Java, scikit-learn, NumPy, Pandas, Linear Algebra, SQL    |
| 03_Credential | Model Context Protocol (MCP), FastMCP, MLOps, Pytest, Puppet, Bash      |
+---------------+-------------------------------------------------------------------------+`}
                  </pre>
                )}

                {/* status */}
                {terminalCommand === 'status' && (
                  <pre className="text-bone font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap">
{`SYSTEM INTEGRITY & PRODUCTION CHECK:
────────────────────────────────────────────────────────────────────────
 [✓ ACTIVE]     Handshake AI (AI Engineer)            --> Production Evaluation Live (~95% Acc)
 [✓ VERIFIED]   Verizon Engineering Internship        --> Ranked #1 of 15 Teams (Innovation Award)
 [✓ VERIFIED]   UC San Diego B.S. Cognitive Science   --> Degree Conferred, GPA 3.76 Confirmed
 [✓ ACCREDITED] IBM AI Engineer Associate             --> Verified Credential
 [✓ ACCREDITED] Anthropic Model Context Protocol      --> Verified Credential
 [✓ ACCREDITED] Google IT Automation with Python      --> Verified Credential
────────────────────────────────────────────────────────────────────────
All credentials production verified. Zero drift detected.`}
                  </pre>
                )}

                {/* help */}
                {terminalCommand === 'help' && (
                  <pre className="text-bone-dim font-mono text-[0.75rem] leading-relaxed whitespace-pre-wrap">
{`Available CLI commands:
  whoami        - Print developer identity & career overview
  tree          - Display Unix directory tree of career milestones
  git log       - Show git commit timeline and milestone hashes
  stack         - Display ASCII comparison table of technologies by domain
  status        - Run integrity & credential verification checks
  clear         - Reset terminal output
  help          - Display this command reference`}
                  </pre>
                )}

                {/* clear */}
                {terminalCommand === 'clear' && (
                  <p className="text-muted italic">Terminal cleared. Type &apos;help&apos; or click a button above.</p>
                )}

                {/* Unrecognized fallback */}
                {!['whoami', 'summary', 'tree', 'git', 'stack', 'cat stack.txt', 'status', 'help', 'clear'].some((k) =>
                  terminalCommand.startsWith(k)
                ) && (
                  <div className="space-y-1 text-xs">
                    <p className="text-rose-400">zsh: command not found: {terminalCommand}</p>
                    <p className="text-muted">Type &apos;help&apos; or click one of the quick run buttons above.</p>
                  </div>
                )}

                {/* Interactive Shell Prompt Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!customInput.trim()) return;
                    setTerminalCommand(customInput.trim().toLowerCase());
                    setCustomInput('');
                  }}
                  className="flex items-center gap-2 pt-4 border-t border-line/50 text-xs font-mono"
                >
                  <span className="text-emerald-400">➜</span>
                  <span className="text-cyan-400">~/work</span>
                  <span className="text-amber-400 font-semibold">$</span>
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="type command (whoami, tree, git log, stack, status, help)..."
                    className="flex-1 bg-transparent border-none text-bone placeholder-muted/50 focus:outline-none font-mono text-xs"
                  />
                  <button
                    type="submit"
                    className="px-2 py-0.5 rounded bg-surface border border-line text-[10px] text-muted hover:text-bone"
                  >
                    run ↵
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        ) : (
          /* Visual Architecture View */
          <div className="space-y-8">
            {items.map((item, idx) => (
              <ScrollReveal key={item.id} direction="up" delay={0.1 + idx * 0.08}>
                <div
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
              </ScrollReveal>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
