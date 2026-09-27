'use client';

import React from 'react';
import WorkHeroHUD from '@/components/experience/WorkHeroHUD';
import ExperienceMatrix from '@/components/experience/ExperienceMatrix';
import CertificationsSection from '@/components/experience/CertificationsSection';

export default function ResumeClient() {
  return (
    <div className="min-h-screen space-y-4">
      <WorkHeroHUD />
      <ExperienceMatrix />
      <CertificationsSection />
    </div>
  );
}
