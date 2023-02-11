import { IProjectDetail } from '@@types/request';
import { DEV_STACK } from '@utils/constant';
import styled from 'styled-components';
import DevStacks from './component/TeamIntroduction/DevStacks';
import LinkButton from './component/TeamIntroduction/LinkButton';
import TeamMember from './component/TeamIntroduction/TeamMember';

const TeamIntroduction = ({ projectData }: { projectData: IProjectDetail }) => {
  return (
    <Wrapper>
      <TeamName>{projectData.team_name}</TeamName>
      <Line>
        <CategoryTitle>팀원</CategoryTitle>
        <CategoryInner>
          <TeamMember teamMember={projectData.team_member} />
        </CategoryInner>
      </Line>
      <Line>
        <CategoryTitle>기술스택</CategoryTitle>
        <CategoryInner>
          <DevStacks devStack={projectData.dev_stack} />
        </CategoryInner>
      </Line>
      <Line>
        <CategoryTitle>프로젝트 기간</CategoryTitle>
        <CategoryInner>{projectData.date}</CategoryInner>
      </Line>
      <LinkButton shareURL={projectData.link} />
    </Wrapper>
  );
};

export default TeamIntroduction;
const Wrapper = styled.div`
  background-color: #f0f1ff;
  border-radius: 20px;
  flex-basis: 40%;
  padding: 20px;
`;
const TeamName = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
`;
const Line = styled.div`
  display: flex;
  margin: 15px 0;
`;
const CategoryTitle = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  flex-basis: 30%;
`;
const CategoryInner = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  flex-basis: 70%;
`;
