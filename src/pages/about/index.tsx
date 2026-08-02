import { ReactElement } from 'react';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import AboutHero from '@about/hero/AboutHero';
import TalentSection from '@about/talent/TalentSection';
import CurriculumSection from '@about/curriculum/CurriculumSection';
import RoadmapSection from '@about/roadmap/RoadmapSection';

const About = () => {
  return (
    <>
      <AboutHero />
      <TalentSection />
      <CurriculumSection />
      <RoadmapSection />
    </>
  );
};

About.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default About;
