import SearchSection from '@project/Header/SearchSection';
import ProjectsSection from '@project/Projects/ProjectsSection';
import { GreyScale } from '@utils/constant/color';
import styled from 'styled-components';
const ProjectList = () => {
  return (
    <Wrapper>
      <Category>아카이빙 &gt; 프로젝트</Category>
      <Title>중앙대 멋사에서 함께한 프로젝트를 소개해요!</Title>
      <hr />
      <SearchSection />
      <ProjectsSection />
    </Wrapper>
  );
};

export default ProjectList;
const Wrapper = styled.div`
  &hr {
    color: ${GreyScale.light};
  }
`;
const Category = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 21px;
  line-height: 153.02%;
  @media (max-width: 1550px) {
    font-size: 1.5rem;
  }
`;
const Title = styled.div`
  font-family: 'Pretendard';
  font-style: normal;
  font-weight: 900;
  font-size: 4rem;
  line-height: 100%;
  @media (max-width: 1550px) {
    font-size: 2.3rem;
  }
  margin-top: 10px;
  margin-bottom: 20px;
`;
