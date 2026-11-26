'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import {
  Mail,
  Send,
  CheckCircle2,
  Github,
  Linkedin,
  ArrowUpRight,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'fallback';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });

  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDraft, setCopiedDraft] = useState(false);

  const copyToClipboard = async (text: string, type: 'email' | 'draft') => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedDraft(true);
      setTimeout(() => setCopiedDraft(false), 2200);
    }
  };

  const subjectLine = `Portfolio message from ${formData.name || 'Visitor'}`;
  const formattedBody = `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`;

  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    portfolioData.email
  )}&su=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(formattedBody)}`;

  const mailtoUrl = `mailto:${portfolioData.email}?subject=${encodeURIComponent(
    subjectLine
  )}&body=${encodeURIComponent(formattedBody)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return;

    setStatus('submitting');

    try {
      const web3FormsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
      const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

      let res: Response;

      if (web3FormsKey) {
        res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            access_key: web3FormsKey,
            subject: subjectLine,
            from_name: formData.name,
            email: formData.email,
            message: formData.message,
          }),
        });
      } else if (formspreeId) {
        res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            _subject: subjectLine,
            message: formData.message,
          }),
        });
      } else {
        res = await fetch(`https://formsubmit.co/ajax/${portfolioData.email}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            _subject: subjectLine,
            _template: 'table',
            _captcha: 'false',
            message: formData.message,
          }),
        });
      }

      const data = await res.json().catch(() => null);
      const isDelivered =
        res.ok &&
        data !== null &&
        data.success !== false &&
        data.success !== 'false';

      if (isDelivered) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '', honeypot: '' });
      } else {
        setStatus('fallback');
      }
    } catch {
      setStatus('fallback');
    }
  };

  const socialChannels = [
    {
      name: 'LinkedIn',
      value: 'linkedin.com/in/ishaankoradia',
      href: portfolioData.linkedin,
      icon: Linkedin,
      detail: 'Professional network & messaging',
    },
    {
      name: 'GitHub',
      value: `github.com/${portfolioData.githubUsername}`,
      href: `https://github.com/${portfolioData.githubUsername}`,
      icon: Github,
      detail: 'Open source work & commits',
    },
  ];

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10 space-y-12">
        <ScrollReveal direction="up" delay={0.05}>
          <div className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-muted">
            <span className="text-bone">04 // CONTACT</span>
            <span className="text-line">/</span>
            <span className="text-ember">COMMUNICATION CHANNEL</span>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-bone tracking-tight">
              Get in touch.
            </h2>
            <p className="mt-4 text-bone-dim text-sm sm:text-base leading-relaxed">
              Have a role in mind, a question about my work, or want to collaborate? Send a message below or copy my email directly.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          {/* Left Column: Contact Channels */}
          <ScrollReveal direction="right" delay={0.2} className="lg:col-span-5 font-mono text-xs">
            <div className="p-6 rounded-xl border border-line bg-surface/80 shadow-panel space-y-6">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h3 className="font-display text-lg font-bold text-bone">
                  Contact Information
                </h3>
                <span className="text-[0.65rem] text-muted uppercase tracking-wider font-mono">
                  Direct
                </span>
              </div>

              <div className="space-y-3">
                {/* Email Card: Click to copy + subtle mailto link */}
                <div className="group flex items-start gap-3.5 p-3.5 rounded-lg border border-line/70 bg-ink/60 hover:border-ember/60 hover:bg-ink transition-all duration-200">
                  <div className="p-2.5 rounded-lg bg-surface border border-line text-ember shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="text-muted text-[0.68rem] uppercase tracking-wider font-mono">
                        Email
                      </span>
                      <a
                        href={`mailto:${portfolioData.email}`}
                        className="text-[0.65rem] text-muted hover:text-bone inline-flex items-center gap-0.5 transition-colors"
                        title="Open mail client"
                      >
                        <span>Open mail</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(portfolioData.email, 'email')}
                      className="w-full text-left cursor-pointer"
                    >
                      <span className="text-bone font-semibold text-sm truncate block group-hover:text-ember transition-colors">
                        {portfolioData.email}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[0.68rem] text-muted mt-0.5">
                        {copiedEmail ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied to clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Click to copy</span>
                          </>
                        )}
                      </span>
                    </button>
                  </div>
                </div>

                {socialChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <a
                      key={channel.name}
                      href={channel.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3.5 p-3.5 rounded-lg border border-line/70 bg-ink/60 hover:border-ember/60 hover:bg-ink transition-all duration-200"
                    >
                      <div className="p-2.5 rounded-lg bg-surface border border-line text-ember shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-muted text-[0.68rem] uppercase tracking-wider font-mono">
                            {channel.name}
                          </span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-muted group-hover:text-ember group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                        </div>
                        <span className="text-bone font-semibold text-sm truncate block group-hover:text-ember transition-colors">
                          {channel.value}
                        </span>
                        <p className="text-[0.68rem] text-muted truncate mt-0.5">
                          {channel.detail}
                        </p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Contact Form */}
          <ScrollReveal direction="left" delay={0.2} className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-xl border border-line bg-surface shadow-panel relative">
              <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-bone text-xs font-semibold">
                      Name <span className="text-ember">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Alex Morgan"
                      value={formData.name}
                      onChange={(e) => {
                        if (status !== 'idle') setStatus('idle');
                        setFormData({ ...formData, name: e.target.value });
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-ink border border-line text-bone placeholder:text-muted focus:border-ember focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-bone text-xs font-semibold">
                      Email <span className="text-ember">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        if (status !== 'idle') setStatus('idle');
                        setFormData({ ...formData, email: e.target.value });
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-ink border border-line text-bone placeholder:text-muted focus:border-ember focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-bone text-xs font-semibold">
                    Message <span className="text-ember">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="What are you working on?"
                    value={formData.message}
                    onChange={(e) => {
                      if (status !== 'idle') setStatus('idle');
                      setFormData({ ...formData, message: e.target.value });
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-ink border border-line text-bone placeholder:text-muted focus:border-ember focus:outline-none transition-colors resize-none"
                  />
                </div>

                {status === 'success' && (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Message sent — thanks for reaching out.</span>
                  </div>
                )}

                {status === 'fallback' && (
                  <div className="p-4 rounded-lg bg-ink border border-line space-y-3 text-xs">
                    <p className="text-bone-dim font-sans">
                      Direct form relay couldn&apos;t connect. Your draft is still here—send it directly with one click:
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      <a
                        href={gmailComposeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-bone text-ink font-semibold hover:bg-white transition-colors"
                      >
                        <span>Open in Gmail</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            `To: ${portfolioData.email}\nSubject: ${subjectLine}\n\n${formattedBody}`,
                            'draft'
                          )
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-line bg-surface text-bone hover:border-line/80 transition-colors cursor-pointer"
                      >
                        {copiedDraft ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy draft</span>
                          </>
                        )}
                      </button>

                      <a
                        href={mailtoUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-line bg-surface text-muted hover:text-bone transition-colors"
                      >
                        <span>Mail app</span>
                      </a>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 rounded-lg border border-line bg-bone text-ink font-bold hover:bg-white transition-all flex items-center justify-center gap-2 text-xs shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {status === 'submitting' ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
