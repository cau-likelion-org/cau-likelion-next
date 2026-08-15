import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

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

export async function getTracks(token?: IToken) {
  const { data } = token
    ? await getAuthAxios(token).get<TrackResponse[]>('/api/admin/tracks')
    : await axios.get<TrackResponse[]>(`${url}/api/admin/tracks`);
  return data;
}

export const createTrack = (token: IToken, form: TrackRequest) => {
  return getAuthAxios(token)
    .post<TrackResponse>('/api/admin/tracks', form)
    .then((res) => res.data);
};

export const updateTrack = (token: IToken, id: number, form: TrackRequest) => {
  return getAuthAxios(token)
    .put<TrackResponse>(`/api/admin/tracks/${id}`, form)
    .then((res) => res.data);
};

export const deleteTrack = (token: IToken, id: number) => {
  return getAuthAxios(token).delete(`/api/admin/tracks/${id}`);
};
