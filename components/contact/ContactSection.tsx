'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import { Mail, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '', // Spam prevention
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honeypot) return; // Silent discard for bots

    setStatus('submitting');
    setErrorMessage('');

    try {
      // Direct mailto fallback or API route if serverless endpoint is active
      const mailtoUrl = `mailto:${portfolioData.email}?subject=${encodeURIComponent(
        `Portfolio Contact from ${formData.name}`
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;

      window.location.href = mailtoUrl;
      setStatus('success');
      setFormData({ name: '', email: '', message: '', honeypot: '' });
    } catch (err: any) {
      console.error('Contact submit error:', err);
      setStatus('error');
      setErrorMessage('Could not launch email client automatically. Please email directly.');
    }
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ember/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 relative z-10 space-y-12">
        {/* Top Telemetry Path & Status Tag */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-muted">
              <span className="text-bone">04 // COMMUNICATIONS &amp; DISPATCH</span>
              <span className="text-line">/</span>
              <span className="text-ember">CHANNELS OPEN</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-line font-mono text-xs text-bone-dim">
              <span>Direct Inquiries Open</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ember/10 border border-ember/30 text-ember font-mono text-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-bone tracking-tight">
              Let&apos;s Build Something <span className="text-ember">Great.</span>
            </h2>
            <p className="mt-4 text-bone-dim text-sm sm:text-base leading-relaxed">
              Have an exciting project, AI/ML opportunity, or web automation challenge? Send me a message below or email me directly at{' '}
              <a href={`mailto:${portfolioData.email}`} className="text-ember underline hover:text-ember/80 font-mono">
                {portfolioData.email}
              </a>.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          {/* Left Column: Direct Contact Details */}
          <ScrollReveal direction="right" delay={0.2} className="lg:col-span-5 space-y-6 font-mono text-xs">
            <div className="p-6 rounded-xl border border-line bg-surface/80 shadow-panel space-y-6">
              <h3 className="font-display text-lg font-bold text-bone border-b border-line pb-3">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-ink border border-line text-ember shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-muted block text-[0.68rem] uppercase tracking-wider mb-0.5">Email</span>
                    <a href={`mailto:${portfolioData.email}`} className="text-bone hover:text-ember transition-colors font-semibold text-sm">
                      {portfolioData.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-line bg-surface/40 text-muted space-y-2">
              <span className="text-ember font-bold block text-sm">⚡ Quick Response Guaranteed</span>
              <p className="text-[0.75rem] leading-relaxed">
                I typically respond to inquiries within 24 hours. Looking forward to discussing your ideas!
              </p>
            </div>
          </ScrollReveal>

          {/* Right Column: Contact Form */}
          <ScrollReveal direction="left" delay={0.2} className="lg:col-span-7">
            <div className="p-8 rounded-xl border border-line bg-surface shadow-panel relative">
              <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
                {/* Honeypot field for spam prevention */}
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
                      Your Name <span className="text-ember">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-ink border border-line text-bone placeholder:text-muted focus:border-ember focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-bone text-xs font-semibold">
                      Your Email <span className="text-ember">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-ink border border-line text-bone placeholder:text-muted focus:border-ember focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-bone text-xs font-semibold">
                    Your Message <span className="text-ember">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Tell me about your project, timeline, or inquiry..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-ink border border-line text-bone placeholder:text-muted focus:border-ember focus:outline-none transition-colors resize-none"
                  />
                </div>

                {status === 'success' && (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Launching your email client to send message... Thank you!</span>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 rounded-lg border border-ember bg-ember text-ink font-bold hover:bg-ember/90 transition-all flex items-center justify-center gap-2 text-xs shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {status === 'submitting' ? (
                    <span>Sending Message...</span>
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
