import { TodayAttendanceData, TodayAttendanceListData } from '@@types/request';
import { IToken } from '@utils/state';
import { getAuthAxios } from './authAxios';
import { toDateString } from '@utils/index';
import axios from 'axios';
import { url } from '.';

export function getAttendance(token: IToken) {
  const authAxios = getAuthAxios(token);
  const today = new Date();
  return axios
    .get(`${url}/attendance`, {
      params: {
        date: toDateString(today),
      },

      headers: {
        Authorization: `Bearer ${token.access}`
      }

    })
    .then((res) => {
      return res.data.data as TodayAttendanceData;
    });
}
export function postAttendance(password: string, token: IToken) {
  const authAxios = getAuthAxios(token);
  return axios.post(`${url}/attendance`, {
    password: password,
  },
    {
      headers: {
        Authorization: `Bearer ${token.access}`
      }
    });
}
export function getAttendanceList(token: IToken) {
  const authAxios = getAuthAxios(token);
  const today = new Date();
  return axios
    .get(`${url}/attendance/list`, {
      params: {
        date: toDateString(today),
      },
      headers: {
        Authorization: `Bearer ${token.access}`
      }
    })
    .then((res) => res.data.data as TodayAttendanceListData);
}
