import { ArchivingArrayType, IProjectData, IProjectDetail, ResponseData } from '@@types/request';
import axios from 'axios';
import { url } from '.';

export async function getProjects() {
  const data = await axios
    .get<ResponseData<ArchivingArrayType<IProjectData>>>(`${url}/api/project`)
    .then((res) => res.data.data);
  return data;
}

export async function getProjectDetail(id: string) {
  const data = await axios.get<ResponseData<IProjectDetail>>(`${url}/api/project/${id}`).then((res) => res.data.data);
  return data;
}

// 갤러리 페이지 프로젝트 탭 전용 — 위 getProjects/getProjectDetail은 다른(구) 응답 스키마를 쓰는
// 레거시 /project 페이지 전용이라 건드리지 않음
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
