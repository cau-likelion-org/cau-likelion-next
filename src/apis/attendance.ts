import { TodayAttendanceData, TodayAttendanceListData, UserAttendance } from '@@types/request';
import backupData from './backup/attendance.json';
import backupPostData from './backup/postAttendance.json';
import backupList from './backup/attendanceList.json';
import axios from 'axios';
import { url } from '.';
import { IToken } from '@utils/state';
import { getAuthAxios } from './authAxios';

export function getAttendance(token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios
    .get<TodayAttendanceData>(`api/attendance`)
    .then((res) => res.data)
    .catch((err) => backupData as TodayAttendanceData);
}
export function postAttendance(password: string, token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios
    .post(
      'api/attendance',
      {
        password: password,
      },
    );
}
export function getAttendanceList(token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios
    .get<TodayAttendanceListData>(`/api/attendance/list`)
    .then((res) => res.data);
}

