import { TodayAttendanceData, TodayAttendanceListData, UserAttendance } from '@@types/request';
import backupData from './backup/attendance.json';
import backupPostData from './backup/postAttendance.json';
import backupList from './backup/attendanceList.json';
import axios from 'axios';
import { url } from '.';
import { IToken } from '@utils/state';

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

export const getUserAttendance = async (accessToken: IToken) => {
  // const response = await axios.get(
  //   `${url}/attendance`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`
  //     }
  //   }
  // );
  // return response.data as UserAttendance;
  return {
    name: '윤선영',
    track: 2,
    absence: 3,
    truancy: 1,
    tardiness: 2,
  };
};

export const getTotalAttendance = async (accessToken: IToken) => {
  // const response = await axios.get(
  //   `${url}/attendance`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`
  //     }
  //   }
  // );
  // return response.data as UserAttendance[];
  return [{
    name: '윤선영',
    track: 2,
    absence: 3,
    truancy: 1,
    tardiness: 2,
  }, {
    name: '김솔',
    track: 0,
    absence: 3,
    truancy: 1,
    tardiness: 2,
  }];
};

export const getAssignments = () => {
  const data = axios.get(`https://notion-api.splitbee.io/v1/table/${process.env.NEXT_PUBLIC_NOTION_DATABASE_ID}`);
  return data;
};

export function patchUserScore(userScore: UserAttendance, accessToken: IToken) {
  return axios.patch(
    `${url}/attendance`,
    {
      name: userScore.name,
      track: userScore.track,
      truancy: userScore.truancy,
      absence: userScore.absence,
      tardiness: userScore.tardiness,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
}