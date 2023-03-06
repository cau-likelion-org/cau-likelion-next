import { ArchivingArrayType, IGalleryData } from '@@types/request';
import Header from '@archiving/Header';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import GalleryListSection from '@gallery/GalleryListSection';
import { Primary } from '@utils/constant/color';
import { ReactElement } from 'react';
import { getGalleries } from 'src/apis/gallery';
import styled from 'styled-components';

const GalleryList = ({ galleryStaticData }: { galleryStaticData: ArchivingArrayType<IGalleryData>; }) => {
  return (
    <>
      <Header pageName="추억" introduce="멋사와 함께 한 추억" />
      {/* <ButtonWrapper> */}
      {/* <WriteButton>+</WriteButton> */}
      {/* </ButtonWrapper> */}
      <GalleryListSection staticData={galleryStaticData} />
    </>
  );
};

GalleryList.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export async function getStaticProps() {
  const galleryStaticData = await getGalleries();
  return {
    props: {
      galleryStaticData: galleryStaticData,
    },
    revalidate: 86400,
  };
}
export default GalleryList;

const WriteButton = styled.button`
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 3rem;
  color: white;
  background-color: ${Primary.default};
  margin-left: 27px;
  cursor: pointer;

`;

const ButtonWrapper = styled.div`
  margin: 2rem 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
