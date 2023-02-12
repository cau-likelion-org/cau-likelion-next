import { IProjectDetail } from '@@types/request';
import axios from 'axios';
import backupData from './backup/projectDetail.json';
export async function getProjectDetail(id: string) {
  try {
    const res = await axios.get<IProjectDetail>(
      `https://286eb829-af4d-43ed-b788-0e8e70ae0820.mock.pstmn.io/project/${id}`,
      //내맘대로 적은 url임 이런 api없음 바꿔줘야댐
    );
    return res.data;
  } catch (err) {
    console.log(err);
    return new Promise<IProjectDetail>((resolve) => resolve(backupData as any));
  }
}
