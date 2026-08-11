import { Generation, GoogleLoginResponse, MemberUpdateRequest, TokenResponse, UserProfile } from '@@types/request';
import { IToken } from 'src/store/useTokenStore';
import axios from 'axios';
import { url } from '.';
import { getAuthAxios } from './authAxios';

export const LOGIN_UNREGISTERED_FLAG_KEY = 'loginUnregistered';

export const googleLogin = (idToken: string) => {
  return axios.post<GoogleLoginResponse>(`${url}/api/auth/google-login`, { idToken }).then((res) => res.data);
};

export const reissueToken = (refreshToken: string) => {
  return axios.post<TokenResponse>(`${url}/api/auth/reissue`, { refreshToken }).then((res) => res.data);
};

export const logout = (refreshToken: string | null) => {
  return axios.post(`${url}/api/auth/logout`, { refreshToken });
};

export const getUserProfile = async (token: IToken) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get<UserProfile>(`/api/members/me`);
  return response.data;
};

export const putUserProfile = async (props: { id: number; form: MemberUpdateRequest; tokenState: IToken }) => {
  const authAxios = getAuthAxios(props.tokenState);
  const response = await authAxios.put<UserProfile>(`/api/members/${props.id}`, props.form);
  return response.data;
};

export const getGenerations = () => {
  return axios.get<Generation[]>(`${url}/api/generations`).then((res) => res.data);
};
