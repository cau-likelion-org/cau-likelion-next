import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import ProjectDetailModal from '@project/detail/ProjectDetailModal';
import ProjectPageHeader from '@project/projects/ProjectPageHeader';
import ProjectsSection from '@project/projects/ProjectsSection';
import { getPaths } from '@utils/index';
import { GetStaticPaths, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import { getProjectDetail, getProjectThumbnail, getProjects } from 'src/apis/project';
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
    router.push('/project', undefined, { shallow: true, scroll: false });
  };

  if (router.isFallback && !projectId) {
    return <div>로딩중</div>;
  }

  return (
    <>
      {projectDetailStaticData ? (
        <DetailPageHead
          canoUrl={`https://cau-likelion.org/project/${projectDetailStaticData.id}`}
          img={getProjectThumbnail(projectDetailStaticData.images)}
          category="PROJECT"
          description={projectDetailStaticData.tagline}
        />
      ) : (
        <ListPageHead category="PROJECT" canoUrl={'https://cau-likelion.org/project'} />
      )}
      <ProjectPageHeader title="프로젝트" subtitle="멋쟁이사자처럼 중앙대학교에서 탄생한 프로젝트를 소개합니다." />
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
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const projectsGenerationArray = await getProjects();
    const detailPaths = getPaths(projectsGenerationArray, 'project').map(({ params }) => ({
      params: { project_id: [params.project_id] },
    }));
    return {
      paths: [{ params: { project_id: [] } }, ...detailPaths],
      fallback: true,
    };
  } catch {
    return {
      paths: [{ params: { project_id: [] } }],
      fallback: true,
    };
  }
};

export async function getStaticProps({ params }: { params: { project_id: string[] } }) {
  const id = params.project_id?.[0];

  if (!id) {
    try {
      const projectStaticData = await getProjects();
      return {
        props: { projectStaticData, projectDetailStaticData: null },
        revalidate: 86400,
      };
    } catch {
      return {
        props: { projectStaticData: {}, projectDetailStaticData: null },
        revalidate: 60,
      };
    }
  }

  try {
    const projectDetailStaticData = await getProjectDetail(id);
    return {
      props: { projectStaticData: null, projectDetailStaticData },
      revalidate: 86400,
    };
  } catch {
    return { notFound: true };
  }
}

export default ProjectList;
