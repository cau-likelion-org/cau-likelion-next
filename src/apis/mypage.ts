import { UserAttendance } from '@@types/request';
import { IToken } from 'src/store/useTokenStore';
import axios from 'axios';
import { getAuthAxios } from './authAxios';
import { ResponseData } from '@@types/request';

export interface MemberScore {
  memberId: number;
  name: string;
  generationNumber: number;
  partName: string;
  lateCount: number; // 지각
  absentCount: number; // 결석
  unauthorizedAbsentCount: number; // 무단결석
  lateSubmitCount: number; // 과제 지각제출
  missedCount: number; // 과제 미제출
  total: number; // 3점 만점 총점
}

// 아기사자 상벌점 목록 — 운영진은 본인 파트만, 회장/관리자는 전체 (범위는 서버가 역할로 판단)
export const getMemberScores = async (token: IToken) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get<MemberScore[]>('/api/mypage/scores');
  return response.data;
};

export const getUserAttendance = async (token: IToken) => {
  const authAxios = getAuthAxios(token);
  const data = await authAxios.get<ResponseData<UserAttendance>>(`/api/mypage/attendance`).then((res) => res.data.data);
  return data;
};

export const getAssignments = () => {
  return axios.get('/api/notion/assignments').then((res) => res.data);
};
