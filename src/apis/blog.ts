import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export type BlogCategory = 'ACTIVITY_REVIEW' | 'PROJECT_REVIEW' | 'CAREER' | 'ETC';

export interface BlogResponse {
  id: number;
  generationId: number;
  generationNumber: number;
  title: string;
  thumbnailUrl: string;
  category: BlogCategory;
  summary: string;
  writer: string;
  url: string;
  publishedDate: string | null;
  createdAt: string;
}

export interface BlogRequest {
  generationId: number;
  writer: string;
  url: string;
  category: BlogCategory;
}

export async function getBlogs() {
  const { data } = await axios.get<BlogResponse[]>(`${url}/api/blogs`);
  return data;
}

export const createBlog = (token: IToken, form: BlogRequest) => {
  return getAuthAxios(token)
    .post<BlogResponse>('/api/blogs', form)
    .then((res) => res.data);
};

export const updateBlog = (token: IToken, id: number, form: BlogRequest) => {
  return getAuthAxios(token)
    .put<BlogResponse>(`/api/blogs/${id}`, form)
    .then((res) => res.data);
};

export const deleteBlog = (token: IToken, id: number) => {
  return getAuthAxios(token).delete(`/api/blogs/${id}`);
};
