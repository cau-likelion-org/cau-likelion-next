import { GalleryListType, IGalleryDetail } from '@@types/request';
import axios from 'axios';
import galleryBackupData from './backup/gallery.json';
import galleryDetailBackupData from './backup/galleryDetail.json';

export async function getGalleries() {
    try {
        const res = await axios.get<GalleryListType>(
            `https://286eb829-af4d-43ed-b788-0e8e70ae0820.mock.pstmn.io/galleries`,
        );
        return res.data;
    } catch (err) {
        return new Promise<GalleryListType>((resolve) => resolve(galleryBackupData));
    }
}
export async function getGalleryDetail(id: string) {
    try {
        const res = await axios.get<IGalleryDetail>(
            `https://286eb829-af4d-43ed-b788-0e8e70ae0820.mock.pstmn.io/gallery/${id}`,
        );
        return res.data;
    } catch (err) {
        return new Promise<IGalleryDetail>((resolve) => resolve(galleryDetailBackupData as any));
    }
}
