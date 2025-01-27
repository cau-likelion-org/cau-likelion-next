import { useQueries } from 'react-query';

export type MemberStack = 'pm' | 'frontend' | 'backend' | 'design';
export type MemberStackKor = '기획' | '프론트엔드' | '백엔드' | '디자인';
export type ShareURL = 'github' | 'youtube' | 'web';
export type ArchivingType = 'gallery' | 'session' | 'project';

export interface IShareURL {
  web: string;
  github: string;
  youtube: string;
}

export interface UploadData {
  title: string;
  subtitle: string;
  dev_stack: string;
  tumbnail: File | null;
  version: number;
  team_name: string;
  team_member: {
    pm: string[];
    design: string[];
    frontend: string[];
    backend: string[];
  };
  start_date: string;
  end_date: string;
  description: string;
  link: {
    github: string;
    youtube: string;
    web: string;
  };
  category: string;
  login_email: string;
  images: File[];
}

export interface IArchivingData {
  id: number;
  title: string;
  thumbnail: string;
  description?: string;
  subtitle?: string;
}
export interface IProjectData extends IArchivingData {
  category: string;
  dev_stack: number[];
}

export interface ISessionData extends IArchivingData {
  degree: number;
}

export interface IGalleryData extends IArchivingData {
  date: string;
}

export interface IProjectDetail extends IProjectData {
  subtitle: string;
  team_name: string;
  team_member: Record<MemberStack, string[]>;
  date: string;
  link: IShareURL;
  generation: number;
  image: string[];
}

export interface IGalleryDetail extends IGalleryData {
  description: string;
  image: string[];
}

export type ArchivingArrayType<T> = Record<string, T[]>;

export interface ISessionDetail extends ISessionData {
  presenter: string;
  image: string[];
  track: string;
  topic: string;
  description: string;
  date: string;
  reference?: string;
}

interface ResponseData<T> {
  message: string;
  data: T;
}

export interface TodayAttendanceData {
  name: string;
  track: number;
  attendance_result: 1 | 2;
}
export type TodayAttendanceListData = Record<MemberStack, string[]>;

export interface RequestSignUpForm {
  name: string;
  generation: number;
  track: number;
  is_admin: boolean;
}

export interface LoginResponse {
  is_active: boolean;
  token: {
    access: string;
    refresh: string;
  };
}

export interface UserProfile {
  name: string;
  track: number;
  is_admin: boolean;
  generation: number;
}

export interface UserScore {
  user_id: number;
  name: string;
  track: number;
  absence: number; // 결석
  truancy: number; // 무단결석
  tardiness: number; // 지각
  notSubmitted: number;
  lateSubmitted: number;
  totalScore: number;
}

export interface UserAttendance {
  user_id: number;
  name: string; // 이름
  track: number;
  absence: number; // 결석
  truancy: number; // 무단결석
  tardiness: number; // 지각
}

export interface UserAssignment {
  name: string; // 이름
  track: number;
  notSubmitted: number;
  lateSubmitted: number;
}

export interface TotalScoreParams {
  notSubmitted: number;
  lateSubmitted: number;
  absence: number;
  truancy: number;
  tardiness: number;
}

export interface RequestEditUserScore {
  user_id: number;
  truancy: number;
  tardiness: number;
  absence: number;
}
