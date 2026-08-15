import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

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

export interface HistoryCreateRequestPayload {
  generationId: number;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  thumbnailUrl?: string;
  imageUrls: string[];
}

export interface HistoryUpdateRequestPayload {
  generationId: number;
  title: string;
  description?: string;
  startDate: string;
  endDate?: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
}

export const createHistory = (token: IToken, payload: HistoryCreateRequestPayload) => {
  return getAuthAxios(token)
    .post<HistoryDetail>('/api/histories', payload)
    .then((res) => res.data);
};

export const updateHistory = (token: IToken, id: number, payload: HistoryUpdateRequestPayload) => {
  return getAuthAxios(token)
    .put<HistoryDetail>(`/api/histories/${id}`, payload)
    .then((res) => res.data);
};

export const deleteHistory = (token: IToken, id: number) => {
  return getAuthAxios(token).delete(`/api/histories/${id}`);
};
