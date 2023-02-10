import Carousel from '@archiving/Carousel';
import pic1 from '@image/활동기록보러가기.png';
import pic2 from '@image/projectPic.png';
import pic3 from '@image/projectPic2.png';
import { ReactElement } from 'react';
import LayoutArchiving from '@common/layout/LayoutArchiving';
const ProjectDetail = () => {
  return (
    <>
      <Carousel images={[pic1, pic2, pic3]} />
    </>
  );
};
ProjectDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export default ProjectDetail;
