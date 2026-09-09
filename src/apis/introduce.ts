import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export interface IntroduceResponse {
  id: number;
  cumulativeGenerations: string;
  cumulativeGraduates: string;
  cumulativeProjects: string;
}

export interface IntroduceRequest {
  cumulativeGenerations: string;
  cumulativeGraduates: string;
  cumulativeProjects: string;
}

export const getIntroduce = (token?: IToken) => {
  if (token)
    return getAuthAxios(token)
      .get<IntroduceResponse>('/api/admin/indicator')
      .then((res) => res.data);
  return axios.get<IntroduceResponse>(`${url}/api/admin/indicator`).then((res) => res.data);
};

export const updateIntroduce = (token: IToken, form: IntroduceRequest) => {
  return getAuthAxios(token)
    .put<IntroduceResponse>('/api/admin/indicator', form)
    .then((res) => res.data);
};
