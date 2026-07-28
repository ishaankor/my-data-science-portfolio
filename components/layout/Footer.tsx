'use client';

import React from 'react';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';
import { Sparkles, Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-haze-border bg-midnight py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{portfolioData.name}</p>
              <p className="text-xs text-haze-muted font-mono">AI Engineer & Data Science Developer</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-haze-muted font-mono">
            <Link href="/" className="hover:text-haze-indigo transition-colors">Home</Link>
            <Link href="/projects" className="hover:text-haze-indigo transition-colors">Projects</Link>
            <Link href="/resume" className="hover:text-haze-indigo transition-colors">Experience</Link>
            <Link href="/contact" className="hover:text-haze-indigo transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-4 text-haze-muted">
            <a
              href={`https://github.com/${portfolioData.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={portfolioData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={portfolioData.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="Twitter Profile"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-haze-border/50 text-center text-xs text-haze-muted font-mono">
          <p>© {new Date().getFullYear()} {portfolioData.name}. Built with Next.js, React, TypeScript & Three.js.</p>
        </div>
      </div>
    </footer>
  );
}
