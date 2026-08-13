import axios from 'axios';
import { url } from '.';

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

export const getIntroduce = () => {
  return axios.get<IntroduceResponse>(`${url}/api/admin/indicator`).then((res) => res.data);
};

export const updateIntroduce = (form: IntroduceRequest) => {
  return axios.put<IntroduceResponse>(`${url}/api/admin/indicator`, form).then((res) => res.data);
};
