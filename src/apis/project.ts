import { ArchivingArrayType, IProjectData } from '@@types/request';
import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export const PROJECT_DELETED_FLAG_KEY = 'project_deleted';
export const PROJECT_CREATED_FLAG_KEY = 'project_created';
export const PROJECT_UPDATED_FLAG_KEY = 'project_updated';

export const PROJECT_CATEGORY_LABEL: Record<ProjectCategoryCode, string> = {
  IDEATHON: '아이디어톤',
  HACKATHON: '해커톤',
  CHUNGKATHON: '중커톤',
  ETC: '기타',
};

const sortImagesByOrder = (images: ProjectImageDto[]) => [...images].sort((a, b) => a.displayOrder - b.displayOrder);

export const getProjectThumbnail = (images: ProjectImageDto[]) => {
  const sorted = sortImagesByOrder(images);
  return (sorted.find((image) => image.isMain) ?? sorted[0])?.imageUrl ?? '';
};

export const getSortedProjectImages = (images: ProjectImageDto[]) =>
  sortImagesByOrder(images).map((image) => image.imageUrl);

export async function getProjects(): Promise<ArchivingArrayType<IProjectData>> {
  const { data } = await axios.get<ProjectResponseDto[]>(`${url}/api/projects`, { timeout: 5000 });

  return data.reduce<ArchivingArrayType<IProjectData>>((grouped, project) => {
    const generation = String(project.generationNumber);
    (grouped[generation] ??= []).push({
      id: project.id,
      title: project.title,
      thumbnail: getProjectThumbnail(project.images),
      subtitle: project.tagline,
      description: project.summary,
      category: PROJECT_CATEGORY_LABEL[project.category],
      banner: project.banner,
      startDate: project.startDate,
    });
    return grouped;
  }, {});
}

export async function getProjectDetail(id: string) {
  const { data } = await axios.get<ProjectResponseDto>(`${url}/api/projects/${id}`, { timeout: 5000 });
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
  isExposed: boolean;
}

// 랜딩페이지 프로젝트 캐러셀 전용 — GET /api/projects 응답 중 캐러셀에 필요한 필드만 사용
export async function getProjectList() {
  const { data } = await axios.get<ProjectListItem[]>(`${url}/api/projects`);
  return data;
}

export interface AdminProjectListItem {
  id: number;
  title: string;
  generationNumber: number;
  category: ProjectCategory;
  isExposed: boolean;
}

export const getAdminProjectList = () => {
  return axios.get<AdminProjectListItem[]>(`${url}/api/projects`).then((res) => res.data);
};

export const updateProjectExposure = (token: IToken, exposedProjectIds: number[]) => {
  return getAuthAxios(token)
    .put<AdminProjectListItem[]>('/api/admin/landing/projects/exposure', { exposedProjectIds })
    .then((res) => res.data);
};
