import axios from 'axios';
import { url } from '.';

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

export async function getActivities() {
  const { data } = await axios.get<ActivityResponse[]>(`${url}/api/admin/activities`);
  return data;
}

export const createActivity = (form: ActivityRequest) => {
  return axios.post<ActivityResponse>(`${url}/api/admin/activities`, form).then((res) => res.data);
};

export const updateActivity = (id: number, form: ActivityRequest) => {
  return axios.put<ActivityResponse>(`${url}/api/admin/activities/${id}`, form).then((res) => res.data);
};

export const deleteActivity = (id: number) => {
  return axios.delete(`${url}/api/admin/activities/${id}`);
};
