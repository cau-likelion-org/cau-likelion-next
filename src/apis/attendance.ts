import { AttendanceData } from '@@types/request';
import axios from 'axios';
export function getAttendance(): Promise<AttendanceData> {
  return new Promise((resolve) => {
    return setTimeout(() => {
      const data: AttendanceData = {
        name: '길동',
        track: '프론트엔드',
        isComplete: false,
      };
      resolve(data);
    }, 1000);
  });
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
