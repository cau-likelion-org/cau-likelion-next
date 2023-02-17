import FadeInComponent from '@home/common/FadeInComponent';
import { Variants } from 'framer-motion';
import styled from 'styled-components';
import ProjectButton from './component/ProjectButton';
import ProjectSlider from './component/ProjectSlider';
<<<<<<< HEAD

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
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9

const fadeInAnimation: Variants = {
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1 },
  },
  hidden: {
    opacity: 0,
    x: 100,
  },
};
const ProjectSection = () => {
  return (
    <FadeInComponent variants={fadeInAnimation}>
      <Wrapper>
        <TitleWrapper>
          <Title>각 트랙이 모여 함께 만든 프로젝트</Title>
<<<<<<< HEAD
          <Text>멋쟁이 사자처럼에서 탄생한 서비스들을 소개합니다. </Text>
=======
          <Text>트랙별 아기사자들이 멋쟁이 사자처럼 활동을 통해 다양하고 재미있는 프로젝트를 만들었습니다~~어쩌구</Text>
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
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
<<<<<<< HEAD
const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;
const TitleWrapper = styled.div`
  margin-top: 3.2rem;
  display: flex;
  margin-bottom: 4rem;
=======

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  min-height: 100vh;
  scroll-snap-align: start;
`;
const TitleWrapper = styled.div`
  margin-top: 40px;
  margin-bottom: 92px;
  display: flex;
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
  align-items: center;
  flex-direction: column;
`;
const Title = styled.div`
  font-family: 'Pretendard';
  font-weight: 700;
<<<<<<< HEAD
  font-size: 3rem;
  @media (max-width: 900px) {
    font-size: 2.5rem;
  }
`;
const Text = styled.div`
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 17px;
  margin-top: 23px;
  @media (max-width: 900px) {
    font-size: 1.5rem;
  }
`;
=======
  font-size: 30px;
`;
const Text = styled.div`
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 17px;
  margin-top: 23px;
`;
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
