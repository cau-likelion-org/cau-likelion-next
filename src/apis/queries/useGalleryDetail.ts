import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { IGalleryDetail } from '@@types/request';
import { getGalleryDetail } from '../gallery';
import { getIdFromAsPath } from '@utils/index';

const useGalleryDetail = () => {
  const router = useRouter();

  const { data, isLoading } = useQuery<IGalleryDetail>(['galleryDetail', router.asPath], () =>
    getGalleryDetail(getIdFromAsPath(router.asPath, 'gallery')),
  );

  return { galleryDetail: data, isLoading };
};

export default useGalleryDetail;
