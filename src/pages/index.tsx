import PlanSection from "@home/plan/PlanSection";
import IntroduceSection from "@home/introduction/IntroduceSection";
import ProjectSection from "@home/project/ProjectSection";
import TrackSection from "@home/track/TrackSection";
import VisionSection from "@home/vision/VisionSection";
import More from '@image/home_more.svg';
import styled from "styled-components";
import VideoSection from "src/components/home/video/VideoSection";

function Landing() {
  return (
    <SectionWrapper>
      <VideoSection />
      <More />
      <IntroduceSection />
      <VisionSection />
      <TrackSection />
      <ProjectSection />
      <PlanSection />
    </SectionWrapper>
  );
}

export default Landing;


const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
  width: 100%;
`;