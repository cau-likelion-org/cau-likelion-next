import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import {
  canCreateAttendance,
  canManageMemberRoles,
  canManageSitePages,
  excludeCommonPart,
  getPaths,
  getServerMessage,
  isAdminRole,
  isAttendanceTarget,
  isEmailFormatInvalid,
  isFullAdminRole,
  isUnfilled,
  sortArchivingListDesc,
  toDateString,
} from './index';

const axiosErrorWith = (data: unknown) =>
  new AxiosError('요청 실패', undefined, undefined, undefined, {
    data,
    status: 400,
    statusText: 'Bad Request',
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe('getServerMessage', () => {
  it('응답 본문이 문자열이면 앞뒤 공백을 제거해 돌려준다', () => {
    expect(getServerMessage(axiosErrorWith('  이미 제출했습니다  '))).toBe('이미 제출했습니다');
  });

  it('응답 본문의 message 필드를 돌려준다', () => {
    expect(getServerMessage(axiosErrorWith({ message: '마감이 지났습니다' }))).toBe('마감이 지났습니다');
  });

  it('보여줄 메시지가 없으면 undefined를 돌려준다', () => {
    expect(getServerMessage(axiosErrorWith(''))).toBeUndefined();
    expect(getServerMessage(axiosErrorWith({ message: '   ' }))).toBeUndefined();
    expect(getServerMessage(axiosErrorWith({ message: 123 }))).toBeUndefined();
    expect(getServerMessage(axiosErrorWith(undefined))).toBeUndefined();
  });

  it('axios 에러가 아니면 undefined를 돌려준다', () => {
    expect(getServerMessage(new Error('네트워크 오류'))).toBeUndefined();
  });
});

describe('toDateString', () => {
  it('월과 일을 두 자리로 맞춘다', () => {
    expect(toDateString(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('구분자를 바꿀 수 있다', () => {
    expect(toDateString(new Date(2026, 10, 23), '/')).toBe('2026/11/23');
  });

  it('날짜가 없으면 빈 문자열을 돌려준다', () => {
    expect(toDateString()).toBe('');
  });
});

describe('isUnfilled', () => {
  it('공백만 있으면 비어 있다고 본다', () => {
    expect(isUnfilled('')).toBe(true);
    expect(isUnfilled('  \n')).toBe(true);
    expect(isUnfilled(' a ')).toBe(false);
  });
});

describe('isEmailFormatInvalid', () => {
  it('올바른 이메일은 통과시킨다', () => {
    expect(isEmailFormatInvalid('puang@likelion.org')).toBe(false);
  });

  it('한글이 섞이거나 형식이 틀리면 잘못된 것으로 본다', () => {
    expect(isEmailFormatInvalid('푸앙@likelion.org')).toBe(true);
    expect(isEmailFormatInvalid('puang@likelion')).toBe(true);
    expect(isEmailFormatInvalid('puang.likelion.org')).toBe(true);
  });

  it('비어 있는 값은 형식 오류로 보지 않는다', () => {
    expect(isEmailFormatInvalid('')).toBe(false);
    expect(isEmailFormatInvalid('   ')).toBe(false);
  });
});

describe('excludeCommonPart', () => {
  it('"공통" 파트만 제외한다', () => {
    const parts = [{ name: '기획' }, { name: '공통' }, { name: '프론트엔드' }];
    expect(excludeCommonPart(parts)).toEqual([{ name: '기획' }, { name: '프론트엔드' }]);
  });
});

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
});

describe('sortArchivingListDesc', () => {
  it('기수를 문자열이 아닌 숫자 기준 내림차순으로 정렬한다', () => {
    const sorted = sortArchivingListDesc({ '9': [], '14': [], '10': [] });
    expect(sorted.map(([generation]) => generation)).toEqual(['14', '10', '9']);
  });
});

describe('getPaths', () => {
  it('종류에 맞는 파라미터 이름으로 모든 항목의 경로를 만든다', () => {
    const archiving = { '13': [{ id: 1 }, { id: 2 }], '14': [{ id: 7 }] } as unknown as Parameters<typeof getPaths>[0];

    expect(getPaths(archiving, 'project')).toEqual([
      { params: { project_id: '1' } },
      { params: { project_id: '2' } },
      { params: { project_id: '7' } },
    ]);
    expect(getPaths(archiving, 'gallery')[0]).toEqual({ params: { gallery_id: '1' } });
    expect(getPaths(archiving, 'session')[0]).toEqual({ params: { session_id: '1' } });
  });
});
