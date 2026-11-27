import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';

import {
  excludeCommonPart,
  formatDate,
  formatDateTime,
  formatFileSize,
  getPaths,
  getServerMessage,
  invertRecord,
  sortArchivingListDesc,
  toDateString,
  toDateTimeLabel,
  formatInterviewSlots,
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

describe('invertRecord', () => {
  it('키와 값을 뒤바꾼 객체를 만든다', () => {
    expect(invertRecord({ PASS: '합격', FAIL: '불합격' })).toEqual({ 합격: 'PASS', 불합격: 'FAIL' });
  });
});

describe('formatDate', () => {
  it('YYYY-MM-DD를 YYYY/MM/DD로 표시한다', () => {
    expect(formatDate('2026-01-05')).toBe('2026/01/05');
  });

  it('날짜시간 문자열은 날짜 부분만 표시한다', () => {
    expect(formatDate('2026-01-05T09:30:00')).toBe('2026/01/05');
  });
});

describe('formatDateTime', () => {
  it('날짜시간 문자열을 YYYY/MM/DD HH:mm으로 표시한다', () => {
    expect(formatDateTime('2026-01-05T09:30:45')).toBe('2026/01/05 09:30');
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

describe('formatInterviewSlots', () => {
  it('같은 날 이어진 칸은 하나의 구간으로 묶고 날짜순으로 쉼표로 잇는다', () => {
    expect(
      formatInterviewSlots(['2027-03-17T16:00', '2027-03-16T12:00', '2027-03-17T14:00', '2027-03-18T16:00'], 120),
    ).toBe('3/16(화) 12:00-14:00, 3/17(수) 14:00-18:00, 3/18(목) 16:00-18:00');
  });

  it('같은 날이어도 떨어진 칸은 따로 표시한다', () => {
    expect(formatInterviewSlots(['2027-03-16T10:00', '2027-03-16T14:00'], 60)).toBe(
      '3/16(화) 10:00-11:00, 3/16(화) 14:00-15:00',
    );
  });

  it('선택한 칸이 없으면 빈 문자열', () => {
    expect(formatInterviewSlots([], 60)).toBe('');
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
