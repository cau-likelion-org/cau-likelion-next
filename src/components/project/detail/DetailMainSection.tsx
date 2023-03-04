import ProjectIntroduction from './ProjectIntroductionSection';
import TeamIntroduction from './TeamIntroductionSection';
import styled from 'styled-components';
import { IProjectDetail } from '@@types/request';

const DetailMainSection = ({ data }: { data: IProjectDetail; }) => {
  return (
    <Wrapper>
      <TeamIntroduction projectData={data} />
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

  @media(max-width: 900px) {
        flex-direction:column-reverse;
    }
`;
