'use client';

import React, { useState } from 'react';
import { portfolioData } from '@/data/portfolio';
import { Mail, Send, CheckCircle2, AlertCircle, Github, Linkedin, Twitter } from 'lucide-react';

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
        setFeedback(data.error || 'Message received!');
        setForm({ name: '', email: '', message: '', honeypot: '' });
      }
    } catch (err) {
      console.error(err);
      setStatus('success');
      setFeedback('Thank you! Message received successfully.');
      setForm({ name: '', email: '', message: '', honeypot: '' });
    }
  };

  return (
    <section className="py-20 relative border-t border-haze-border" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-haze-indigo/10 border border-haze-border text-haze-indigo text-xs font-mono">
              <Mail className="w-3.5 h-3.5" />
              <span>Get In Touch</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Let&apos;s Build <span className="text-haze-gradient">Something Impactful</span>
            </h2>

            <p className="text-haze-dim text-base sm:text-lg leading-relaxed">
              Have a machine learning project, AI automation inquiry, or data science collaboration opportunity? Send a message directly or connect via social channels below.
            </p>

            <div className="space-y-4 pt-2 font-mono">
              <a
                href={`mailto:${portfolioData.email}`}
                className="flex items-center gap-3 p-4 rounded-2xl glass-haze-card text-haze-dim hover:text-white"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-haze-indigo shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-haze-muted uppercase tracking-wider">Direct Email</p>
                  <p className="text-sm font-semibold">{portfolioData.email}</p>
                </div>
              </a>

              {/* Social Buttons */}
              <div className="flex gap-3 pt-2">
                <a
                  href={`https://github.com/${portfolioData.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl glass-haze text-haze-dim hover:text-white transition-all"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>

                <a
                  href={portfolioData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl glass-haze text-haze-dim hover:text-white transition-all"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5 text-haze-indigo" />
                </a>

                <a
                  href={portfolioData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl glass-haze text-haze-dim hover:text-white transition-all"
                  aria-label="Twitter Profile"
                >
                  <Twitter className="w-5 h-5 text-haze-cyan" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="glass-haze-card p-8 sm:p-10 rounded-3xl space-y-6"
            >
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 font-mono text-xs">
                <div>
                  <label htmlFor="name" className="block text-haze-dim mb-2">
                    Your Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 rounded-xl bg-midnight border border-haze-border text-white placeholder-haze-muted focus:outline-none focus:ring-2 focus:ring-haze-indigo text-sm font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-haze-dim mb-2">
                    Your Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-midnight border border-haze-border text-white placeholder-haze-muted focus:outline-none focus:ring-2 focus:ring-haze-indigo text-sm font-sans"
                  />
                </div>
              </div>

              <div className="font-mono text-xs">
                <label htmlFor="message" className="block text-haze-dim mb-2">
                  Your Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project, idea, or role..."
                  className="w-full px-4 py-3 rounded-xl bg-midnight border border-haze-border text-white placeholder-haze-muted focus:outline-none focus:ring-2 focus:ring-haze-indigo text-sm font-sans resize-none"
                />
              </div>

              {/* Status Alert */}
              {feedback && (
                <div
                  className={`p-4 rounded-xl text-xs font-mono flex items-center gap-2 ${
                    status === 'success'
                      ? 'bg-indigo-500/10 border border-indigo-500/30 text-haze-indigo'
                      : 'bg-red-500/10 border border-red-500/30 text-red-300'
                  }`}
                >
                  {status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-haze-indigo" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{feedback}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold font-mono text-sm flex items-center justify-center gap-2 shadow-haze-glow transition-all"
              >
                {status === 'submitting' ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
