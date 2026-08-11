import axios from 'axios';
import { url } from '.';

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
  return axios.get<SessionListItem[]>(`${url}/api/sessions`).then((res) => res.data);
};

export const getSession = (id: number) => {
  return axios.get<SessionDetail>(`${url}/api/sessions/${id}`).then((res) => res.data);
};
