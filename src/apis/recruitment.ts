import axios from 'axios';
import { url } from '.';

export interface AvailablePart {
  id: number;
  name: string;
}

export interface RecruitmentSubscribeRequest {
  email: string;
  name: string;
  interestPartIds: number[];
}

export interface RecruitmentSubscriberResponse {
  id: number;
  email: string;
  name: string;
  interestParts: AvailablePart[];
  registeredAt: string;
}

export const getAvailableParts = () => {
  return axios.get<AvailablePart[]>(`${url}/api/recruitment/subscribers/available-parts`).then((res) => res.data);
};

export const subscribeRecruitment = (payload: RecruitmentSubscribeRequest) => {
  return axios
    .post<RecruitmentSubscriberResponse>(`${url}/api/recruitment/subscribers`, payload)
    .then((res) => res.data);
};
