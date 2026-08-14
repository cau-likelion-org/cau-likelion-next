import axios from 'axios';
import { IToken } from 'src/store/useTokenStore';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export type PageNavigation = 'INTRO_CURRICULUM' | 'PROJECT' | 'GALLERY_SESSION' | 'GALLERY_PROJECT' | 'GALLERY_MEMORY';

export interface ActivityResponse {
  id: number;
  name: string;
  imageUrl: string;
  introduction: string;
  description: string;
  buttonName: string;
  pageNavigation: PageNavigation;
}

export interface ActivityRequest {
  name: string;
  imageUrl: string;
  introduction: string;
  description: string;
  buttonName: string;
  pageNavigation: PageNavigation;
}

// 퍼블릭 랜딩페이지 ActivitySection에서도 그대로 재사용하는 조회용 API라 인증 없이 호출
export async function getActivities() {
  const { data } = await axios.get<ActivityResponse[]>(`${url}/api/admin/activities`);
  return data;
}

export const createActivity = (token: IToken, form: ActivityRequest) => {
  return getAuthAxios(token)
    .post<ActivityResponse>('/api/admin/activities', form)
    .then((res) => res.data);
};

export const updateActivity = (token: IToken, id: number, form: ActivityRequest) => {
  return getAuthAxios(token)
    .put<ActivityResponse>(`/api/admin/activities/${id}`, form)
    .then((res) => res.data);
};

export const deleteActivity = (token: IToken, id: number) => {
  return getAuthAxios(token).delete(`/api/admin/activities/${id}`);
};
