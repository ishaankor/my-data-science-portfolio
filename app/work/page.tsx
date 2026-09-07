import ResumeClient from '@/components/experience/ResumeClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work & Experience | Ishaan Koradia — AI Engineer',
  description:
    'Explore the career trajectory, frontier LLM evaluations (Handshake AI & NVIDIA), agentic platforms, and academic background of Ishaan Koradia.',
};

export default function WorkPage() {
  return (
    <main className="min-h-dvh">
      <ResumeClient />
    </main>
  );
}
