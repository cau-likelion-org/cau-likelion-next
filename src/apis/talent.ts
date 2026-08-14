import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export interface TalentResponse {
  id: number;
  partName: string;
  content: string;
}

export interface TalentRequest {
  partName: string;
  content: string;
}

export const getTalents = () => {
  return axios.get<TalentResponse[]>(`${url}/api/admin/desired-talents`).then((res) => res.data);
};

export const createTalent = (token: IToken, form: TalentRequest) => {
  return getAuthAxios(token)
    .post<TalentResponse>('/api/admin/desired-talents', form)
    .then((res) => res.data);
};

export const updateTalent = (token: IToken, id: number, form: TalentRequest) => {
  return getAuthAxios(token)
    .put<TalentResponse>(`/api/admin/desired-talents/${id}`, form)
    .then((res) => res.data);
};

export const deleteTalent = (token: IToken, id: number) => {
  return getAuthAxios(token).delete(`/api/admin/desired-talents/${id}`);
};
