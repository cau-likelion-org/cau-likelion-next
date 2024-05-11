import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';

import Carousel from '@archiving/Carousel';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import { IGalleryDetail } from '@@types/request';
import { GreyScale } from '@utils/constant/color';
import { GetStaticPaths } from 'next';
import { getGalleries, getGalleryDetail } from 'src/apis/gallery';
import GalleryDetailSection from '@gallery/GalleryDetailSection';
import { getIdFromAsPath, getPaths } from '@utils/index';
import DetailPageHead from 'src/components/meta/DetailPageHead';
import { ARCHIVING } from '@utils/constant';

const GalleryDetail = ({ galleryDetailStaticData }: { galleryDetailStaticData: IGalleryDetail }) => {
  const router = useRouter();
  const { data, isLoading } = useQuery<IGalleryDetail>(['galleryDeatil', router.asPath], () =>
    getGalleryDetail(getIdFromAsPath(router.asPath, 'gallery')),
  );

  if (router.isFallback) {
    return <div>로딩중</div>;
  }
  return (
    <>
      <DetailPageHead
        title={data?.title}
        canoUrl={`https://cau-likelion.org/gallery/${data?.id}`}
        img={data?.thumbnail}
        category={ARCHIVING.GALLERY}
        description={data?.subtitle}
      />
      <Wrapper>
        <Carousel images={isLoading ? galleryDetailStaticData.image : data!.image} />
        <GalleryDetailSection galleryDetail={isLoading ? galleryDetailStaticData : data!} />
        <hr />
      </Wrapper>
    </>
  );
};

GalleryDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const galleriesGenerationArray = await getGalleries();
  const paths = getPaths(galleriesGenerationArray, 'gallery');
  return {
    paths,
    fallback: true,
  };
};

export async function getStaticProps({ params }: { params: { gallery_id: string } }) {
  const galleryDeatilStaticData = await getGalleryDetail(params.gallery_id);
  return {
    props: {
      galleryDetailStaticData: galleryDeatilStaticData,
    },
    revalidate: 86400,
  };
}

export default GalleryDetail;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  &hr {
    background: ${GreyScale.light};
  }
`;
