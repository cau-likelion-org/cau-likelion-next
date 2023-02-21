import { ISessionDetail } from '@@types/request';
import axios from 'axios';
import backupData from './backup/sessionDetail.json';
export async function getSessionDetail(id: string) {
    try {
    const res = await axios.get<ISessionDetail>(
    `https://286eb829-af4d-43ed-b788-0e8e70ae0820.mock.pstmn.io/project/${id}`,

    );
    return res.data;
    } catch (err) {
    console.log(err);
    return new Promise<ISessionDetail>((resolve) => resolve(backupData as any));   
}
    
}