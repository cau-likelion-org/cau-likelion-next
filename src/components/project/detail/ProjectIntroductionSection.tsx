import { IProjectDetail } from '@@types/request';
import { GreyScale } from '@utils/constant/color';
import styled from 'styled-components';
const ProjectIntroduction = ({ projectData }: { projectData: IProjectDetail }) => {
  return (
    <Wrapper>
      <TitleWrapper>
        <Title>{projectData.title}</Title>
        <SubTitle>{projectData.subtitle}</SubTitle>
      </TitleWrapper>
      <Description>{projectData.description}</Description>
    </Wrapper>
  );
};

export default ProjectIntroduction;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 60%;
  width: 100%;
`;
const TitleWrapper = styled.div`
  display: flex;
`;
const Title = styled.div`
  font-family: 'Pretendard';
  font-weight: 900;
  font-size: 40px;
`;
const SubTitle = styled.div`
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 17px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  color: ${GreyScale.default};
`;
const Description = styled.div`
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 17px;
  line-height: 160%;
  height: 100%;
  display: flex;
  align-items: center;
`;
