import ExperienceTimeline from '@/components/experience/ExperienceTimeline';
import TechStackSection from '@/components/skills/TechStackSection';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { portfolioData } from '@/data/portfolio';

export const metadata = {
  title: 'Resume & Qualifications | Ishaan Koradia Data Science Portfolio',
  description: 'View Ishaan Koradia’s academic background, technical qualifications, and career trajectory in data science and software engineering.',
};

export default function ResumePage() {
  return (
    <div className="pt-28 pb-16 space-y-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-mono mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Resume & Experience</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Background & Qualifications
            </h1>
            <p className="text-slate-400 text-base sm:text-lg">
              Detailed history of academic coursework, engineering projects, software technical skills, and achievements.
            </p>
          </div>

          <div>
            <a
              href={`mailto:${portfolioData.email}?subject=Resume%20Request%20-%20Ishaan%20Koradia`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Request PDF Copy</span>
            </a>
          </div>
        </div>
      </div>

      <ExperienceTimeline />
      <TechStackSection />
    </div>
  );
}
