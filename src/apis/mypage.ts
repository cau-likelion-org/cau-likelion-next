import { RequestEditUserScore, UserAttendance } from "@@types/request";
import { IToken } from "@utils/state";
import axios from "axios";
import { getAuthAxios } from "./authAxios";

export const getUserAttendance = async (token: IToken) => {
    const authAxios = getAuthAxios(token);
    const response = await authAxios.get(`/api/mypage/attendance`);
    return response.data as UserAttendance;
    // return {
    //   name: '윤선영',
    //   track: 2,
    //   absence: 3,
    //   truancy: 1,
    //   tardiness: 2,
    // };
};

export const getTotalAttendance = async (token: IToken) => {
    const authAxios = getAuthAxios(token);
    const response = await authAxios.get(`/api/mypage/attendance`);
    return response.data as UserAttendance[];

    // return [{
    //     name: '윤선영',
    //     track: 2,
    //     absence: 3,
    //     truancy: 1,
    //     tardiness: 2,
    // }, {
    //     name: '김솔',
    //     track: 0,
    //     absence: 3,
    //     truancy: 1,
    //     tardiness: 2,
    // }];
};

export const getAssignments = () => {
    const data = axios.get(
        `https://notion-api.splitbee.io/v1/table/${process.env.NEXT_PUBLIC_NOTION_DATABASE_ID}`
    ).then(res => res.data);
    return data;
};

export function editUserScore(userScore: RequestEditUserScore, token: IToken) {
    const authAxios = getAuthAxios(token);
    return authAxios.post(
        `/api/mypage/attendance/`,
        {
            user_id: userScore.user_id,
            truancy: userScore.truancy,
            absence: userScore.absence,
            tardiness: userScore.tardiness,
        }
    );
}