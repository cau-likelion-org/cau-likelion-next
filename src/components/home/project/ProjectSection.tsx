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
      <Wrapper>
        <TitleWrapper>
          <Title>프로젝트 소개</Title>
          <Text>멋쟁이사자처럼에서 탄생한 서비스들을 소개합니다. </Text>
        </TitleWrapper>
        <ProjectSlider />
        <ButtonWrapper>
          <ProjectButton />
        </ButtonWrapper>
      </Wrapper>
    </FadeInComponent>
  );
};

export default ProjectSection;
const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;
const TitleWrapper = styled.div`
  margin-top: 6rem;
  display: flex;
  margin-bottom: 4rem;
  align-items: center;
  flex-direction: column;
  @media (min-width: 1850px) {
    margin-top: 30rem;
  }
`;
const Title = styled.div`
  font-family: 'GmarketSans';
  font-weight: 700;
  font-size: 3rem;
  @media (max-width: 900px) {
    font-size: 2.5rem;
  }
`;
const Text = styled.div`
  font-family: 'GmarketSans';
  font-weight: 500;
  font-size: 17px;
  margin-top: 23px;
  @media (max-width: 900px) {
    font-size: 1.5rem;
  }
`;
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
