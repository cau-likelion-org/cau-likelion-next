import { describe, expect, it } from 'vitest';

import { formatDate, formatDateTime, formatInterviewSlots, toDateString, toDateTimeLabel } from './date';

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
