import { ArchivingArrayType, IGalleryData } from '@@types/request';
import { useQuery } from 'react-query';
import { getGalleries } from '../gallery';

const useGalleries = () => {
  const { data, isLoading } = useQuery<ArchivingArrayType<IGalleryData>>(['galleries'], getGalleries);

  return { galleries: data, isLoading };
};

export default useGalleries;
