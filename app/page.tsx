import HeroSection from '@/components/hero/HeroSection';
import ProjectsShowcase from '@/components/projects/ProjectsShowcase';
import WhatIDo from '@/components/sections/WhatIDo';
import GitHubAnalytics from '@/components/analytics/GitHubAnalytics';
import ProjectRecommender from '@/components/recommender/ProjectRecommender';
import ExperienceTimeline from '@/components/experience/ExperienceTimeline';
import ContactSection from '@/components/contact/ContactSection';

export default function HomePage() {
  return (
    <div className="space-y-4">
      <HeroSection />
      <ProjectsShowcase limit={3} />
      <WhatIDo />
      <GitHubAnalytics />
      <ProjectRecommender />
      <ExperienceTimeline />
      <ContactSection />
    </div>
  );
}
