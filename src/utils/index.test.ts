import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import {
  canCreateAttendance,
  canDeleteApplication,
  canManageMemberRoles,
  canManageRecruit,
  canManageSitePages,
  excludeCommonPart,
  formatFileSize,
  formatPhoneNumber,
  getPasswordError,
  getPaths,
  getServerMessage,
  isAdminRole,
  isAttendanceTarget,
  isEmailFormatInvalid,
  isFullAdminRole,
  isNameFormatInvalid,
  isPhoneFormatInvalid,
  isUnfilled,
  sortArchivingListDesc,
  toDateString,
  toDateTimeLabel,
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

describe('toDateTimeLabel', () => {
  it('연.월.일(요일) 시:분 형태로 두 자리씩 맞춰 표시한다', () => {
    expect(toDateTimeLabel(new Date('2027-03-08T21:34:00+09:00'))).toBe('2027.03.08(월) 21:34');
    expect(toDateTimeLabel(new Date('2027-01-03T09:05:00+09:00'))).toBe('2027.01.03(일) 09:05');
  });

  it('기기 시간대와 관계없이 한국 시간으로 표시한다', () => {
    expect(toDateTimeLabel(new Date('2027-03-08T12:34:00Z'))).toBe('2027.03.08(월) 21:34');
    expect(toDateTimeLabel(new Date('2027-03-08T16:00:00Z'))).toBe('2027.03.09(화) 01:00');
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

describe('isNameFormatInvalid', () => {
  it('한글·영문 2~20자는 통과시킨다', () => {
    expect(isNameFormatInvalid('홍길동')).toBe(false);
    expect(isNameFormatInvalid('Gil Dong')).toBe(false);
  });

  it('한 글자이거나 숫자·특수문자가 섞이면 잘못된 것으로 본다', () => {
    expect(isNameFormatInvalid('홍')).toBe(true);
    expect(isNameFormatInvalid('홍길동1')).toBe(true);
    expect(isNameFormatInvalid('홍길동!')).toBe(true);
  });

  it('비어 있는 값은 형식 오류로 보지 않는다', () => {
    expect(isNameFormatInvalid('')).toBe(false);
  });
});

describe('formatPhoneNumber', () => {
  it('입력한 자릿수에 맞춰 하이픈을 넣는다', () => {
    expect(formatPhoneNumber('010')).toBe('010');
    expect(formatPhoneNumber('0101234')).toBe('010-1234');
    expect(formatPhoneNumber('01012345678')).toBe('010-1234-5678');
  });

  it('숫자가 아닌 문자는 지우고 11자리까지만 남긴다', () => {
    expect(formatPhoneNumber('010-1234-5678')).toBe('010-1234-5678');
    expect(formatPhoneNumber('010a1234 56789')).toBe('010-1234-5678');
  });
});

describe('isPhoneFormatInvalid', () => {
  it('010-0000-0000 형식만 통과시킨다', () => {
    expect(isPhoneFormatInvalid('010-1234-5678')).toBe(false);
    expect(isPhoneFormatInvalid('010-1234-567')).toBe(true);
    expect(isPhoneFormatInvalid('011-1234-5678')).toBe(true);
  });

  it('비어 있는 값은 형식 오류로 보지 않는다', () => {
    expect(isPhoneFormatInvalid('')).toBe(false);
  });
});

describe('getPasswordError', () => {
  it('8자 이상 영문·숫자·특수문자 조합은 통과시킨다', () => {
    expect(getPasswordError('abcd1234')).toBeUndefined();
    expect(getPasswordError('Abc!@#12')).toBeUndefined();
  });

  it('8자 미만이면 길이 오류를 알려준다', () => {
    expect(getPasswordError('abc123')).toBe('8자 이상 입력해 주세요.');
  });

  it('공백이나 한글이 섞이면 허용 문자 오류를 알려준다', () => {
    expect(getPasswordError('abcd 1234')).toBe('영문 대소문자, 숫자, 특수문자만 사용할 수 있습니다.');
    expect(getPasswordError('비밀번호1234')).toBe('영문 대소문자, 숫자, 특수문자만 사용할 수 있습니다.');
  });

  it('비어 있는 값은 오류로 보지 않는다', () => {
    expect(getPasswordError('')).toBeUndefined();
  });
});

describe('formatFileSize', () => {
  it('1MB 미만은 KB로 반올림해 표시하고 0KB로 내려가지 않는다', () => {
    expect(formatFileSize(500)).toBe('1KB');
    expect(formatFileSize(512 * 1024)).toBe('512KB');
  });

  it('1MB 이상은 MB로 소수점 한 자리까지 표시한다', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1MB');
    expect(formatFileSize(2.34 * 1024 * 1024)).toBe('2.3MB');
    expect(formatFileSize(30 * 1024 * 1024)).toBe('30MB');
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

  it('리크루팅 백오피스는 회장단·관리자만, 지원서 삭제는 관리자만 할 수 있다', () => {
    expect(canManageRecruit('PRESIDENT')).toBe(true);
    expect(canManageRecruit('ADMIN')).toBe(true);
    expect(canManageRecruit('STAFF')).toBe(false);
    expect(canDeleteApplication('ADMIN')).toBe(true);
    expect(canDeleteApplication('PRESIDENT')).toBe(false);
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
