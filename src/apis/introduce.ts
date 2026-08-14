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

// 퍼블릭 랜딩페이지 IntroduceSection에서도 그대로 재사용하는 조회용 API라 인증 없이 호출
export const getIntroduce = () => {
  return axios.get<IntroduceResponse>(`${url}/api/admin/indicator`).then((res) => res.data);
};

export const updateIntroduce = (token: IToken, form: IntroduceRequest) => {
  return getAuthAxios(token)
    .put<IntroduceResponse>('/api/admin/indicator', form)
    .then((res) => res.data);
};
