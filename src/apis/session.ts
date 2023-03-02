import { IArchivingData, ArchivingArrayType, ISessionData } from '@@types/request';
import axios from 'axios';
import backupData from './backup/sessionData.json';

export async function getSessions() {
    try {
        const res = await axios.get<ArchivingArrayType<ISessionData>>(`https://b3551adf-6020-42dc-b998-c947dbd93919.mock.pstmn.io/session`,
        );

        return res.data;
    } catch (err) {
        console.log(err);
        return new Promise<ArchivingArrayType<ISessionData>>((resolve)=> resolve(backupData));
    }
    }
