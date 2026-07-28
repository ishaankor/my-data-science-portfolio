'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/projects', number: '01', label: 'Projects' },
    { href: '/resume', number: '02', label: 'Work' },
    { href: '/contact', number: '03', label: 'Contact' },
  ];

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-40 border-b border-line/40 bg-ink/80 backdrop-blur-md transition-colors duration-300">
        <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-10">
          
          {/* Logo Brand matching sunnypatel.net */}
          <Link
            href="/"
            className="font-mono text-sm tracking-tight text-bone hover:text-white transition-colors"
            aria-label="Home"
          >
            ishaan<span className="text-ember font-bold">.</span>koradia
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-1.5 py-1 font-mono text-[0.8rem] transition-colors ${
                    isActive ? 'text-bone font-semibold' : 'text-muted hover:text-bone'
                  }`}
                >
                  <span className="text-[0.62rem] tabular-nums text-muted group-hover:text-ember transition-colors">
                    {link.number}
                  </span>
                  <span>{link.label}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-px w-full bg-ember transition-transform duration-300 ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Action Button */}
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="hidden md:inline-block rounded-md border border-line px-4 py-2 font-mono text-[0.8rem] text-bone transition-colors duration-300 hover:border-ember hover:text-ember"
            >
              Get in touch
            </Link>

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex h-10 w-10 items-center justify-center text-bone hover:text-ember md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-line bg-ink/95 px-6 py-4 md:hidden">
            <div className="flex flex-col space-y-3 font-mono text-sm">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2 text-muted hover:text-bone"
              >
                <span className="text-[0.62rem] text-ember">00</span>Home
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 py-2 ${
                    pathname === link.href ? 'text-bone font-bold' : 'text-muted hover:text-bone'
                  }`}
                >
                  <span className="text-[0.62rem] text-ember">{link.number}</span>
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 rounded-md border border-ember/50 bg-ember/10 px-4 py-3 text-center text-bone hover:bg-ember/20"
              >
                Get in touch
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
