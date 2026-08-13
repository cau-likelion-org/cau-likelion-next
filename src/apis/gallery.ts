import axios from 'axios';
import { url } from '.';

export type GalleryProjectCategory = 'IDEATHON' | 'HACKATHON' | 'CHUNGKATHON' | 'ETC';

export interface GalleryProjectItem {
  id: number;
  generationId: number;
  generationNumber: number;
  title: string;
  category: GalleryProjectCategory;
  stack: string;
  tagline: string;
  summary: string;
  teamName: string;
  startDate: string;
  endDate: string;
  banner: string;
  images: { id: number; imageUrl: string; isMain: boolean; displayOrder: number }[];
  links: { id: number; platform: 'GITHUB' | 'WEB' | 'BEHANCE'; url: string }[];
  members: { id: number; name: string; part: string }[];
}

export const getGalleryProjectList = () => {
  return axios.get<GalleryProjectItem[]>(`${url}/api/projects`).then((res) => res.data);
};
