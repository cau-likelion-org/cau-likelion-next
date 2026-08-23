import { ReactElement, useEffect } from 'react';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import AboutHero from '@about/hero/AboutHero';
import TalentSection from '@about/talent/TalentSection';
import CurriculumSection from '@about/curriculum/CurriculumSection';
import RoadmapSection from '@about/roadmap/RoadmapSection';

const About = () => {
  // 클라이언트 사이드 전환은 Next가 기본으로 최상단 스크롤을 시도하므로, 해시가 있으면 직접 대상 섹션으로 스크롤한다.
  // 대상 섹션 자체가 데이터를 비동기로 불러온 뒤에야 나타나거나, 위쪽 섹션들의 높이가 늦게 바뀌어
  // 위치가 밀릴 수 있어, 매 DOM 변경마다 대상을 다시 찾아 스크롤 위치를 보정한다.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    const scrollToTarget = () => document.getElementById(id)?.scrollIntoView();

    scrollToTarget();

    const observer = new MutationObserver(scrollToTarget);
    observer.observe(document.body, { childList: true, subtree: true });

    const timeoutId = setTimeout(() => observer.disconnect(), 1500);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

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
