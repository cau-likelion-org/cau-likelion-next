import styled from 'styled-components';
import ProjectButton from './component/ProjectButton';
import ProjectSlider from './component/ProjectSlider';

const ProjectSection = () => {
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>각 트랙이 모여 함께 만든 프로젝트</Title>
        <Text>트랙별 아기사자들이 멋쟁이 사자처럼 활동을 통해 다양하고 재미있는 프로젝트를 만들었습니다~~어쩌구</Text>
      </TitleWrapper>
      <ProjectSlider />
      <ButtonWrapper>
        <ProjectButton />
      </ButtonWrapper>
    </Wrapper>
  );
};

export default ProjectSection;

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
