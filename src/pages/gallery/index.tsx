import LayoutArchiving from '@common/layout/LayoutArchiving';
import GalleryListSection from '@gallery/GalleryListSection';
import { ARCHIVING } from '@utils/constant';
import { ReactElement } from 'react';
import ListPageHead from 'src/components/meta/ListPageHead';

const GalleryList = () => {
  return (
    <>
      <ListPageHead category={ARCHIVING.GALLERY} canoUrl={'https://cau-likelion.org/gallery'} />
      <GalleryListSection />
    </>
  );
};

GalleryList.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export default GalleryList;
