import { describe, expect, it } from 'vitest';

import {
  canCreateAttendance,
  canDeleteApplication,
  canManageMemberRoles,
  canManageRecruit,
  canManageSitePages,
  isAdminRole,
  isAttendanceTarget,
  isFullAdminRole,
} from './role';

describe('역할별 권한', () => {
  it('관리자 화면은 운영진 이상만 접근할 수 있다', () => {
    expect(isAdminRole('STAFF')).toBe(true);
    expect(isAdminRole('PRESIDENT')).toBe(true);
    expect(isAdminRole('ADMIN')).toBe(true);
    expect(isAdminRole('BABY_LION')).toBe(false);
    expect(isAdminRole('ADULT_LION')).toBe(false);
  });

  it('전체 권한은 회장과 관리자만 가진다', () => {
    expect(isFullAdminRole('PRESIDENT')).toBe(true);
    expect(isFullAdminRole('ADMIN')).toBe(true);
    expect(isFullAdminRole('STAFF')).toBe(false);
  });

  it('출석체크 대상은 아기사자뿐이다', () => {
    expect(isAttendanceTarget('BABY_LION')).toBe(true);
    expect(isAttendanceTarget('STAFF')).toBe(false);
  });

  it('출석부 생성은 회장만 할 수 있다', () => {
    expect(canCreateAttendance('PRESIDENT')).toBe(true);
    expect(canCreateAttendance('ADMIN')).toBe(false);
  });

  it('사이트 페이지 관리와 구성원 권한 설정은 관리자만 할 수 있다', () => {
    expect(canManageSitePages('ADMIN')).toBe(true);
    expect(canManageSitePages('PRESIDENT')).toBe(false);
    expect(canManageMemberRoles('ADMIN')).toBe(true);
    expect(canManageMemberRoles('PRESIDENT')).toBe(false);
  });

  it('리크루팅 백오피스는 회장단·관리자만, 지원서 삭제는 관리자만 할 수 있다', () => {
    expect(canManageRecruit('PRESIDENT')).toBe(true);
    expect(canManageRecruit('ADMIN')).toBe(true);
    expect(canManageRecruit('STAFF')).toBe(false);
    expect(canDeleteApplication('ADMIN')).toBe(true);
    expect(canDeleteApplication('PRESIDENT')).toBe(false);
  });
});
