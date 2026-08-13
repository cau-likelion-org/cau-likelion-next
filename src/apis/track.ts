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

// 퍼블릭 랜딩페이지 TrackSection에서도 그대로 재사용하는 조회용 API라 인증 없이 호출
export async function getTracks() {
  const { data } = await axios.get<TrackResponse[]>(`${url}/api/admin/tracks`);
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
