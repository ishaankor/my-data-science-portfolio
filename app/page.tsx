import HeroSection from '@/components/hero/HeroSection';
import AboutMeSection from '@/components/sections/AboutMeSection';
import ProjectsShowcase from '@/components/projects/ProjectsShowcase';
import GitHubAnalytics from '@/components/analytics/GitHubAnalytics';
import ProjectRecommender from '@/components/recommender/ProjectRecommender';
import TechStackSection from '@/components/skills/TechStackSection';
import ExperienceTimeline from '@/components/experience/ExperienceTimeline';
import ContactSection from '@/components/contact/ContactSection';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <HeroSection />
      <AboutMeSection />
      <ProjectsShowcase limit={6} />
      <GitHubAnalytics />
      <ProjectRecommender />
      <TechStackSection />
      <ExperienceTimeline />
      <ContactSection />
    </div>
  );
}
