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

export const getUserProfile = async (token: IToken) => {
  const authAxios = getAuthAxios(token);
  const response = await axios.get(`${url}/profile`, {
    headers: {
      Authorization: `Bearer ${token.access}`
    }
  });
  return response.data.data.user as UserProfile;
};

export const putUserProfile = async (props: IMutationProps) => {
  const axiosInstance = getAuthAxios({ access: props.accessToken, refresh: props.refreshToken });
  const response = await axios.put(`${url}/profile`, {
    name: props.form.name,
    generation: props.form.generation,
    track: props.form.track,
    is_admin: props.form.is_admin,
  },
    {
      headers: {
        Authorization: `Bearer ${props.accessToken}`
      }
    }
  );
  return response.data;
};

export function login(code: string | string[]) {
  return axios
    .post<LoginResponse>(`${url}/google/callback`, {
      code: code,
    })
    .then((res) => {
      return res.data;
    });
}

export function getNewToken(refresh_code: string | null) {
  return axios
    .post(`${url}/token`, {
      refresh: refresh_code,
    })
    .then((res) => {
      return res.data;
    });
}
