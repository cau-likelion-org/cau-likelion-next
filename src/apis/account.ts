import { LoginResponse, RequestSignUpForm, UserAttendance, UserProfile } from '@@types/request';
import { IToken } from '@utils/state';
import axios, { AxiosInstance } from 'axios';
import { getAuthAxios } from './authAxios';

export const getUserProfile = async (token: IToken) => {
  // const authAxios = getAuthAxios(token);
  // const response = await authAxios.get(`/api/accounts/profile/`);
  // return response.data.data.user as UserProfile;
  return {
    name: '윤선영',
    generation: 11,
    track: 2,
    is_admin: true
  };
};

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
    name: '윤선영',
    absence: 3,
    truancy: 1,
    tardiness: 2,
    notSubmitted: 3,
    lateSubmitted: 1,
    totalScore: 1.5,
  };
};


export function login(code: string | string[], accessToken: string) {
  return axios.post<LoginResponse>(
    `/login`,
    {
      code: code,
      accessToken: accessToken
    }
  ).then((res) => res.data);
}

export function getNewToken(refresh_code: string) {
  return axios
    .post(`/api/auths/token/refresh/`, {
      refresh: refresh_code,
    })
    .then((res) => {
      console.log(res);
      return res.data;
    });
}
