import axios from 'axios';
import { url } from '.';

export interface TrackResponse {
  id: number;
  koName: string;
  enName: string;
  introduction: string;
  techStack: string[];
}

export async function getTracks() {
  const { data } = await axios.get<TrackResponse[]>(`${url}/api/admin/tracks`);
  return data;
}
