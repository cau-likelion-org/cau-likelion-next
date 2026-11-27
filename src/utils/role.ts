import { MemberRole } from '@@types/request';

// 운영진(STAFF) 이상 — 담당 파트에 한정된 관리 권한까지 포함
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

// 리크루팅 백오피스(회차·문항 설정, 지원서 열람·다운로드, 결과 입력·공개)는 회장단·관리자 권한
export const canManageRecruit = (role: MemberRole) => FULL_ADMIN_ROLES.includes(role);

// 지원서 삭제는 관리자 전용 권한
export const canDeleteApplication = (role: MemberRole) => role === 'ADMIN';
