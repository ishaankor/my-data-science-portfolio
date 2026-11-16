import RepositoryMatrix from '@/components/projects/RepositoryMatrix';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects Library | Ishaan Koradia',
  description: 'Explore the complete library of data science, machine learning, web scraping, and automation projects built by Ishaan Koradia.',
};

export default function ProjectsPage() {
  return (
    <div className="min-h-dvh">
      <RepositoryMatrix />
    </div>
  );
}
