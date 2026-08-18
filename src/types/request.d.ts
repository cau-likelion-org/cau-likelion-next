export interface IArchivingData {
  id: number;
  title: string;
  thumbnail: string;
  description?: string;
  subtitle?: string;
}
export interface IProjectData extends IArchivingData {
  category: string;
  banner?: string;
  startDate?: string; // 프로젝트 시작일 (목록 정렬 기준)
}

export interface ISessionData extends IArchivingData {
  degree: number;
}

export interface IGalleryData extends IArchivingData {
  date: string;
}

export type ArchivingArrayType<T> = Record<string, T[]>;

export type MemberRole = 'BABY_LION' | 'ADULT_LION' | 'STAFF' | 'PRESIDENT' | 'ADMIN';

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export type GoogleLoginResponse =
  { status: 'LOGIN_SUCCESS'; tokens: TokenResponse } | { status: 'SIGNUP_REQUIRED'; signupToken: string };

export interface JoinRequest {
  signupToken: string;
  name: string;
  generationId: number;
  partId: number;
}

export interface MemberUpdateRequest {
  name: string;
  email: string;
  role: MemberRole;
  partId: number | null;
}

export interface MemberResponse {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
  partId: number | null;
  partName: string | null;
  generationNumber: number | null; // 소속 파트가 없으면 null
}

export interface GenerationPart {
  id: number;
  name: string;
}

export interface Generation {
  id: number;
  number: number;
  year: number;
  status: 'BEFORE_ACTIVITY' | 'IN_ACTIVITY' | 'AFTER_ACTIVITY';
  parts: GenerationPart[];
}

export interface GenerationCreateRequestDto {
  number: number;
  year: number;
  partNames: string[];
}

export interface AllowedUserEmailItem {
  id: number | null; // 기존 항목의 id, 신규 추가된 행이면 null
  name: string;
  email: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
  partId: number;
  partName: string;
  generationNumber: number | null; // 소속 파트가 없으면 null
}

export interface UserAssignment {
  name: string; // 이름
  track: number;
  notSubmitted: number;
  lateSubmitted: number;
}
