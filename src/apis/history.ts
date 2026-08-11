import axios from 'axios';
import { url } from '.';

export interface HistoryListItem {
  id: number;
  thumbnailUrl: string;
  title: string;
  generationNumber: number;
  startDate: string;
  endDate: string | null;
}

export interface HistoryDetail {
  id: number;
  title: string;
  generationNumber: number;
  description: string;
  startDate: string;
  endDate: string | null;
  imageUrls: string[];
}

export const getHistoryList = () => {
  return axios.get<HistoryListItem[]>(`${url}/api/histories`).then((res) => res.data);
};

export const getHistory = (id: number) => {
  return axios.get<HistoryDetail>(`${url}/api/histories/${id}`).then((res) => res.data);
};
