import axios from 'axios';
import { url } from '.';

export interface TrackResponse {
  id: number;
  koName: string;
  enName: string;
  introduction: string;
  techStack: string[];
}

export interface TrackRequest {
  koName: string;
  enName: string;
  introduction: string;
  techStack: string[];
}

export async function getTracks() {
  const { data } = await axios.get<TrackResponse[]>(`${url}/api/admin/tracks`);
  return data;
}

export const createTrack = (form: TrackRequest) => {
  return axios.post<TrackResponse>(`${url}/api/admin/tracks`, form).then((res) => res.data);
};

export const updateTrack = (id: number, form: TrackRequest) => {
  return axios.put<TrackResponse>(`${url}/api/admin/tracks/${id}`, form).then((res) => res.data);
};

export const deleteTrack = (id: number) => {
  return axios.delete(`${url}/api/admin/tracks/${id}`);
};
