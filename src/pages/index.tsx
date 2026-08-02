import styled from 'styled-components';
import { ReactElement } from 'react';
import MainSection from '@home/main/MainSection';
import IntroduceSection from '@home/introduction/IntroduceSection';
import ProjectSection from '@home/project/ProjectSection';
import TrackSection from '@home/track/TrackSection';
import ActivitySection from '@home/activity/ActivitySection';
import FAQSection from '@home/faq/FAQSection';
import LayoutLanding from '@common/layout/LayoutLanding';
import MainPageHead from 'src/components/meta/MainPageHead';

function Landing() {
  return (
    <>
      <MainPageHead canoUrl="https://cau-likelion.org/" />
      <SectionWrapper>
        <HeroGroup>
          <MainSection />
          <IntroduceSection />
        </HeroGroup>
        <TrackSection />
        <ActivitySection />
        <ProjectSection />
        <FAQSection />
      </SectionWrapper>
    </>
  );
}
Landing.getLayout = function getLayout(page: ReactElement) {
  return <LayoutLanding>{page}</LayoutLanding>;
};

export default Landing;
const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const HeroGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
