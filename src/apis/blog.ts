import axios from 'axios';
import { url } from '.';

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
  createdAt: string;
}

export async function getBlogs() {
  const { data } = await axios.get<BlogResponse[]>(`${url}/api/blogs`);
  return data;
}
