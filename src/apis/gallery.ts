import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export type GalleryProjectCategory = 'IDEATHON' | 'HACKATHON' | 'CHUNGKATHON' | 'ETC';

export const GALLERY_PROJECT_CATEGORY_LABEL: Record<GalleryProjectCategory, string> = {
  IDEATHON: '아이디어톤',
  HACKATHON: '해커톤',
  CHUNGKATHON: '중커톤',
  ETC: '기타',
};

export interface GalleryProjectListItem {
  id: number;
  thumbnailUrl: string;
  title: string;
  generationNumber: number;
  category: GalleryProjectCategory;
  categoryDescription: string;
  startDate: string;
  endDate: string | null;
}

export interface GalleryProjectDetail {
  id: number;
  title: string;
  generationNumber: number;
  category: GalleryProjectCategory;
  categoryDescription: string;
  description: string;
  startDate: string;
  endDate: string | null;
  imageUrls: string[];
}

export const getGalleryProjectList = () => {
  return axios.get<GalleryProjectListItem[]>(`${url}/api/gallery/projects`).then((res) => res.data);
};

export const getGalleryProject = (id: number) => {
  return axios.get<GalleryProjectDetail>(`${url}/api/gallery/projects/${id}`).then((res) => res.data);
};

export interface GalleryProjectCreateRequestPayload {
  generationId: number;
  category: GalleryProjectCategory;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  thumbnailUrl?: string;
  imageUrls: string[];
}

export type GalleryProjectUpdateRequestPayload = Omit<GalleryProjectCreateRequestPayload, 'imageUrls'> & {
  imageUrls?: string[];
};

export const createGalleryProject = (token: IToken, payload: GalleryProjectCreateRequestPayload) => {
  return getAuthAxios(token)
    .post<GalleryProjectDetail>('/api/gallery/projects', payload)
    .then((res) => res.data);
};

export const updateGalleryProject = (token: IToken, id: number, payload: GalleryProjectUpdateRequestPayload) => {
  return getAuthAxios(token)
    .put<GalleryProjectDetail>(`/api/gallery/projects/${id}`, payload)
    .then((res) => res.data);
};

export const deleteGalleryProject = (token: IToken, id: number) => {
  return getAuthAxios(token).delete(`/api/gallery/projects/${id}`);
};
