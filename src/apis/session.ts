import { ISessionDetail, ArchivingArrayType, ISessionData } from '@@types/request';
import axios from 'axios';
import sessionBackupData from './backup/sessionData.json';
import sessionDetailBackupData from './backup/sessionDetail.json';

export async function getSessionDetail(id: string) {
    try {
        const res = await axios.get<ISessionDetail>(
            `https://286eb829-af4d-43ed-b788-0e8e70ae0820.mock.pstmn.io/session/${id}`,
        );

        return res.data;
    } catch (err) {
        console.log(err);
        return new Promise<ISessionDetail>((resolve) => resolve(sessionDetailBackupData as any));
    }

}

export async function getSessions() {
    try {
        const res = await axios.get<ArchivingArrayType<ISessionData>>(`https://b3551adf-6020-42dc-b998-c947dbd93919.mock.pstmn.io/session`,
        );

        return res.data;
    } catch (err) {
        console.log(err);
        return new Promise<ArchivingArrayType<ISessionData>>((resolve) => resolve(sessionBackupData));
    }
}
