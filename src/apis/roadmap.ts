import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export interface RoadmapResponse {
  id: number;
  imageUrl: string;
}

export const getRoadmap = async () => {
  try {
    const { data } = await axios.get<RoadmapResponse>(`${url}/api/admin/roadmap`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
};

export const addRoadmap = (token: IToken, imageUrl: string) => {
  return getAuthAxios(token)
    .post<RoadmapResponse>('/api/admin/roadmap', { imageUrl })
    .then((res) => res.data);
};
