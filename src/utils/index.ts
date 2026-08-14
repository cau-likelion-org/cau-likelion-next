import {
  ArchivingArrayType,
  IGalleryData,
  IProjectData,
  ISessionData,
  MemberRole,
  TotalScoreParams,
} from '@@types/request';

export const toDateString = (date?: Date, formatter = '-') => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = ('0' + (1 + date.getMonth())).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return year + formatter + month + formatter + day;
};

export const concatDateString = (startDate: string, endDate: string) => {
  const startDateArray = startDate.split('-');
  const endDateArray = endDate.split('-');
  const newStartDate = startDateArray.join('.');
  const newEndDate = endDateArray.join('.');
  return newStartDate + '~' + newEndDate;
};

export const isUnfilled = (value: string) => value.trim().length === 0;

export const getTotalScore = (target: TotalScoreParams) => {
  let defaultScore = 3;
  const totalScore =
    defaultScore -
    (1 * target.absence +
      0.2 * target.lateSubmitted +
      1 * target.notSubmitted +
      0.5 * target.tardiness +
      1.5 * target.truancy);

  return Number(totalScore.toFixed(1)) > 0 ? Number(totalScore.toFixed(1)) : 0;
};

// 운영진(STAFF) 이상 — 담당 파트에 한정된 관리 권한까지 포함해 "관리자 화면 접근 가능 여부" 판단에 사용
const ADMIN_ROLES: MemberRole[] = ['STAFF', 'PRESIDENT', 'ADMIN'];

// 회장(PRESIDENT)/중하하 관리자(ADMIN) — 전체 파트·전체 회원 데이터에 대한 무제한 권한이 필요한 기능에 사용
const FULL_ADMIN_ROLES: MemberRole[] = ['PRESIDENT', 'ADMIN'];

export const isAdminRole = (role: MemberRole) => ADMIN_ROLES.includes(role);
export const isFullAdminRole = (role: MemberRole) => FULL_ADMIN_ROLES.includes(role);

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

export const getIdFromAsPath = (asPath: string, type: 'project' | 'session' | 'gallery'): string => {
  const regExp = new RegExp(`\/${type}\/(.*)`);
  const match = asPath.match(regExp);
  return match ? match[1] : '';
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
