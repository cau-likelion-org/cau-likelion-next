import { ArchivingArrayType, IGalleryData, IGalleryDetail, ResponseData } from '@@types/request';
import axios from 'axios';
import { url } from '.';

export async function getGalleries() {
  const data = await axios
    .get<ResponseData<ArchivingArrayType<IGalleryData>>>(`${url}/api/gallery`)
    .then((res) => res.data.data);
  return data;
}

export async function getGalleryDetail(id: string) {
  const data = await axios.get<ResponseData<IGalleryDetail>>(`${url}/api/gallery/${id}`).then((res) => res.data.data);
  return data;
}
