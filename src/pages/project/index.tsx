import LayoutArchiving from '@common/layout/LayoutArchiving';
import ProjectPageHeader from '@project/projects/ProjectPageHeader';
import ProjectsSection from '@project/projects/ProjectsSection';
import { ARCHIVING } from '@utils/constant';
import { InferGetStaticPropsType } from 'next';
import { ReactElement } from 'react';
import { getProjects } from 'src/apis/project';
import ListPageHead from 'src/components/meta/ListPageHead';

const ProjectList = ({ projectStaticData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      {/* <div>점검중입니다.</div> */}
      <ListPageHead category={ARCHIVING.PROJECT} canoUrl={'https://cau-likelion.org/project'} />
      <ProjectPageHeader title="프로젝트" subtitle="멋사와 함께한 프로젝트" />
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
