import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export interface CurriculumResponse {
  id: number;
  trackId: number;
  trackKoName: string;
  week: string;
  title: string;
  description: string;
}

export interface CurriculumRequest {
  trackId: number;
  week: string;
  title: string;
  description: string;
}

export const getCurriculums = (token?: IToken) => {
  if (token)
    return getAuthAxios(token)
      .get<CurriculumResponse[]>('/api/admin/curriculums')
      .then((res) => res.data);
  return axios.get<CurriculumResponse[]>(`${url}/api/admin/curriculums`).then((res) => res.data);
};

export const createCurriculum = (token: IToken, form: CurriculumRequest) => {
  return getAuthAxios(token)
    .post<CurriculumResponse>('/api/admin/curriculums', form)
    .then((res) => res.data);
};

export const updateCurriculum = (token: IToken, id: number, form: CurriculumRequest) => {
  return getAuthAxios(token)
    .put<CurriculumResponse>(`/api/admin/curriculums/${id}`, form)
    .then((res) => res.data);
};

export const deleteCurriculum = (token: IToken, id: number) => {
  return getAuthAxios(token).delete(`/api/admin/curriculums/${id}`);
};
