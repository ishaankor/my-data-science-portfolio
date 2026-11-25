import RepositoryMatrix from '@/components/projects/RepositoryMatrix';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects & System Architectures | Ishaan Koradia',
  description: 'Explore production AI applications, Model Context Protocol (MCP) systems, real-time streaming pipelines, and statistical modeling built by Ishaan Koradia.',
};

export default function ProjectsPage() {
  return (
    <div className="min-h-dvh">
      <RepositoryMatrix />
    </div>
  );
}
