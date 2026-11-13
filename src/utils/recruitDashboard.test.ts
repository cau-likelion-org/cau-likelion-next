import { describe, expect, it } from 'vitest';

import { DashboardApplicant, buildRecruitDashboard, countBy, formatRatio } from './recruitDashboard';

const OPTIONS = {
  quotas: { 프론트엔드: 2, 백엔드: 2 },
  applyStartDate: '2027-03-02',
  applyEndDate: '2027-03-04',
  referralOptions: ['인스타그램', '에브리타임', '기타'],
};

const submitted = (overrides: Partial<DashboardApplicant>): DashboardApplicant => ({
  submissionStatus: 'ON_TIME',
  part: '프론트엔드',
  major: '소프트웨어학부',
  grade: '2학년',
  enrollmentStatus: '재학',
  referral: '인스타그램',
  submittedAt: '2027-03-02T21:00:00+09:00',
  ...overrides,
});

const APPLICANTS: DashboardApplicant[] = [
  submitted({ documentResult: 'PASS', interviewResult: 'PASS' }),
  submitted({ part: '백엔드', major: '경영학부', documentResult: 'PASS', submittedAt: '2027-03-04T23:30:00+09:00' }),
  submitted({ submissionStatus: 'LATE', grade: '3학년', referral: '기타', submittedAt: '2027-03-05T00:10:00+09:00' }),
  { submissionStatus: 'IN_PROGRESS' },
  { submissionStatus: 'NOT_SUBMITTED' },
];

describe('buildRecruitDashboard', () => {
  it('본인 확인은 계정을 만든 전원, 지원자는 제출(정상·지각)한 사람만 센다', () => {
    const dashboard = buildRecruitDashboard(APPLICANTS, OPTIONS);

    expect(dashboard.identityCount).toBe(5);
    expect(dashboard.applicantCount).toBe(3);
    expect(dashboard.documentPassCount).toBe(2);
    expect(dashboard.finalPassCount).toBe(1);
  });

  it('경쟁률은 지원자 수 ÷ 전체 모집 정원, 전환율은 본인 확인 ÷ 제출 인원이다', () => {
    const dashboard = buildRecruitDashboard(APPLICANTS, OPTIONS);

    expect(dashboard.competitionRate).toBe(0.75);
    expect(dashboard.conversionRatio).toBeCloseTo(5 / 3);
  });

  it('툴팁용으로 미제출·지각 제출·불합격 인원을 센다', () => {
    const dashboard = buildRecruitDashboard(
      [
        ...APPLICANTS,
        submitted({ documentResult: 'FAIL' }),
        submitted({ documentResult: 'PASS', interviewResult: 'FAIL' }),
      ],
      OPTIONS,
    );

    expect(dashboard.notSubmittedCount).toBe(2);
    expect(dashboard.lateCount).toBe(1);
    expect(dashboard.documentFailCount).toBe(1);
    expect(dashboard.finalFailCount).toBe(1);
  });

  it('모집 정원이나 제출 인원이 없으면 비율을 계산하지 않는다', () => {
    const dashboard = buildRecruitDashboard([{ submissionStatus: 'IN_PROGRESS' }], { ...OPTIONS, quotas: {} });

    expect(dashboard.competitionRate).toBeNull();
    expect(dashboard.conversionRatio).toBeNull();
  });

  it('접수 기간의 날짜마다 한국 시간 기준 당일 제출 수를 센다', () => {
    const dashboard = buildRecruitDashboard(APPLICANTS, OPTIONS);

    expect(dashboard.dailySubmissions).toEqual([
      { label: '2027-03-02', count: 1 },
      { label: '2027-03-03', count: 0 },
      { label: '2027-03-04', count: 1 },
    ]);
  });

  it('지원 경로는 선택지마다 0명이어도 포함해 많은 순으로 정렬한다', () => {
    const dashboard = buildRecruitDashboard(APPLICANTS, OPTIONS);

    expect(dashboard.referrals).toEqual([
      { label: '인스타그램', count: 2 },
      { label: '기타', count: 1 },
      { label: '에브리타임', count: 0 },
    ]);
  });

  it('학과는 전체와 파트별로 많은 순으로 센다', () => {
    const dashboard = buildRecruitDashboard(APPLICANTS, OPTIONS);

    expect(dashboard.majors).toEqual([
      { label: '소프트웨어학부', count: 2 },
      { label: '경영학부', count: 1 },
    ]);
    expect(dashboard.majorsByPart['백엔드']).toEqual([{ label: '경영학부', count: 1 }]);
  });

  it('지난 회차는 서류 접수 마감 시점까지 제출한 지원서만 센다', () => {
    const dashboard = buildRecruitDashboard(APPLICANTS, { ...OPTIONS, cutoffAt: '2027-03-04T23:59:59+09:00' });

    expect(dashboard.applicantCount).toBe(2);
  });
});

describe('countBy', () => {
  it('비어 있는 값은 세지 않는다', () => {
    expect(countBy(['a', undefined, 'a', ''])).toEqual([{ label: 'a', count: 2 }]);
  });
});

describe('formatRatio', () => {
  it('N : 1 형태로 소수점 한 자리까지, 0으로 끝나면 정수로 표시한다', () => {
    expect(formatRatio(1.73)).toBe('1.7 : 1');
    expect(formatRatio(2)).toBe('2 : 1');
    expect(formatRatio(null)).toBe('-');
  });
});
