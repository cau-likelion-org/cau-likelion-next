import FadeInComponent from '@home/common/FadeInComponent';
import { Variants } from 'framer-motion';
import styled from 'styled-components';
import ProjectButton from './component/ProjectButton';
import ProjectSlider from './component/ProjectSlider';

const fadeInAnimation: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1 },
  },
  hidden: {
    opacity: 0,
    y: -100,
  },
};

const ProjectSection = () => {
  return (
    <FadeInComponent variants={fadeInAnimation}>
      <>
        <TitleWrapper>
          <Title>각 트랙이 모여 함께 만든 프로젝트</Title>
          <Text>멋쟁이 사자처럼에서 탄생한 서비스들을 소개합니다. </Text>
        </TitleWrapper>
        <ProjectSlider />
        <ButtonWrapper>
          <ProjectButton />
        </ButtonWrapper>
      </>
    </FadeInComponent>
  );
};

export default ProjectSection;

const TitleWrapper = styled.div`
  margin-top: 3.2rem;
  display: flex;
  margin-bottom: 4rem;
  align-items: center;
  flex-direction: column;
`;
const Title = styled.div`
  font-family: 'Pretendard';
  font-weight: 700;
  font-size: 30px;
`;
const Text = styled.div`
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 17px;
  margin-top: 23px;
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
