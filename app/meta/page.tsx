import { Metadata } from 'next';
import GitHubMetaDashboard from '@/components/meta/GitHubMetaDashboard';

export const metadata: Metadata = {
  title: 'Meta & GitHub Analytics | Ishaan Koradia',
  description: 'Live GitHub activity, contribution heatmap, code commit stream, and repository explorer for Ishaan Koradia.',
};

export default function MetaPage() {
  return (
    <main className="pt-28 pb-20 min-h-dvh">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-10">
        <GitHubMetaDashboard />
      </div>
    </main>
  );
}
