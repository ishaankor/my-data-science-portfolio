'use client';

import React, { useState } from 'react';
import WorkHeroHUD from '@/components/experience/WorkHeroHUD';
import ExperienceMatrix from '@/components/experience/ExperienceMatrix';
import CertificationsSection from '@/components/experience/CertificationsSection';
import TechnicalSkillsMatrix from '@/components/experience/TechnicalSkillsMatrix';

export default function ResumeClient() {
  const [isTerminalMode, setIsTerminalMode] = useState(false);

  return (
    <div className="min-h-screen space-y-4">
      <WorkHeroHUD
        isTerminalMode={isTerminalMode}
        setIsTerminalMode={setIsTerminalMode}
      />
      <ExperienceMatrix isTerminalMode={isTerminalMode} />
      <CertificationsSection />
      <TechnicalSkillsMatrix />
    </div>
  );
}
