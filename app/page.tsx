import HeroSection from '@/components/hero/HeroSection';
import GitHubAnalytics from '@/components/analytics/GitHubAnalytics';
import ProjectRecommender from '@/components/recommender/ProjectRecommender';
import ProjectsShowcase from '@/components/projects/ProjectsShowcase';
import TechStackSection from '@/components/skills/TechStackSection';
import ExperienceTimeline from '@/components/experience/ExperienceTimeline';
import ContactSection from '@/components/contact/ContactSection';

export default function HomePage() {
  return (
    <div className="space-y-12 pb-16">
      <HeroSection />
      <GitHubAnalytics />
      <ProjectRecommender />
      <ProjectsShowcase limit={6} />
      <TechStackSection />
      <ExperienceTimeline />
      <ContactSection />
    </div>
  );
}
