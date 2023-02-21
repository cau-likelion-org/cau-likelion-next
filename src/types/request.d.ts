import { useQueries } from 'react-query';

export type MemberStack = 'pm' | 'frontend' | 'backend' | 'design';
export type MemberStackKor = '기획' | '프론트엔드' | '백엔드' | '디자인';
export type ShareURL = 'github' | 'youtube' | 'web';
export type ArchivingType = 'gallery' | 'session' | 'project';

export interface IShareURL {
  type: ShareURL;
  src: string;
}

export interface IArchivingData {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  dev_stack?: number[];
  description?: string;
}

export interface IProjectDetail extends IArchivingData {
  subtitle: string;
  team_name: string;
  team_member: Record<MemberStack, string[]>;
  date: string;
  link: IShareURL[];
  generation: number;
  thumbnail: string[];
}

export interface IGalleryDetail extends IArchivingData {
  description: string;
  thumbnail: string[];
}

export type ArchivingArrayType = Record<string, IArchivingData[]>;

export interface ISessionDetail extends IArchivingData {
  session: number,
  presenter: string,
  thumbnail: string[],
  track: string,
  topic: string,
  description: string,
  date: "2022.12.30",
  reference?: string[],
}

export type ProjectsArrayType = Record<string, IArchivingData[]>;

export type SessionsArrayType = Record<string, ISessionData[]>;

interface ResponseData<T> {
  message: string;
  data: T;
};

export interface TodayAttendanceData {
  name: string;
  track: MemberStackKor;
  isComplete: boolean;
}
export type TodayAttendanceListData = Record<MemberStack, string[]>;

export interface RequestSignUpForm {
  accessToken: string | string[];
  name: string;
  generation: number;
  track: number;
  isAdmin: boolean;
}

export interface LoginResponse {
  is_active: boolean;
  accessToken: string;
}

export interface UserProfile {
  name: string;
  track: number;
  isAdmin: boolean;
  generation: number;
}

export interface UserAttendance {
  name: string; // 이름
  absence: number;  // 결석
  truancy: number; // 무단결석
  tardiness: number; // 지각
  notSubmitted: number; // 과제 미제출
  lateSubmitted: number; // 과제 지각 제출
  totalScore: number; // 총점수
}
export interface AttendanceData {
  name: string;
  track: MemberStackKor;
  isComplete: boolean;
}
export type AttendanceListData = Record<MemberStack, string[]>;

export interface RequestSignUpForm {
  accessToken: string | string[];
  name: string;
  generation: number;
  track: number;
  isAdmin: boolean;
}
