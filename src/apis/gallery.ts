import { ArchivingArrayType, IGalleryData, IGalleryDetail, ResponseData } from '@@types/request';
import axios from 'axios';
import { url } from '.';

export async function getGalleries() {
  const response = await axios.get<ResponseData<ArchivingArrayType<IGalleryData>>>(`${url}/api/gallery`);
  return response.data.data;
}

export async function getGalleryDetail(id: string) {
  const response = await axios.get<ResponseData<IGalleryDetail>>(`${url}/api/gallery/${id}`);
  return response.data.data;
}
