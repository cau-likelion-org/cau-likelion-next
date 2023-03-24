import { ArchivingArrayType, IGalleryData, IGalleryDetail, ResponseData } from '@@types/request';
import axios from 'axios';

export async function getGalleries() {
  const data = await axios.get<ResponseData<ArchivingArrayType<IGalleryData>>>(
    'https://api-cau-likelion.shop/api/gallery',
  ).then(res => res.data.data);
  return data;
}

export async function getGalleryDetail(id: string) {
  const data = await axios.get<ResponseData<IGalleryDetail>>(
    `https://api-cau-likelion.shop/api/gallery/${id}`,
  ).then(res => res.data.data);
  return data;
}
