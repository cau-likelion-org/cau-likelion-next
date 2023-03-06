import { useRouter } from 'next/router';
import { ReactElement } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';

import Carousel from '@archiving/Carousel';
import LayoutArchiving from '@common/layout/LayoutArchiving';
import { IGalleryDetail } from '@@types/request';
import { GreyScale } from '@utils/constant/color';
import { GetStaticPaths } from 'next';
import { getGalleryDetail } from 'src/apis/gallery';
import GalleryDetailSection from '@gallery/GalleryDetailSection';

const GalleryDetail = ({ galleryDetailStaticData }: { galleryDetailStaticData: IGalleryDetail; }) => {
  const router = useRouter();
  const { data, isLoading } = useQuery<IGalleryDetail>(['galleryDeatil', router.query.project_id], () =>
    getGalleryDetail(router.query.project_id as string),
  );

  if (router.isFallback) {
    return <div>로딩중</div>;
  }
  return (
    <Wrapper>
      <Carousel images={isLoading ? galleryDetailStaticData.thumbnail : data!.thumbnail} />
      <GalleryDetailSection galleryDetail={isLoading ? galleryDetailStaticData : data!} />
      <hr />
    </Wrapper>
  );
};

GalleryDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutArchiving>{page}</LayoutArchiving>;
};

export const getStaticPaths: GetStaticPaths = (async) => {
  return {
    paths: [{ params: { gallery_id: '1' } }],
    fallback: true,
  };
};

export async function getStaticProps({ params }: { params: { gallery_id: string; }; }) {
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
  width: 100%;
  height: 100%;
  &hr {
    background: ${GreyScale.light};
  }
`;
