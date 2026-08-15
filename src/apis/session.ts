import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export interface SessionListItem {
  id: number;
  title: string;
  thumbnailUrl: string;
  partName: string;
  generationNumber: number;
  degree: number;
}

export interface SessionDetail extends SessionListItem {
  description: string;
  sessionDate: string;
  imageUrls: string[];
}

export const getSessionList = () => {
  return axios.get<SessionListItem[]>(`${url}/api/gallery/sessions`).then((res) => res.data);
};

export const getSession = (id: number) => {
  return axios.get<SessionDetail>(`${url}/api/gallery/sessions/${id}`).then((res) => res.data);
};

export interface SessionCreateRequestPayload {
  partName: string;
  generationNumber: number;
  title: string;
  description: string;
  sessionDate: string;
  degree: number;
  thumbnailUrl?: string;
  imageUrls?: string[];
}

export type SessionUpdateRequestPayload = Partial<SessionCreateRequestPayload>;

export const createSession = (token: IToken, payload: SessionCreateRequestPayload) => {
  return getAuthAxios(token)
    .post<SessionDetail>('/api/gallery/sessions', payload)
    .then((res) => res.data);
};

export const updateSession = (token: IToken, id: number, payload: SessionUpdateRequestPayload) => {
  return getAuthAxios(token)
    .patch<SessionDetail>(`/api/gallery/sessions/${id}`, payload)
    .then((res) => res.data);
};

export const deleteSession = (token: IToken, id: number) => {
  return getAuthAxios(token).delete(`/api/gallery/sessions/${id}`);
};
