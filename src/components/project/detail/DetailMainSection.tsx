import ProjectIntroduction from './ProjectIntroductionSection';
import TeamIntroducton from './TeamIntroductonSection';
import styled from 'styled-components';
import { IProjectDetail } from '@@types/request';

const DetailMainSection = ({ data }: { data: IProjectDetail }) => {
  return (
    <Wrapper>
      <TeamIntroducton projectData={data} />
      <ProjectIntroduction projectData={data} />
    </Wrapper>
  );
};

export default DetailMainSection;
const Wrapper = styled.div`
  display: flex;
  gap: 32px;
  margin: 30px 0;
  width: 100%;
`;
