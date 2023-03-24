import { ISessionDetail, ArchivingArrayType, ISessionData, ResponseData } from '@@types/request';
import axios from 'axios';
import { url } from '.';

export async function getSessionDetail(id: string) {
    const data = await axios.get<ResponseData<ISessionDetail>>(
        `${url}/api/session/${id}`,
    ).then(res => res.data.data);

    return data;
}

export async function getSessions() {
    const data = await axios.get<ResponseData<ArchivingArrayType<ISessionData>>>(
        `${url}/api/session`,
    ).then(res => res.data.data);

    return data;
}