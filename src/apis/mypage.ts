import { IToken } from 'src/store/useTokenStore';
import { getAuthAxios } from './authAxios';

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

// 아기사자: 본인 상벌점 내역
export const getMyScore = async (token: IToken) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get<MemberScore>('/api/mypage/score');
  return response.data;
};

// 아기사자 상벌점 목록 — 운영진은 본인 파트만, 회장/관리자는 전체 (범위는 서버가 역할로 판단)
export const getMemberScores = async (token: IToken) => {
  const authAxios = getAuthAxios(token);
  const response = await authAxios.get<MemberScore[]>('/api/mypage/scores');
  return response.data;
};
