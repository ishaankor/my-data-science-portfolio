import HeroSection from '@/components/hero/HeroSection';
import AboutMeSection from '@/components/sections/AboutMeSection';
import ProjectsShowcase from '@/components/projects/ProjectsShowcase';
import GitHubAnalytics from '@/components/analytics/GitHubAnalytics';
import TechStackSection from '@/components/skills/TechStackSection';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <HeroSection />
      <AboutMeSection />
      <ProjectsShowcase limit={6} />
      <GitHubAnalytics />
      <TechStackSection />
    </div>
  );
}
