'use client';

import React from 'react';
import Link from 'next/link';
import { portfolioData } from '@/data/portfolio';

export default function Footer() {
  return (
    <footer className="border-t border-line py-12 bg-ink">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/" className="font-mono text-sm text-bone">
              ishaan<span className="text-ember font-bold">.</span>koradia
            </Link>
            <p className="mt-2 font-mono text-xs text-muted">
              Data Science & Analytics Engineer, {portfolioData.location}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-muted">
            <Link href="/projects" className="transition-colors hover:text-bone">
              Projects
            </Link>
            <Link href="/resume" className="transition-colors hover:text-bone">
              Work
            </Link>
            <Link href="/contact" className="transition-colors hover:text-bone">
              Contact
            </Link>
          </nav>

          <div className="flex gap-5 font-mono text-xs">
            <a
              href={`https://github.com/${portfolioData.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-bone"
            >
              GitHub
            </a>
            <a
              href={portfolioData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition-colors hover:text-bone"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${portfolioData.email}`}
              className="text-muted transition-colors hover:text-bone"
            >
              Email
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 font-mono text-[0.7rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {portfolioData.name}</span>
          <span>Designed and built from scratch with Next.js, React, TypeScript & Three.js.</span>
        </div>

      </div>
    </footer>
  );
}
