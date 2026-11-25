'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Copy, Mail } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ClosingCtaSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(portfolioData.email);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = portfolioData.email;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section aria-labelledby="heading-closing-cta" className="section-boundary">
      <div className="section-container">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="section-eyebrow">
                <Mail className="eyebrow-icon" aria-hidden="true" />
                <span>get in touch</span>
              </span>
              <h2 id="heading-closing-cta" className="section-headline">
                Interested in working together?
              </h2>
              <p className="text-bone-dim text-sm leading-relaxed">
                Open to full-time AI and ML engineering roles, or just a good conversation about what you&apos;re building.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs shrink-0">
              <Link href="/contact" className="btn-primary-cta">
                <span>Send a note</span>
                <ArrowRight aria-hidden="true" />
              </Link>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="btn-secondary-cta cursor-pointer"
                aria-label="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 !text-emerald-400 shrink-0" aria-hidden="true" />
                    <span className="text-bone">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy aria-hidden="true" />
                    <span>{portfolioData.email}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
