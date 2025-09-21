import { LoginResponse, RequestSignUpForm, UserProfile } from '@@types/request';
import { IToken } from '@utils/state';
import axios from 'axios';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export interface IMutationProps {
  form: RequestSignUpForm;
  accessToken: string | null;
  refreshToken: string | null;
}

export const putUserProfile = async (props: IMutationProps) => {
  const authAxios = getAuthAxios({ access: props.accessToken, refresh: props.refreshToken });
  const response = await authAxios.put(`/api/profile`, {
    name: props.form.name,
    generation: props.form.generation,
    track: props.form.track,
    is_admin: props.form.is_admin,
  });
  return response.data;
};

export function login(code: string | string[]) {
  return axios
    .post<LoginResponse>(`${url}/api/google/callback`, {
      code: code,
    })
    .then((res) => {
      return res.data;
    });
}

export function getNewToken(refresh_code: string | null) {
  return axios
    .post(`${url}/api/token`, {
      refresh: refresh_code,
    })
    .then((res) => {
      return res.data;
    });
}
