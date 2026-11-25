'use client';

import React from 'react';
import Link from 'next/link';
import HazeWaveText from '@/components/ui/HazeWaveText';
import { portfolioData } from '@/data/portfolio';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-container">
        
        <div className="footer-top-row">
          <div>
            <Link href="/" className="site-brand-link">
              <HazeWaveText text="ishaan.koradia" />
            </Link>
            <p className="footer-tagline">
              AI Engineer, {portfolioData.location}
            </p>
          </div>

          <nav aria-label="Footer Navigation">
            <ul className="footer-nav-list">
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li>
                <Link href="/work">Work</Link>
              </li>
              <li>
                <Link href="/meta">Meta</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom-row">
          <span>© {new Date().getFullYear()} {portfolioData.name}</span>
          <span>Designed and built from scratch with Next.js, React, TypeScript &amp; Three.js.</span>
        </div>

      </div>
    </footer>
  );
}
