'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import HazeWaveText from '@/components/ui/HazeWaveText';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/projects', number: '01', label: 'Projects' },
    { href: '/work', number: '02', label: 'Work' },
    { href: '/meta', number: '03', label: 'Meta' },
  ];

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="site-header">
        <nav aria-label="Primary Navigation" className="site-nav">
          
          {/* Logo Brand */}
          <Link
            href="/"
            className="site-brand-link"
            aria-label="Home"
          >
            <HazeWaveText text="ishaan.koradia" />
          </Link>

          {/* Desktop Nav Links */}
          <ul className="site-nav-list">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/work' && pathname === '/resume');
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={isActive ? 'site-nav-item-active' : 'site-nav-item'}
                  >
                    <small>{link.number}</small>
                    <span>{link.label}</span>
                    <span
                      aria-hidden="true"
                      className={isActive ? 'site-nav-indicator-active' : 'site-nav-indicator'}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Action Button */}
          <div className="site-nav-actions">
            <Link
              href="/contact"
              className="site-contact-btn"
            >
              Get in touch
            </Link>

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="site-menu-toggle"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <ul className="mobile-drawer-list">
              <li>
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-drawer-link"
                >
                  <small className="text-ember">00</small>Home
                </Link>
              </li>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={
                      pathname === link.href || (link.href === '/work' && pathname === '/resume')
                        ? 'mobile-drawer-link-active'
                        : 'mobile-drawer-link'
                    }
                  >
                    <small className="text-ember">{link.number}</small>
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mobile-drawer-cta"
                >
                  Get in touch
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
