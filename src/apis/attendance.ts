import { TodayAttendanceData, TodayAttendanceListData } from '@@types/request';
import { IToken } from '@utils/state';
import { getAuthAxios } from './authAxios';
import { toDateString } from '@utils/index';
import { url } from '.';

export function getAttendance(token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios
    .get(`/api/attendance`, {
      params: {
        date: toDateString(),
      },
    })
    .then((res) => {
      return res.data.data as TodayAttendanceData;
    });
}
export function postAttendance(password: string, token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios.post(`/api/attendance`, {
    password: password,
  });
}
export function getAttendanceList(token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios
    .get(`/api/attendance/list`, {
      params: {
        date: toDateString(),
      },
    })
    .then((res) => res.data.data as TodayAttendanceListData);
}
