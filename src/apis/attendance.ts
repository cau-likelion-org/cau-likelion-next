import { TodayAttendanceData, TodayAttendanceListData } from '@@types/request';
import { IToken } from '@utils/state';
import { getAuthAxios } from './authAxios';
import { toDateString } from '@utils/index';

export function getAttendance(token: IToken) {
  const authAxios = getAuthAxios(token);
  const today = new Date();
  return authAxios
    .get(`/api/attendance`, {
      params: {
        date: toDateString(today),
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
  const today = new Date();
  return authAxios
    .get(`/api/attendance/list`, {
      params: {
        date: toDateString(today),
      },
    })
    .then((res) => res.data.data as TodayAttendanceListData);
}
