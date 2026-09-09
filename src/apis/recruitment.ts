import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

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

// 관리자: 사전 알림 신청자 명단 / 발송 현황

export type RecruitmentTextStatus = 'SCHEDULED' | 'SENT' | 'CANCELLED';
export type RecipientStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface RecipientResponse {
  email: string;
  status: RecipientStatus;
}

export interface RecruitmentTextResponse {
  id: number;
  title: string;
  content: string;
  scheduledSendAt: string | null; // 취소된 공고는 null
  createdAt: string;
  targetCount: number;
  successCount: number;
  failedCount: number;
  recipients: RecipientResponse[];
  status: RecruitmentTextStatus;
}

export interface RecruitmentTextRequest {
  title: string;
  content: string;
  scheduledSendAt?: string;
  subscriberIds: number[];
}

export const getSubscribers = (interestPartName: string | undefined, token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios
    .get<RecruitmentSubscriberResponse[]>('/api/recruitment/subscribers', { params: { interestPartName } })
    .then((res) => res.data);
};

export const getSubscriberInterestParts = (token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios.get<string[]>('/api/recruitment/subscribers/interest-parts').then((res) => res.data);
};

export const getRecruitmentTexts = (token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios.get<RecruitmentTextResponse[]>('/api/recruitment/texts').then((res) => res.data);
};

export const getRecruitmentText = (id: number, token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios.get<RecruitmentTextResponse>(`/api/recruitment/texts/${id}`).then((res) => res.data);
};

export const createRecruitmentText = (form: RecruitmentTextRequest, token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios.post<RecruitmentTextResponse>('/api/recruitment/texts', form).then((res) => res.data);
};

export const updateRecruitmentText = (id: number, form: RecruitmentTextRequest, token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios.put<RecruitmentTextResponse>(`/api/recruitment/texts/${id}`, form).then((res) => res.data);
};

export const cancelRecruitmentText = (id: number, token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios.post(`/api/recruitment/texts/${id}/cancel`);
};

export const resendRecruitmentText = (id: number, token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios.post(`/api/recruitment/texts/${id}/resend`);
};
