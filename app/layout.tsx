import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { portfolioData } from '@/data/portfolio';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://ishaankor.github.io/my-data-science-portfolio'),
  title: 'Ishaan Koradia | Portfolio',
  description: portfolioData.bio,
  keywords: [
    'Ishaan Koradia',
    'Data Science Portfolio',
    'Machine Learning Engineer',
    'AI Engineer',
    'LLM Evaluation',
    'Next.js',
    'React',
    'TypeScript',
    'Model Context Protocol',
    'Python Developer',
  ],
  authors: [{ name: portfolioData.name, url: 'https://ishaankoradia.com' }],
  creator: portfolioData.name,
  alternates: {
    canonical: 'https://ishaankor.github.io/my-data-science-portfolio/',
  },
  openGraph: {
    title: 'Ishaan Koradia | Portfolio',
    description: portfolioData.bio,
    type: 'website',
    url: 'https://ishaankor.github.io/my-data-science-portfolio/',
    siteName: 'Ishaan Koradia Portfolio',
    locale: 'en_US',
    images: [
      {
        url: '/favicons/portfolio-cover.png',
        width: 1200,
        height: 630,
        alt: 'Ishaan Koradia | Portfolio',
      },
    ],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ishaan Koradia | Portfolio',
    description: portfolioData.bio,
    creator: '@ishaankoradia',
    images: ['/favicons/portfolio-cover.png'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  mainEntity: {
    '@type': 'Person',
    name: portfolioData.name,
    alternateName: 'ishaankor',
    jobTitle: portfolioData.title,
    description: portfolioData.bio,
    url: 'https://ishaankoradia.com',
    image: 'https://ishaankor.github.io/my-data-science-portfolio/images/personal-picture.avif',
    sameAs: [
      portfolioData.githubUsername ? `https://github.com/${portfolioData.githubUsername}` : '',
      portfolioData.linkedin,
      portfolioData.twitter,
    ].filter(Boolean),
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'University of California, San Diego',
      alternateName: 'UC San Diego',
    },
    knowsAbout: [
      'Machine Learning',
      'Artificial Intelligence',
      'Large Language Models (LLM)',
      'Model Context Protocol (MCP)',
      'Data Science',
      'Full Stack Web Development',
      'Python',
      'TypeScript',
    ],
  },
};

const designSystemCss = `
:root {
  --color-ink: #0b0d0f;
  --color-surface: #121518;
  --color-surface-elevated: #161b22;
  --color-line: #1e242b;
  --color-bone: #f1f5f9;
  --color-bone-dim: #cbd5e1;
  --color-muted: #64748b;
  --color-ember: #38bdf8;
  --color-ember-light: #7dd3fc;
  --color-emerald: #34d399;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2.5rem;
  --space-2xl: 4rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --shadow-panel: 0 4px 20px rgba(0, 0, 0, 0.3);
  --shadow-float: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <style
          id="design-system-tokens"
          dangerouslySetInnerHTML={{ __html: designSystemCss }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="app-shell">
        <Navbar />
        <main id="main-content" className="app-main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
