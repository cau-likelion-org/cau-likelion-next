import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export interface FaqResponse {
  id: number;
  question: string;
  answer: string;
}

export interface FaqRequest {
  question: string;
  answer: string;
}

// 퍼블릭 랜딩페이지 FAQSection에서도 그대로 재사용하는 조회용 API라 인증 없이 호출
export async function getFaqs() {
  const { data } = await axios.get<FaqResponse[]>(`${url}/api/admin/faqs`);
  return data;
}

export const createFaq = (token: IToken, form: FaqRequest) => {
  return getAuthAxios(token)
    .post<FaqResponse>('/api/admin/faqs', form)
    .then((res) => res.data);
};

export const updateFaq = (token: IToken, id: number, form: FaqRequest) => {
  return getAuthAxios(token)
    .put<FaqResponse>(`/api/admin/faqs/${id}`, form)
    .then((res) => res.data);
};

export const deleteFaq = (token: IToken, id: number) => {
  return getAuthAxios(token).delete(`/api/admin/faqs/${id}`);
};
