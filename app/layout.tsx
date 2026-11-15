import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { portfolioData } from '@/data/portfolio';

export const metadata: Metadata = {
  metadataBase: new URL('https://ishaankor.github.io/my-data-science-portfolio'),
  title: 'Ishaan Koradia | AI Engineer & Data Science Developer',
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
    title: 'Ishaan Koradia | AI Engineer & Data Science Developer',
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
        alt: 'Ishaan Koradia Portfolio - AI Engineer & Data Science Developer',
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
    title: 'Ishaan Koradia | AI Engineer & Data Science Developer',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#090d16] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-ember selection:text-white">
        <Navbar />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
