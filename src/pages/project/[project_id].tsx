import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import styled from 'styled-components';

import DetailMainSection from '@project/detail/DetailMainSection';
import Carousel from '@archiving/Carousel';
import LayoutArchiving from '@common/layout/LayoutArchiving';

import { getProjectDetail, getProjects } from 'src/apis/project';

import { IProjectDetail } from '@@types/request';
import { GreyScale } from '@utils/constant/color';
import { GetStaticPaths } from 'next';
import { getPaths } from '@utils/index';
import DetailPageHead from 'src/components/meta/DetailPageHead';
import { ARCHIVING } from '@utils/constant';
import useProjectDetail from 'src/apis/queries/useProjectDetail';

const ProjectDetail = ({ projectDetailStaticData }: { projectDetailStaticData: IProjectDetail }) => {
  const router = useRouter();
  const { projectDetail: data, isLoading } = useProjectDetail();

  if (router.isFallback) {
    return <div>로딩중</div>;
  }
  return (
    <>
      <DetailPageHead
        title={data?.title}
        canoUrl={`https://cau-likelion.org/project/${data?.id}`}
        img={data?.thumbnail}
        category={ARCHIVING.PROJECT}
        description={data?.subtitle}
      />
      <Wrapper>
        <Carousel images={isLoading ? projectDetailStaticData.image : data!.image} />
        <DetailMainSection data={isLoading ? projectDetailStaticData : data!} />
        <hr />
      </Wrapper>
    </>
  );
};

ProjectDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const projectsGenerationArray = await getProjects();
  const paths = getPaths(projectsGenerationArray, 'project');
  return {
    paths,
    fallback: true,
  };
};

export async function getStaticProps({ params }: { params: { project_id: string } }) {
  const projectDetailStaticData = await getProjectDetail(params.project_id);
  return {
    props: {
      projectDetailStaticData,
    },
    revalidate: 86400,
  };
}

export default ProjectDetail;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &hr {
    background: ${GreyScale.light};
  }
`;
