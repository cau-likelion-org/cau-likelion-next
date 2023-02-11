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

const ProjectDetail = () => {
  const router = useRouter();
  const { data, isLoading } = useQuery<IProjectDetail>(['projectDeatil', router.query.project_id], () =>
    getProjectDetail(router.query.project_id as string),
  );

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <Wrapper>
      <Carousel images={data!.thumbnail} />
      <DetailMainSection data={data!} />
      <hr />
    </Wrapper>
  );
};

ProjectDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export default ProjectDetail;
const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  &hr {
    background: ${GreyScale.light};
  }
`;
