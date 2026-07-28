import ProjectsShowcase from '@/components/projects/ProjectsShowcase';
import ProjectRecommender from '@/components/recommender/ProjectRecommender';
import { Layers } from 'lucide-react';

export const metadata = {
  title: 'Projects Library | Ishaan Koradia Data Science Portfolio',
  description: 'Explore the complete library of data science, machine learning, web scraping, and automation projects built by Ishaan Koradia.',
};

export default function ProjectsPage() {
  return (
    <div className="pt-28 pb-16 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Complete Work Archive</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Projects & Case Studies
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Browse through machine learning models, automated data scraping tools, computer vision pipelines, and full-stack web applications.
          </p>
        </div>
      </div>

      <ProjectRecommender />
      <ProjectsShowcase />
    </div>
  );
}
