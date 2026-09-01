import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MidnightHazeCursor from '@/components/ui/MidnightHazeCursor';
import { portfolioData } from '@/data/portfolio';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Ishaan Koradia | Portfolio',
  description: portfolioData.bio,
  keywords: [
    'Ishaan Koradia',
    'Data Science Portfolio',
    'Machine Learning Engineer',
    'Next.js',
    'React',
    'TypeScript',
    'Three.js 3D Portfolio',
    'Python Developer',
  ],
  authors: [{ name: portfolioData.name }],
  openGraph: {
    title: 'Ishaan Koradia | Portfolio',
    description: portfolioData.bio,
    type: 'website',
    url: 'https://ishaankor.github.io/my-data-science-portfolio/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ishaan Koradia | Portfolio',
    description: portfolioData.bio,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#090d16] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-black">
        <MidnightHazeCursor />
        <Navbar />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
