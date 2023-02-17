import { TodayAttendanceData, TodayAttendanceListData } from '@@types/request';
import backupData from './backup/attendance.json';
import backupPostData from './backup/postAttendance.json';
import backupList from './backup/attendanceList.json';
import axios from 'axios';
export function getAttendance() {
  return axios
    .get<TodayAttendanceData>(`https://f36b57ee-3ab4-4f63-8c82-b0d8282695a3.mock.pstmn.io/attendance`)
    .then((res) => res.data)
    .catch((err) => backupData as TodayAttendanceData);
}
export function postAttendance(password: string) {
  return axios
    .post(
      'https://f36b57ee-3ab4-4f63-8c82-b0d8282695a3.mock.pstmn.io/attendance',
      {
        password: password,
      },
      { headers: { 'Content-Type': `application/json` } },
    )
    .catch((err) => {
      return { status: 200, ...backupPostData };
    });
}
export function getAttendanceList() {
  return axios
    .get<TodayAttendanceListData>(`https://f36b57ee-3ab4-4f63-8c82-b0d8282695a3.mock.pstmn.io/attendanceList`)
    .then((res) => res.data)
    .catch((err) => backupList);
}
