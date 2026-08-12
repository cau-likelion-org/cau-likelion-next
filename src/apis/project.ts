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
