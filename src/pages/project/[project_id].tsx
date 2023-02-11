import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';

import DetailMainSection from '@project/detail/DetailMainSection';
import Carousel from '@archiving/Carousel';
import LayoutArchiving from '@common/layout/LayoutArchiving';

import { getProjectDetail } from 'src/apis/projectDeatil';

import { IProjectDetail } from '@@types/request';
import { GreyScale } from '@utils/constant/color';
import { GetStaticPaths, InferGetStaticPropsType } from 'next';

const ProjectDetail = ({ projectDeatilStaticData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { data, isLoading } = useQuery<IProjectDetail>(['projectDeatil', router.query.project_id], () =>
    getProjectDetail(router.query.project_id as string),
  );

  return (
    <Wrapper>
      <Carousel images={isLoading ? projectDeatilStaticData.thumbnail : data!.thumbnail} />
      <DetailMainSection data={isLoading ? projectDeatilStaticData : data!} />
      <hr />
    </Wrapper>
  );
};

ProjectDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export const getStaticPaths: GetStaticPaths = (async) => {
  return {
    paths: [{ params: { project_id: '1' } }],
    fallback: false,
  };
};

export async function getStaticProps({ params }: any) {
  const projectDeatilStaticData = await getProjectDetail(params.project_id);
  return {
    props: {
      projectDeatilStaticData,
    },
    revalidate: 86400,
  };
}

export default ProjectDetail;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  &hr {
    background: ${GreyScale.light};
  }
`;
