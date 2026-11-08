import axios from 'axios';
import { ArchivingArrayType, IGalleryData, IProjectData, ISessionData, MemberRole } from '@@types/request';
import { COMMON_PART_NAME } from '@utils/constant';

// 서버가 내려주는 실패 사유(중복, 형식 오류, 마감 초과 등)를 그대로 보여줄 때 사용
export const getServerMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return undefined;
  const data: unknown = error.response?.data;
  if (typeof data === 'string') return data.trim() || undefined;
  const message = (data as { message?: unknown } | undefined)?.message;
  return typeof message === 'string' && message.trim() ? message : undefined;
};

export const toDateString = (date?: Date, formatter = '-') => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = ('0' + (1 + date.getMonth())).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return year + formatter + month + formatter + day;
};

export const isUnfilled = (value: string) => value.trim().length === 0;

// 한글 등 이메일에 쓰일 수 없는 문자가 섞여 들어가는 것을 막기 위해 허용 문자를 제한한다
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const isEmailFormatInvalid = (email: string) => !isUnfilled(email) && !EMAIL_REGEX.test(email);

const NAME_REGEX = /^[가-힣A-Za-z ]{2,20}$/;
export const isNameFormatInvalid = (name: string) => !isUnfilled(name) && !NAME_REGEX.test(name.trim());

// 숫자만 남겨 010-0000-0000 형태로 하이픈을 채운다
export const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const PHONE_REGEX = /^010-\d{4}-\d{4}$/;
export const isPhoneFormatInvalid = (phone: string) => !isUnfilled(phone) && !PHONE_REGEX.test(phone);

const PASSWORD_MIN_LENGTH = 8;
// 공백을 제외한 영문 대소문자, 숫자, 특수문자(ASCII)만 허용한다
const PASSWORD_CHAR_REGEX = /^[\x21-\x7E]*$/;
export const getPasswordError = (password: string) => {
  if (isUnfilled(password)) return undefined;
  if (!PASSWORD_CHAR_REGEX.test(password)) return '영문 대소문자, 숫자, 특수문자만 사용할 수 있습니다.';
  if (password.length < PASSWORD_MIN_LENGTH) return '8자 이상 입력해 주세요.';
  return undefined;
};

const BYTES_PER_KB = 1024;
const BYTES_PER_MB = 1024 * 1024;
// 1MB 미만은 KB, 이상은 MB로 소수점 한 자리까지 표시한다 (2.0MB → 2MB)
export const formatFileSize = (bytes: number) => {
  if (bytes < BYTES_PER_MB) return `${Math.max(1, Math.round(bytes / BYTES_PER_KB))}KB`;
  return `${Number((bytes / BYTES_PER_MB).toFixed(1))}MB`;
};

// 갤러리 게시물 파트 선택지에만 있는 "공통"은 관리자 화면의 파트 목록·드롭다운에서는 제외한다
export const excludeCommonPart = <T extends { name: string }>(parts: T[]) =>
  parts.filter((part) => part.name !== COMMON_PART_NAME);

// 운영진(STAFF) 이상 — 담당 파트에 한정된 관리 권한까지 포함해 "관리자 화면 접근 가능 여부" 판단에 사용
const ADMIN_ROLES: MemberRole[] = ['STAFF', 'PRESIDENT', 'ADMIN'];

// 회장(PRESIDENT)/중하하 관리자(ADMIN) — 전체 파트·전체 회원 데이터에 대한 무제한 권한이 필요한 기능에 사용
const FULL_ADMIN_ROLES: MemberRole[] = ['PRESIDENT', 'ADMIN'];

export const isAdminRole = (role: MemberRole) => ADMIN_ROLES.includes(role);
export const isFullAdminRole = (role: MemberRole) => FULL_ADMIN_ROLES.includes(role);

// 출석체크는 활동 중인 아기사자만 대상
export const isAttendanceTarget = (role: MemberRole) => role === 'BABY_LION';

// 출석부 생성은 회장 전용 권한
export const canCreateAttendance = (role: MemberRole) => role === 'PRESIDENT';

// 사이드바 '관리자' 메뉴(랜딩·소개 페이지 관리)는 중하하 관리자 전용 — 운영진·회장에게는 보이지 않는다
export const canManageSitePages = (role: MemberRole) => role === 'ADMIN';

// 전체 구성원 권한 설정은 중하하 관리자 전용 권한
export const canManageMemberRoles = (role: MemberRole) => role === 'ADMIN';

export const sortArchivingListDesc = <T extends IGalleryData | IProjectData>(
  data: ArchivingArrayType<T>,
): Array<[string, T[]]> => {
  return Object.entries(data).sort(([a], [b]) => Number(b) - Number(a));
};

interface IPath {
  params: IParams;
}
type IParams = Record<'project_id' | 'session_id' | 'gallery_id', string>;

export function getPaths<T extends IProjectData | IGalleryData | ISessionData>(
  archivingArray: ArchivingArrayType<T>,
  type: 'project' | 'session' | 'gallery',
) {
  const paths = [] as IPath[];

  let key: 'project_id' | 'session_id' | 'gallery_id';
  if (type === 'project') key = 'project_id';
  if (type === 'session') key = 'session_id';
  if (type === 'gallery') key = 'gallery_id';

  Object.values(archivingArray).forEach((archivings) => {
    archivings.forEach((archiving) => {
      const obj = {} as IParams;
      obj[key] = String(archiving.id);
      paths.push({ params: obj });
    });
  });
  return paths;
}
