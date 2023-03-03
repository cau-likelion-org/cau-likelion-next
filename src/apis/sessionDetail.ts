import { ISessionDetail } from '@@types/request';
import axios from 'axios';
import backupData from './backup/sessionDetail.json';

export async function getSessionDetail(id: string) {
  try {
    const res = await axios.get<ISessionDetail>(`/api/sessions/session/${id}`);

    return res.data;
  } catch (err) {
    console.log(err);
    return new Promise<ISessionDetail>((resolve) => resolve(backupData as any));
  }
}
