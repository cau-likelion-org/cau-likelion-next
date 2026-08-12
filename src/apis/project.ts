import { ArchivingArrayType, IProjectData, IProjectDetail, ResponseData } from '@@types/request';
import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export const PROJECT_DELETED_FLAG_KEY = 'project_deleted';
export const PROJECT_CREATED_FLAG_KEY = 'project_created';
export const PROJECT_UPDATED_FLAG_KEY = 'project_updated';

export async function getProjects() {
  const data = await axios
    .get<ResponseData<ArchivingArrayType<IProjectData>>>(`${url}/api/project`, { timeout: 5000 })
    .then((res) => res.data.data);
  return data;
}

export async function getProjectDetail(id: string) {
  const data = await axios
    .get<ResponseData<IProjectDetail>>(`${url}/api/project/${id}`, { timeout: 5000 })
    .then((res) => res.data.data);
  return data;
}

export type ProjectCategoryCode = 'IDEATHON' | 'HACKATHON' | 'CHUNGKATHON' | 'ETC';
export type LinkPlatform = 'GITHUB' | 'WEB' | 'BEHANCE';

export interface ProjectImagePayload {
  imageUrl: string;
  isMain: boolean;
  displayOrder: number;
}

export interface ProjectLinkPayload {
  platform: LinkPlatform;
  url: string;
}

export interface ProjectMemberPayload {
  name: string;
  part: string;
}

export interface ProjectRequestPayload {
  generationId: number;
  title: string;
  category: ProjectCategoryCode;
  stack: string;
  tagline: string;
  summary: string;
  teamName: string;
  startDate: string;
  endDate: string;
  banner?: string;
  images: ProjectImagePayload[];
  links: ProjectLinkPayload[];
  members: ProjectMemberPayload[];
}

export interface ProjectImageDto {
  id: number;
  imageUrl: string;
  isMain: boolean;
  displayOrder: number;
}

export interface ProjectLinkDto {
  id: number;
  platform: LinkPlatform;
  url: string;
}

export interface ProjectMemberDto {
  id: number;
  name: string;
  part: string;
}

export interface ProjectResponseDto {
  id: number;
  generationId: number;
  generationNumber: number;
  title: string;
  category: ProjectCategoryCode;
  stack: string;
  tagline: string;
  summary: string;
  teamName: string;
  startDate: string;
  endDate: string;
  banner: string;
  images: ProjectImageDto[];
  links: ProjectLinkDto[];
  members: ProjectMemberDto[];
}

export interface GenerationListItem {
  id: number;
  number: number;
  year: number;
  status: 'BEFORE_ACTIVITY' | 'IN_ACTIVITY' | 'AFTER_ACTIVITY';
  parts: { id: number; name: string }[];
}

export const getGenerations = async (token: IToken) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get<GenerationListItem[]>('/api/generations');
  return response.data;
};

export const getProjectById = async (token: IToken, id: number) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get<ProjectResponseDto>(`/api/projects/${id}`);
  return response.data;
};

export const createProject = async (token: IToken, payload: ProjectRequestPayload) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.post<ProjectResponseDto>('/api/projects', payload);
  return response.data;
};

export const updateProject = async (token: IToken, id: number, payload: ProjectRequestPayload) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.put<ProjectResponseDto>(`/api/projects/${id}`, payload);
  return response.data;
};

export const deleteProject = async (token: IToken, id: number) => {
  const authAxios = getAuthAxios(token);
  await authAxios.delete(`/api/projects/${id}`);
};

export interface FileUploadResponse {
  url: string;
}

export const uploadProjectImage = async (token: IToken, file: File) => {
  const authAxios = getAuthAxios(token);
  const formData = new FormData();
  formData.append('file', file);
  const response = await authAxios.post<FileUploadResponse>('/api/files/PROJECT', formData);
  return response.data.url;
};

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
