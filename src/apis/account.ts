import { LoginResponse, RequestSignUpForm, UserAttendance, UserProfile } from '@@types/request';
import axios, { AxiosInstance } from 'axios';
import { url } from '.';

export function patchUserProfile(userProfile: UserProfile, accessToken: string) {
  return axios.patch(
    `/user`,
    {
      name: userProfile.name,
      generation: userProfile.generation,
      track: userProfile.track,
      is_admin: userProfile.isAdmin,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}

export const getUserProfile = async (accessToken: string) => {
  // const response = await axios.get<UserProfile>(
  //     `${url}/user`,
  //     {
  //         headers: {
  //             Authorization: `Bearer ${accessToken}`
  //         }
  //     }
  // );
  // return response.data;
  return {
    name: '윤선영',
    generation: 11,
    track: 2,
    isAdmin: true,
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

export function login(code: string | string[]) {
  return axios
    .post<LoginResponse>(`/api/accounts/google/callback/`, {
      code: code,
    })
    .then((res) => {
      return res.data;
    });
}

export function getAcessToken(refresh_code: string) {
  return axios
    .post(`/api/auths/token/refresh/`, {
      refresh: refresh_code,
    })
    .then((res) => {
      console.log(res);
      return res.data;
    });
}
