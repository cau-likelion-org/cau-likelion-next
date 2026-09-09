import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import GalleryListSection from '@gallery/GalleryListSection';
import { ReactElement } from 'react';
import ListPageHead from 'src/components/meta/ListPageHead';

const GalleryList = () => {
  return (
    <>
      <ListPageHead category="GALLERY" canoUrl={'https://cau-likelion.org/gallery'} />
      <GalleryListSection />
    </>
  );
};

GalleryList.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default GalleryList;
