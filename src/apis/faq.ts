import axios from 'axios';
import { url } from '.';

export interface FaqResponse {
  id: number;
  question: string;
  answer: string;
}

export interface FaqRequest {
  question: string;
  answer: string;
}

export async function getFaqs() {
  const { data } = await axios.get<FaqResponse[]>(`${url}/api/admin/faqs`);
  return data;
}

export const createFaq = (form: FaqRequest) => {
  return axios.post<FaqResponse>(`${url}/api/admin/faqs`, form).then((res) => res.data);
};

export const updateFaq = (id: number, form: FaqRequest) => {
  return axios.put<FaqResponse>(`${url}/api/admin/faqs/${id}`, form).then((res) => res.data);
};

export const deleteFaq = (id: number) => {
  return axios.delete(`${url}/api/admin/faqs/${id}`);
};
