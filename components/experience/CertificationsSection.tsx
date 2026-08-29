'use client';

import React from 'react';
import { portfolioData } from '@/data/portfolio';
import { Award, ShieldCheck, CheckCircle2, Cpu, Terminal, Sparkles } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function CertificationsSection() {
  const certIcons = [
    <Cpu key="1" className="w-5 h-5 text-cyan-400" />,
    <Sparkles key="2" className="w-5 h-5 text-purple-400" />,
    <Terminal key="3" className="w-5 h-5 text-amber-400" />,
  ];

  const certGradients = [
    'from-cyan-500/10 via-sky-500/5 to-transparent border-cyan-500/30',
    'from-purple-500/10 via-indigo-500/5 to-transparent border-purple-500/30',
    'from-amber-500/10 via-orange-500/5 to-transparent border-amber-500/30',
  ];

  return (
    <section className="py-16 sm:py-20 border-t border-line/60 relative">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10 space-y-12">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-line">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-xs text-muted uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-ember" />
                Verified Credentials &amp; Specializations
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-bone tracking-tight">
                Industry Certifications &amp; Accreditations
              </h2>
            </div>

            <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/25 flex items-center gap-1.5 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>3 Verified Industry Credentials</span>
            </span>
          </div>
        </ScrollReveal>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {portfolioData.certifications.map((cert, idx) => (
            <ScrollReveal key={cert.id} direction="up" delay={0.15 + idx * 0.1}>
              <div
                className={`rounded-2xl border bg-surface/70 p-7 shadow-panel flex flex-col justify-between h-full hover:border-line/90 transition-all ${certGradients[idx]}`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-ink border border-line flex items-center justify-center shadow-sm">
                      {certIcons[idx]}
                    </div>
                    <span className="font-mono text-[0.68rem] text-muted bg-ink px-2.5 py-0.5 rounded border border-line/60">
                      Credential
                    </span>
                  </div>

                  {/* Title & Issuer */}
                  <h3 className="font-display text-lg font-bold text-bone mb-1.5 leading-snug">
                    {cert.title}
                  </h3>
                  {cert.issuer && (
                    <p className="font-mono text-xs text-ember font-semibold mb-4">
                      {cert.issuer}
                    </p>
                  )}

                  {/* Bullet Points */}
                  <ul className="space-y-2 mb-6">
                    {cert.description.map((desc, dIdx) => (
                      <li key={dIdx} className="text-bone-dim text-xs leading-relaxed flex items-start gap-2">
                        <span className="text-ember font-bold mt-0.5 shrink-0">›</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Footer */}
                <div className="pt-4 border-t border-line/60">
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded bg-ink border border-line text-muted"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>

      </div>
    </section>
  );
}
