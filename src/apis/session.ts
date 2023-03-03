import { IArchivingData, ArchivingArrayType, ISessionData } from '@@types/request';
import axios from 'axios';
import backupData from './backup/sessionData.json';

export async function getSessions() {
  try {
    const res = await axios.get<IArchivingData>(`/api/sessions/session`);

    return res.data;
  } catch (err) {
    console.log(err);
    return new Promise<ArchivingArrayType<ISessionData>>((resolve) => resolve(backupData));
  }
}
