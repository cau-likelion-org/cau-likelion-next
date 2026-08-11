import axios from 'axios';
import { url } from '.';

export interface FaqResponse {
  id: number;
  question: string;
  answer: string;
}

export async function getFaqs() {
  const { data } = await axios.get<FaqResponse[]>(`${url}/api/admin/faqs`);
  return data;
}
