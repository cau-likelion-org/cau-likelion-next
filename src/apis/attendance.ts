import { TodayAttendanceData, TodayAttendanceListData } from '@@types/request';
import axios from 'axios';
import { Client } from "@notionhq/client";
import { resolve } from 'path';

const notion = new Client({
  auth: process.env.NEXT_PUBLIC_NOTION_KEY,
});


export function getAttendance() {
  return axios
    .get<TodayAttendanceData>(`https://f36b57ee-3ab4-4f63-8c82-b0d8282695a3.mock.pstmn.io/attendance`)
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
    .get<TodayAttendanceListData>(`https://f36b57ee-3ab4-4f63-8c82-b0d8282695a3.mock.pstmn.io/attendanceList`)
    .then((res) => res.data);
}

export const getUserAttendance = async (username: string) => {
  // const response = await axios.get<UserAttendance>(
  //     `${url}/attendance`,
  //     {
  //         params: {
  //             name: username
  //         }
  //     }
  // );
  // return response.data;
  return {
    name: '홍길동',
    absence: 3,
    truancy: 1,
    tardiness: 2,
  };
};


export const getAssignments = () => {
  const NOTION_PAGE_ID = 'd1e1aae2439b44f197bac20d6bec6ca1';
  const data = axios.get(`https://notion-api.splitbee.io/v1/table/${NOTION_PAGE_ID}`);
  return data;
};

