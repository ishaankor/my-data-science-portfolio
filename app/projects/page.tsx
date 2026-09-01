import RepositoryMatrix from '@/components/projects/RepositoryMatrix';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects Library | Portfolio',
  description: 'Explore the complete library of data science, machine learning, web scraping, and automation projects built by Ishaan Koradia.',
};

export default function ProjectsPage() {
  return (
    <main className="pt-24 pb-16 min-h-dvh">
      <RepositoryMatrix />
    </main>
  );
}
