import Header from '@archiving/Header';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import SearchSection from '@project/header/SearchSection';
import ProjectsSection from '@project/projects/ProjectsSection';
import { InferGetStaticPropsType } from 'next';
import { ReactElement } from 'react';
import { getProjects } from 'src/apis/project';
import styled from 'styled-components';

const ProjectList = ({ projectStaticData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Header pageName="프로젝트" introduce="멋사와 함께한 프로젝트" />
      <ProjectsSection staticData={projectStaticData} />
    </>
  );
};

ProjectList.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export async function getStaticProps() {
  const projectStaticData = await getProjects();
  return {
    props: {
      projectStaticData,
    },
    revalidate: 86400,
  };
}
export default ProjectList;
