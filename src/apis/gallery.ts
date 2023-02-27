import { ArchivingArrayType, IGalleryData, IGalleryDetail } from '@@types/request';
import axios from 'axios';
import galleryBackupData from './backup/gallery.json';
import galleryDetailBackupData from './backup/galleryDetail.json';

export async function getGalleries() {
  try {
    const res = await axios.get<ArchivingArrayType<IGalleryData>>(`/galleries/gallery/`);
    return res.data;
  } catch (err) {
    console.log(err);
    return new Promise<ArchivingArrayType<IGalleryData>>((resolve) => resolve(galleryBackupData));
  }
}
export async function getGalleryDetail(id: string) {
  try {
    const res = await axios.get<IGalleryDetail>(`/galleries/gallery/${id}`);
    return res.data;
  } catch (err) {
    return new Promise<IGalleryDetail>((resolve) => resolve(galleryDetailBackupData as any));
  }
}
