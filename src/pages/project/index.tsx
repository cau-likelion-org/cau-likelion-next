import Header from '@archiving/Header';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import ProjectsSection from '@project/projects/ProjectsSection';
import { ARCHIVING } from '@utils/constant';
import { InferGetStaticPropsType } from 'next';
import { ReactElement } from 'react';
import { getProjects } from 'src/apis/project';
import ListPageHead from 'src/components/meta/ListPageHead';

const ProjectList = ({ projectStaticData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <ListPageHead
        category={ARCHIVING.PROJECT}
        canoUrl={'https://cau-likelion.org/project'}
      />
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
