import { describe, expect, it } from 'vitest';

import { INTERVIEW_WARNING, fillResultTemplate, getInterviewWarnings, isWithinMonths } from './recruitResult';

const period = {
  startDate: '2027-03-16',
  endDate: '2027-03-18',
  startTime: '10:00',
  endTime: '16:00',
  unitMinutes: 120,
};
const selectedSlots = ['2027-03-16T12:00', '2027-03-17T14:00'];

describe('fillResultTemplate', () => {
  it('변수를 여러 번 써도 모두 실제 값으로 바꾼다', () => {
    expect(
      fillResultTemplate('{이름}님 {면접 일시} {면접 대기 장소} / {이름}', {
        name: '홍길동',
        interviewAt: '2027.03.16(화) 14:00',
        interviewPlace: '310관',
      }),
    ).toBe('홍길동님 2027.03.16(화) 14:00 310관 / 홍길동');
  });

  it('면접 값이 없으면 빈칸으로 바꾼다', () => {
    expect(fillResultTemplate('{이름}: {면접 일시}', { name: '홍길동' })).toBe('홍길동: ');
  });
});

describe('getInterviewWarnings', () => {
  it('지원자가 고른 시간 칸 안이고 기간 안이면 경고가 없다', () => {
    expect(
      getInterviewWarnings({ date: '2027-03-16', time: '13:00', selectedSlots, period, sameTimeCount: 1 }),
    ).toEqual([]);
  });

  it('지원자가 고르지 않은 시간이면 경고한다', () => {
    expect(
      getInterviewWarnings({ date: '2027-03-16', time: '10:00', selectedSlots, period, sameTimeCount: 1 }),
    ).toEqual([INTERVIEW_WARNING.notSelected]);
  });

  it('면접 기간 밖이면 경고한다', () => {
    expect(
      getInterviewWarnings({ date: '2027-03-19', time: '12:00', selectedSlots, period, sameTimeCount: 1 }),
    ).toContain(INTERVIEW_WARNING.outOfPeriod);
  });

  it('같은 일시에 여러 명이 배정되면 인원과 함께 경고한다', () => {
    expect(
      getInterviewWarnings({ date: '2027-03-16', time: '12:00', selectedSlots, period, sameTimeCount: 2 }),
    ).toEqual([INTERVIEW_WARNING.duplicated(2)]);
  });

  it('날짜나 시간이 비어 있으면 검사하지 않는다', () => {
    expect(getInterviewWarnings({ date: '', time: '12:00', selectedSlots, period, sameTimeCount: 3 })).toEqual([]);
  });
});

describe('isWithinMonths', () => {
  it('기준일로부터 개월 수를 넘지 않으면 true', () => {
    expect(isWithinMonths('2027-06-21', '2027-03-21', 3)).toBe(true);
    expect(isWithinMonths('2027-06-22', '2027-03-21', 3)).toBe(false);
  });
});
