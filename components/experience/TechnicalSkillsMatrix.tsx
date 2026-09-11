'use client';

import React from 'react';
import {
  Terminal,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function TechnicalSkillsMatrix() {
  // Grounded, concise tech stack grouped cleanly by Work, Education, and Certification
  const stackCards = [
    {
      id: 'work',
      categoryLabel: '01 // Work & Industry',
      title: 'Production AI & Engineering',
      subtitle: 'Handshake AI & Verizon',
      badge: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
      icon: <Briefcase className="w-4 h-4 text-indigo-400" />,
      highlight: 'Production Verified',
      technologies: [
        'Python',
        'FastAPI',
        'NVIDIA Nemotron-12B',
        'OpenCV',
        'Docker',
        'Linux / Bash',
        'Google Cloud Platform',
        'Git & GitHub',
        'Asyncio',
      ],
      practices: [
        'Frontier LLM Evaluation',
        'Golden Benchmark Datasets',
        'Instruction Tuning',
        'RLHF Optimization',
        'Real-Time Computer Vision',
      ],
    },
    {
      id: 'education',
      categoryLabel: '02 // Academic Foundation',
      title: 'ML Theory & Scientific Computing',
      subtitle: 'UC San Diego (GPA 3.76)',
      badge: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
      icon: <GraduationCap className="w-4 h-4 text-cyan-400" />,
      highlight: 'B.S. Cognitive Science ML',
      technologies: [
        'PyTorch',
        'TensorFlow',
        'scikit-learn',
        'NumPy',
        'Pandas',
        'Matplotlib',
        'C++',
        'Java',
        'SQL',
      ],
      practices: [
        'Machine Learning Algorithms',
        'Neural Computation & Networks',
        'Deep Learning Pipelines',
        'Data Structures & Algorithms',
        'Statistical Modeling & Regression',
        'Linear Algebra',
      ],
    },
    {
      id: 'certification',
      categoryLabel: '03 // Industry Accreditations',
      title: 'Protocols, MLOps & Systems',
      subtitle: 'IBM, Anthropic & Google',
      badge: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      highlight: '3 Industry Accreditations',
      technologies: [
        'Model Context Protocol (MCP)',
        'FastMCP SDK',
        'PyTorch',
        'PostgreSQL',
        'Pytest',
        'Puppet',
        'Bash Automation',
        'Regex',
      ],
      practices: [
        'MLOps Pipelines',
        'Stdio / SSE / HTTP Transports',
        'Security Guardrails & Sampling',
        'System Administration & SSH',
        'Unit & Integration Testing',
      ],
    },
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-line/60 relative" id="skills-stack">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-10">
        
        {/* Clean Section Header (No search or filter bars) */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="pb-6 border-b border-line space-y-1">
            <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-ember" />
              Technical Stack &amp; Tools
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-bone tracking-tight">
              Grounded Technical Stack
            </h2>
            <p className="text-muted text-xs sm:text-sm font-mono pt-1">
              Core technologies and engineering practices across Work, Education, and Certifications.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Grounded Stack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stackCards.map((card, idx) => (
            <ScrollReveal key={card.id} direction="up" delay={0.15 + idx * 0.08}>
              <div className="rounded-xl border border-line bg-surface/70 p-6 shadow-panel flex flex-col justify-between h-full hover:border-line/90 transition-colors">
                <div className="space-y-4">
                  {/* Category Pill & Icon */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[0.68rem] font-mono font-semibold border ${card.badge}`}>
                      {card.categoryLabel}
                    </span>
                    <div className="p-1.5 rounded-lg bg-ink border border-line">
                      {card.icon}
                    </div>
                  </div>

                  {/* Card Title & Subtitle */}
                  <div>
                    <h3 className="font-display text-lg font-bold text-bone">
                      {card.title}
                    </h3>
                    <p className="font-mono text-xs text-muted mt-0.5">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Core Tools & Languages */}
                  <div>
                    <span className="text-[0.68rem] font-mono uppercase tracking-wider text-muted font-semibold block mb-2">
                      Core Tools &amp; Languages
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {card.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded font-mono text-xs bg-ink border border-line text-bone-dim hover:text-bone transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Applied Focus Areas */}
                  <div>
                    <span className="text-[0.68rem] font-mono uppercase tracking-wider text-muted font-semibold block mb-2">
                      Applied Focus Areas
                    </span>
                    <ul className="space-y-1 text-xs text-bone-dim/90 font-mono">
                      {card.practices.map((practice, pIdx) => (
                        <li key={pIdx} className="flex items-center gap-1.5">
                          <span className="text-ember">›</span>
                          <span>{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Tag */}
                <div className="mt-6 pt-3 border-t border-line/60 flex items-center justify-between font-mono text-[0.68rem] text-muted">
                  <span>{card.highlight}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
