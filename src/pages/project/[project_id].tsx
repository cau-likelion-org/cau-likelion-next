import Carousel from '@archiving/Carousel';
import pic1 from '@image/활동기록보러가기.png';
import pic2 from '@image/projectPic.png';
import pic3 from '@image/projectPic2.png';
import { ReactElement } from 'react';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import styled from 'styled-components';
import DetailMainSection from '@project/detail/DetailMainSection';
import { useRouter } from 'next/router';
const ProjectDetail = () => {
  const router = useRouter();
  return (
    <Wrapper>
      <Carousel images={[pic1, pic2, pic3]} />
      <DetailMainSection id={router.query.project_id as string} />
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
`;
