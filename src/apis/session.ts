import { ISessionDetail, ArchivingArrayType, ISessionData, ResponseData } from '@@types/request';
import axios from 'axios';

export async function getSessionDetail(id: string) {
    const data = await axios.get<ResponseData<ISessionDetail>>(
        `https://api-cau-likelion.shop/api/session/${id}`,
    ).then(res => res.data.data);

    return data;
}

export async function getSessions() {
    const data = await axios.get<ResponseData<ArchivingArrayType<ISessionData>>>(
        'https://api-cau-likelion.shop/api/session',
    ).then(res => res.data.data);

    return data;
}