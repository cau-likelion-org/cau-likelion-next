import { LoginResponse, RequestSignUpForm } from '@@types/request';
import { IToken } from '@utils/state';
import axios from 'axios';
import { getAuthAxios } from './authAxios';

export interface IMutationProps {
  form: RequestSignUpForm;
  accessToken: string;
  refreshToken: string;
}


export const getUserProfile = async (token: IToken) => {
  // const authAxios = getAuthAxios(token);
  // const response = await authAxios.get(`/api/profile/`);
  // return response.data.data.user as UserProfile;
  return {
    name: '윤선영',
    generation: 11,
    track: 2,
    is_admin: false
  };
};

export const putUserProfile = async (props: IMutationProps) => {
  const axiosInstance = getAuthAxios({ access: props.accessToken, refresh: props.refreshToken });
  const response = await axiosInstance.put(`/api/mypage/profile`, {
    name: props.form.name,
    generation: props.form.generation,
    track: props.form.track,
    is_admin: props.form.is_admin,
  });
  return response.data;
};

export function login(code: string | string[]) {
  return axios
    .post<LoginResponse>(`/api/google/callback/`, {
      code: code,
    })
    .then((res) => {
      return res.data;
    });
}


export function getNewToken(refresh_code: string) {
  return axios
    .post(`/api/token/`, {
      refresh: refresh_code,
    })
    .then((res) => {
      console.log(res);
      return res.data;
    });
}
