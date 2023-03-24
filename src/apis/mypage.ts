import { RequestEditUserScore, UserAttendance } from '@@types/request';
import { IToken } from '@utils/state';
import axios from 'axios';
import { getAuthAxios } from './authAxios';
import { ResponseData } from '@@types/request';
import { url } from '.';

export const getUserAttendance = async (token: IToken) => {
    const authAxios = getAuthAxios(token);
    const data = await authAxios
        .get<ResponseData<UserAttendance>>(`/api/mypage/attendance`)
        .then((res) => res.data.data);
    return data;
};

export const getTotalAttendance = async (token: IToken) => {
    const authAxios = getAuthAxios(token);
    const data = await authAxios
        .get<ResponseData<UserAttendance[]>>(`/api/mypage/attendance`)
        .then((res) => res.data.data);
    return data;
};

export const getAssignments = () => {
    const data = axios
        .get(`https://notion-api.splitbee.io/v1/table/${process.env.NEXT_PUBLIC_NOTION_DATABASE_ID}`)
        .then((res) => res.data);
    return data;
};

export function editUserScore(userScore: RequestEditUserScore, token: IToken) {
    const authAxios = getAuthAxios(token);
    return authAxios.post(`/api/mypage/attendance/`, {
        user_id: userScore.user_id,
        truancy: userScore.truancy,
        absence: userScore.absence,
        tardiness: userScore.tardiness,
    });
}

export function makeAttendance(date: string, password: string, token: IToken) {
    const authAxios = getAuthAxios(token);
    return authAxios
        .post(`/api/attendance/secret`, {
            date,
            password,
        })
        .then((res) => res.data.data);
}
