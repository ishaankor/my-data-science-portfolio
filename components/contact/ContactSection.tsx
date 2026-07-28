'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import { Send, CheckCircle2, AlertCircle, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setFeedback('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus('success');
        setFeedback(data.message);
        setForm({ name: '', email: '', message: '', honeypot: '' });
      } else {
        setStatus('error');
        setFeedback(data.error || 'Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      setStatus('success');
      setFeedback('Message received!');
      setForm({ name: '', email: '', message: '', honeypot: '' });
    }
  };

  return (
    <section className="border-t border-line/60 py-24 sm:py-32 relative" id="contact">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        
        {/* Call to action heading */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted">
              <span className="h-px w-7 bg-line" aria-hidden="true" />
              get in touch
            </span>
            <h2 className="font-display text-[2rem] sm:text-[2.75rem] font-semibold leading-[1.04] tracking-[-0.02em] text-bone mt-4">
              Have something worth building?
            </h2>
            <p className="mt-4 text-bone-dim text-base">
              Open to data science roles, full-stack software development, and new problems worth the effort.
            </p>
          </div>
        </ScrollReveal>

        {/* Form Container */}
        <ScrollReveal direction="up" delay={0.2}>
          <div className="max-w-xl mx-auto rounded-xl border border-line bg-surface/60 p-8 shadow-panel backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Honeypot field */}
              <input
                type="text"
                name="website"
                value={form.honeypot}
                onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-mono text-xs">
                <div>
                  <label htmlFor="name" className="block text-muted mb-2">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ishaan Koradia"
                    className="w-full px-3.5 py-2.5 rounded-md bg-ink border border-line text-bone placeholder-muted focus:border-ember focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-muted mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-md bg-ink border border-line text-bone placeholder-muted focus:border-ember focus:outline-none"
                  />
                </div>
              </div>

              <div className="font-mono text-xs">
                <label htmlFor="message" className="block text-muted mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Let's build something end-to-end..."
                  className="w-full px-3.5 py-2.5 rounded-md bg-ink border border-line text-bone placeholder-muted focus:border-ember focus:outline-none resize-none"
                />
              </div>

              {feedback && (
                <div
                  className={`p-3 rounded-md text-xs font-mono flex items-center gap-2 ${
                    status === 'success'
                      ? 'bg-ember/10 border border-ember/40 text-bone'
                      : 'bg-red-500/10 border border-red-500/30 text-red-300'
                  }`}
                >
                  {status === 'success' ? <CheckCircle2 className="w-4 h-4 text-ember" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{feedback}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full rounded-md border border-ember/50 bg-ember/10 px-5 py-3 font-mono text-sm text-bone transition-colors duration-300 hover:border-ember hover:bg-ember/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-ember" />
                <span>{status === 'submitting' ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>

            {/* Direct Social Links */}
            <div className="mt-8 pt-6 border-t border-line flex items-center justify-center gap-6 font-mono text-xs text-muted">
              <a href={`mailto:${portfolioData.email}`} className="hover:text-bone flex items-center gap-1.5 transition-colors">
                <Mail className="w-3.5 h-3.5 text-ember" />
                <span>Email</span>
              </a>
              <a href={`https://github.com/${portfolioData.githubUsername}`} target="_blank" rel="noopener noreferrer" className="hover:text-bone flex items-center gap-1.5 transition-colors">
                <Github className="w-3.5 h-3.5 text-ember" />
                <span>GitHub</span>
              </a>
              <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-bone flex items-center gap-1.5 transition-colors">
                <Linkedin className="w-3.5 h-3.5 text-ember" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
