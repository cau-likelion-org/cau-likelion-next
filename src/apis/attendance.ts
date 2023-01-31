import { AttendanceData, AttendanceListData } from '@@types/request';
import axios from 'axios';
export function getAttendance() {
  return axios
    .get<AttendanceData>(
      `https://f36b57ee-3ab4-4f63-8c82-b0d8282695a3.mock.pstmn.io/attendance`,
    )
    .then((res) => res.data);
}
export function postAttendance(password: string) {
  return axios.post(
    'https://f36b57ee-3ab4-4f63-8c82-b0d8282695a3.mock.pstmn.io/attendance',
    {
      password: password,
    },
    { headers: { 'Content-Type': `application/json` } },
  );
}
export function getAttendanceList() {
  return axios
    .get<AttendanceListData>(
      `https://f36b57ee-3ab4-4f63-8c82-b0d8282695a3.mock.pstmn.io/attendanceList`,
    )
    .then((res) => res.data);
}
