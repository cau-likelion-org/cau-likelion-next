import styled from 'styled-components';
import { ReactElement, useRef } from 'react';
import MainSection from '@home/main/MainSection';
import PlanSection from '@home/plan/PlanSection';
import IntroduceSection from '@home/introduction/IntroduceSection';
import ProjectSection from '@home/project/ProjectSection';
import TrackSection from '@home/track/TrackSection';
import ActivitySection from '@home/activity/ActivitySection';
import ScrollBar from '@home/scrollBar/ScrollBar';
import LayoutLanding from '@common/layout/LayoutLanding';
import MainPageHead from 'src/components/meta/MainPageHead';

function Landing() {
  const ref = useRef(null);
  const clickMore = () => {
    (ref as any).current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <MainPageHead canoUrl='https://cau-likelion.org/' />
      <SectionWrapper>
        <ScrollBar />
        <MainSection clickMore={clickMore} />
        <IntroduceSection innerRef={ref} />
        <ActivitySection />
        <TrackSection />
        <ProjectSection />
        <PlanSection />
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
  gap: 100px;
  width: 100%;
`;
