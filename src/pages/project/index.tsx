import Header from '@archiving/Header';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import SearchSection from '@project/Header/SearchSection';
import ProjectsSection from '@project/Projects/ProjectsSection';
import { ReactElement } from 'react';

const ProjectList = () => {
  return (
    <>
      <Header pageName="프로젝트" introduce="중앙대 멋사에서 함께한 프로젝트를 소개해요!" />
      <SearchSection />
      <ProjectsSection />
    </>
  );
};
ProjectList.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export default ProjectList;
