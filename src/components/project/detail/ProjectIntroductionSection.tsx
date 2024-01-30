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
      <Description>
        {projectData.description &&
          projectData.description
            .replace(/\\n/g, '\n')
            .split('\n')
            .map((line, key) => {
              return (
                <span key={key}>
                  {line}
                  <br />
                </span>
              );
            })}
      </Description>
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
  flex-direction: column;
  margin-bottom: 20px;
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
  display: flex;
  align-items: center;
  color: ${GreyScale.default};
  margin-top: 10px;
`;
const Description = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  font-family: 'Pretendard';
  font-weight: 500;
  font-size: 17px;
  line-height: 160%;
  height: 100%;
  display: flex;
  align-items: start;
`;
