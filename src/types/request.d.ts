import { useQueries } from 'react-query';

export type MemberStack = 'pm' | 'frontend' | 'backend' | 'design';
export type MemberStackKor = '기획' | '프론트엔드' | '백엔드' | '디자인';
export type ShareURL = 'github' | 'youtube' | 'web';

export interface IShareURL {
  type: ShareURL;
  src: string;
}

interface IProject {
  id: string;
  title: string;
  generation: number;
}

interface IProjectDetail extends IProject {
  dev_stack: number[];
  subtitle: string;
  thumbnail: string;
  team_name: string;
  team_member: Record<MemberStack, string[]>;
  date: string;
  description: string;
  link: IShareURL[];
}

interface ResponseData<T> {
  message: string;
  data: T;
}

export interface AttendanceData {
  name: string;
  track: MemberStackKor;
  isComplete: boolean;
}
export type AttendanceListData = Record<MemberStack, string[]>;
