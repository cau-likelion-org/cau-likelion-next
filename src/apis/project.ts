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

export type ProjectCategory = 'IDEATHON' | 'HACKATHON' | 'CHUNGKATHON' | 'ETC';

export interface ProjectListItem {
  id: number;
  generationNumber: number;
  title: string;
  category: ProjectCategory;
  banner: string;
}

// 랜딩페이지 프로젝트 캐러셀 전용 — 기존 /project 페이지의 getProjects()는 다른(구) 응답 스키마를 쓰고 있어 건드리지 않음
export async function getProjectList() {
  const { data } = await axios.get<ProjectListItem[]>(`${url}/api/projects`);
  return data;
}
