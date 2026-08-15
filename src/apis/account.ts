import {
  AllowedUserEmailItem,
  Generation,
  GenerationCreateRequestDto,
  GoogleLoginResponse,
  MemberResponse,
  MemberRole,
  MemberUpdateRequest,
  TokenResponse,
  UserProfile,
} from '@@types/request';
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

const DEV_OVERRIDABLE_ROLES: MemberRole[] = ['BABY_LION', 'ADULT_LION', 'STAFF', 'PRESIDENT', 'ADMIN'];

/**
 * 개발 모드 전용 역할 오버라이드.
 * `?role=PRESIDENT`처럼 URL에 붙이면 그 역할로 화면을 볼 수 있다 (예: /mypage?role=STAFF).
 * 서버는 실제 역할로 권한을 판단하므로, 권한이 없는 API는 403이 나고 데이터는 비어 보인다.
 * 쿼리를 바꾼 뒤에는 주소창에서 새로고침해야 반영된다 (react-query 캐시 때문).
 */
const applyDevRoleOverride = (profile: UserProfile): UserProfile => {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') return profile;

  const role = new URLSearchParams(window.location.search).get('role') as MemberRole | null;
  if (!role || !DEV_OVERRIDABLE_ROLES.includes(role) || role === profile.role) return profile;

  console.warn(`[dev] 역할을 ${role}로 덮어씁니다. 서버 권한은 실제 역할(${profile.role}) 기준으로 동작합니다.`);
  return { ...profile, role };
};

export const getUserProfile = async (token: IToken) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get<UserProfile>(`/api/members/me`);
  return applyDevRoleOverride(response.data);
};

export const putUserProfile = async (props: { id: number; form: MemberUpdateRequest; tokenState: IToken }) => {
  const authAxios = getAuthAxios(props.tokenState);
  const response = await authAxios.put<UserProfile>(`/api/members/${props.id}`, props.form);
  return response.data;
};

export const deleteMember = (id: number, token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios.delete(`/api/members/${id}`);
};

export const getGenerations = () => {
  return axios.get<Generation[]>(`${url}/api/generations`).then((res) => res.data);
};

export interface MemberListFilter {
  name?: string;
  generationNumber?: number;
  partId?: number;
  role?: MemberRole;
}

export const getMembers = (filter: MemberListFilter, token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios.get<MemberResponse[]>('/api/members', { params: filter }).then((res) => res.data);
};

export const getAllowedEmails = (generationId: number, token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios
    .get<AllowedUserEmailItem[]>('/api/allowed-emails', { params: { generationId } })
    .then((res) => res.data);
};

export const putAllowedEmails = (generationId: number, items: AllowedUserEmailItem[], token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios.put('/api/allowed-emails', { items }, { params: { generationId } }).then((res) => res.data);
};

export const createGeneration = (form: GenerationCreateRequestDto, token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios.post<Generation>('/api/generations', form).then((res) => res.data);
};

export const setCurrentGeneration = (id: number, token: IToken) => {
  const authAxios = getAuthAxios(token);
  return authAxios.patch<Generation>(`/api/generations/${id}/current`).then((res) => res.data);
};
