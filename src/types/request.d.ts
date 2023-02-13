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

interface ResponseData<T> {
  message: string;
  data: T;
};

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
