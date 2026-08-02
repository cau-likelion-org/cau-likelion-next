import LayoutArchiving from '@common/layout/LayoutArchiving';
import ProjectDetailModal from '@project/detail/ProjectDetailModal';
import ProjectPageHeader from '@project/projects/ProjectPageHeader';
import ProjectsSection from '@project/projects/ProjectsSection';
import { ARCHIVING } from '@utils/constant';
import { getPaths } from '@utils/index';
import { GetStaticPaths, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { getProjectDetail, getProjects } from 'src/apis/project';
import DetailPageHead from 'src/components/meta/DetailPageHead';
import ListPageHead from 'src/components/meta/ListPageHead';

const ProjectList = ({
  projectStaticData,
  projectDetailStaticData,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const projectIdParam = router.query.project_id;
  const projectId = Array.isArray(projectIdParam) ? projectIdParam[0] : undefined;

  const handleCloseDetail = () => {
    router.push('/project', undefined, { shallow: true });
  };

  if (router.isFallback) {
    return <div>로딩중</div>;
  }

  return (
    <>
      {projectDetailStaticData ? (
        <DetailPageHead
          title={projectDetailStaticData.title}
          canoUrl={`https://cau-likelion.org/project/${projectDetailStaticData.id}`}
          img={projectDetailStaticData.thumbnail}
          category={ARCHIVING.PROJECT}
          description={projectDetailStaticData.subtitle}
        />
      ) : (
        <ListPageHead category={ARCHIVING.PROJECT} canoUrl={'https://cau-likelion.org/project'} />
      )}
      <ProjectPageHeader title="프로젝트" subtitle="멋사와 함께한 프로젝트" />
      <ProjectsSection staticData={projectStaticData} />
      {projectId && (
        <ProjectDetailModal
          key={projectId}
          projectId={projectId}
          staticData={projectDetailStaticData}
          onClose={handleCloseDetail}
        />
      )}
    </>
  );
};

ProjectList.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const projectsGenerationArray = await getProjects();
  const detailPaths = getPaths(projectsGenerationArray, 'project').map(({ params }) => ({
    params: { project_id: [params.project_id] },
  }));
  return {
    paths: [{ params: { project_id: [] } }, ...detailPaths],
    fallback: true,
  };
};

export async function getStaticProps({ params }: { params: { project_id: string[] } }) {
  const projectStaticData = await getProjects();
  const id = params.project_id?.[0];
  const projectDetailStaticData = id ? await getProjectDetail(id) : null;

  return {
    props: {
      projectStaticData,
      projectDetailStaticData,
    },
    revalidate: 86400,
  };
}

export default ProjectList;
