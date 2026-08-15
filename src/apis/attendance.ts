import { IToken } from 'src/store/useTokenStore';
import { getAuthAxios } from './authAxios';

export function checkAttendance(token: IToken, password: string) {
  const authAxios = getAuthAxios(token);
  return authAxios.post<AttendanceStatusResponse>('/api/attendances/check', { password }).then((res) => res.data);
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
  partName: string;
  attendances: AttendanceStatusResponse[];
  attendancePenalty: number;
}

// 아기사자: 본인 주차별 출결 현황
export function getMyAttendances(token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios.get<AttendanceStatusResponse[]>('/api/attendances/me').then((res) => res.data);
}

// 운영진: 본인 파트 아기사자 출결 현황
export function getPartAttendance(token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios.get<MemberAttendanceResponse[]>('/api/attendances/part').then((res) => res.data);
}

// 회장: 전체 파트 아기사자 출결 현황 (파트 필터는 응답의 partName으로 처리)
export function getAllAttendances(token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios.get<MemberAttendanceResponse[]>('/api/attendances/all').then((res) => res.data);
}

export interface AttendanceStatusUpdate {
  detailAttendanceId: number;
  status: AttendanceStatus;
  reason?: string;
}

export function updateAttendanceBatch(token: IToken, updates: AttendanceStatusUpdate[]) {
  const authAxios = getAuthAxios(token);
  return authAxios.patch<AttendanceStatusResponse[]>('/api/attendances/batch', { updates }).then((res) => res.data);
}
