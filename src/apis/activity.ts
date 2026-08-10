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

export async function getActivities() {
  const { data } = await axios.get<ActivityResponse[]>(`${url}/api/admin/activities`);
  return data;
}
