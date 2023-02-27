import { IProjectDetail } from '@@types/request';
import axios from 'axios';
import backupData from './backup/projectDetail.json';
export async function getProjectDetail(id: string) {
  try {
    const res = await axios.get<IProjectDetail>(
      `/projects/project/${id}`,
      //내맘대로 적은 url임 이런 api없음 바꿔줘야댐
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return new Promise<IProjectDetail>((resolve) => resolve(backupData as any));
  }
}
