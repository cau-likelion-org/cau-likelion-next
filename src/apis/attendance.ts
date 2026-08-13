import { TodayAttendanceData, TodayAttendanceListData } from '@@types/request';
import { IToken } from 'src/store/useTokenStore';
import { getAuthAxios } from './authAxios';
import { toDateString } from '@utils/index';
import { url } from '.';

export function getAttendance(token: IToken) {
  const authAxios = getAuthAxios(token);
  const today = new Date();
  return authAxios
    .get(`/api/attendance`, {
      params: {
        date: toDateString(today),
      },
    })
    .then((res) => {
      return res.data.data as TodayAttendanceData;
    });
}
export function postAttendance(password: string, token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios.post(`/api/attendance`, {
    password: password,
  });
}
export function getAttendanceList(token: IToken) {
  const authAxios = getAuthAxios(token);
  const today = new Date();
  return authAxios
    .get(`/api/attendance/list`, {
      params: {
        date: toDateString(today),
      },
    })
    .then((res) => res.data.data as TodayAttendanceListData);
}

export interface WeeklyAttendanceCreatePayload {
  date: string;
  password: string;
  weekNumber: number;
}

export interface WeeklyAttendanceResponse {
  id: number;
  weekNumber: number;
  date: string;
  password: string;
}

// 출석부 생성(회장 전용) — 주차별 출석 비밀번호 생성
export function createWeeklyAttendance(token: IToken, payload: WeeklyAttendanceCreatePayload) {
  const authAxios = getAuthAxios(token);
  return authAxios.post<WeeklyAttendanceResponse>('/api/attendances/password', payload).then((res) => res.data);
}

export type AttendanceStatus = 'BEFORE' | 'PRESENT' | 'LATE' | 'ABSENT' | 'UNAUTHORIZED_ABSENT' | 'EXCUSED';

export interface AttendanceStatusResponse {
  detailAttendanceId: number;
  weeklyAttendanceId: number;
  weekNumber: number;
  date: string;
  status: AttendanceStatus;
  statusDescription: string;
  checkedAt: string | null;
  reason: string | null;
}

export interface MemberAttendanceResponse {
  memberId: number;
  memberName: string;
  generationNumber: number;
  attendances: AttendanceStatusResponse[];
  attendancePenalty: number;
}

// 운영진: 본인 파트 아기사자 출결 조회. 회장/관리자: part로 파트별 필터(미지정 시 전체).
// ⚠️ 백엔드가 아직 part 쿼리 파라미터를 받지 않으면 필터가 적용되지 않을 수 있음(연동 필요).
export function getPartAttendance(token: IToken, part?: string) {
  const authAxios = getAuthAxios(token);
  return authAxios
    .get<MemberAttendanceResponse[]>('/api/attendances/part', { params: part ? { part } : undefined })
    .then((res) => res.data);
}
