import { RequestEditUserScore, UserAttendance } from '@@types/request';
import { IToken } from '@utils/state';
import axios from 'axios';
import { getAuthAxios } from './authAxios';
import { ResponseData } from '@@types/request';
import { url } from '.';

export const getUserAttendance = async (token: IToken) => {
    const authAxios = getAuthAxios(token);
    const data = await axios.get<ResponseData<UserAttendance>>(`${url}/mypage/attendance`,
        {
            headers: {
                Authorization: `Bearer ${token.access}`
            }
        }).then(
            res => res.data.data
        );
    return data;
};

export const getTotalAttendance = async (token: IToken) => {
    const authAxios = getAuthAxios(token);
    const data = await axios.get<ResponseData<UserAttendance[]>>(`${url}/mypage/attendance`, {
        headers: {
            Authorization: `Bearer ${token.access}`
        }
    }
    )
        .then(res => res.data.data);
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
    return axios.post(`${url}/mypage/attendance/`, {
        user_id: userScore.user_id,
        truancy: userScore.truancy,
        absence: userScore.absence,
        tardiness: userScore.tardiness,
    },
        {
            headers: {
                Authorization: `Bearer ${token.access}`
            }
        });
}

export function makeAttendance(date: string, password: string, token: IToken) {
    const authAxios = getAuthAxios(token);
    return axios
        .post(`${url}/attendance/secret`, {
            date,
            password,
        },
            {
                headers: {
                    Authorization: `Bearer ${token.access}`
                }
            })
        .then((res) => res.data.data);
}
