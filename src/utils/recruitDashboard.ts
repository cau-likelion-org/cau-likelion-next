// 리크루팅 대시보드 지표 계산. 지원자 목록에서 바로 계산해, 화면에 들어올 때마다 그 시점 기준으로 다시 집계한다

export interface DashboardApplicant {
  submissionStatus: 'IN_PROGRESS' | 'ON_TIME' | 'LATE' | 'NOT_SUBMITTED';
  part?: string;
  major?: string;
  grade?: string;
  enrollmentStatus?: string;
  referral?: string;
  documentResult?: 'PASS' | 'FAIL' | 'HOLD';
  interviewResult?: 'PASS' | 'FAIL' | 'HOLD';
  submittedAt?: string;
}

export interface DashboardCount {
  label: string;
  count: number;
}

export interface RecruitDashboardOptions {
  // 파트별 모집 정원 (경쟁률 = 지원자 수 ÷ 모집 정원)
  quotas: Record<string, number>;
  applyStartDate: string;
  applyEndDate: string;
  referralOptions: string[];
  // 지난 회차는 서류 접수 마감 시점까지 제출한 지원서만 센다
  cutoffAt?: string;
}

export interface RecruitDashboard {
  identityCount: number;
  applicantCount: number;
  competitionRate: number | null;
  // 본인 확인 인원 ÷ 제출 인원 (N : 1)
  conversionRatio: number | null;
  notSubmittedCount: number;
  lateCount: number;
  documentPassCount: number;
  documentFailCount: number;
  finalPassCount: number;
  finalFailCount: number;
  dailySubmissions: DashboardCount[];
  majors: DashboardCount[];
  majorsByPart: Record<string, DashboardCount[]>;
  grades: DashboardCount[];
  enrollmentStatuses: DashboardCount[];
  referrals: DashboardCount[];
}

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

const toKstDate = (dateTime: string) =>
  new Date(new Date(dateTime).getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);

const getDates = (startDate: string, endDate: string) => {
  const dates: string[] = [];
  for (let time = Date.parse(`${startDate}T00:00Z`); time <= Date.parse(`${endDate}T00:00Z`); time += DAY_MS) {
    dates.push(new Date(time).toISOString().slice(0, 10));
  }
  return dates;
};

// 많은 순, 같으면 먼저 나온 순
export const countBy = (values: (string | undefined)[], labels: string[] = []): DashboardCount[] => {
  const counts = new Map<string, number>(labels.map((label) => [label, 0]));
  values.forEach((value) => value && counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
};

const isSubmitted = (applicant: DashboardApplicant, cutoffAt?: string) =>
  (applicant.submissionStatus === 'ON_TIME' || applicant.submissionStatus === 'LATE') &&
  (!cutoffAt || (!!applicant.submittedAt && Date.parse(applicant.submittedAt) <= Date.parse(cutoffAt)));

export const buildRecruitDashboard = (
  applicants: DashboardApplicant[],
  { quotas, applyStartDate, applyEndDate, referralOptions, cutoffAt }: RecruitDashboardOptions,
): RecruitDashboard => {
  const submitted = applicants.filter((applicant) => isSubmitted(applicant, cutoffAt));
  const quota = Object.values(quotas).reduce((sum, value) => sum + value, 0);
  const submittedByDate = countBy(
    submitted.map((applicant) => applicant.submittedAt && toKstDate(applicant.submittedAt)),
  );
  const parts = Array.from(new Set(submitted.map((applicant) => applicant.part).filter(Boolean))) as string[];

  return {
    identityCount: applicants.length,
    applicantCount: submitted.length,
    competitionRate: quota > 0 ? submitted.length / quota : null,
    conversionRatio: submitted.length > 0 ? applicants.length / submitted.length : null,
    notSubmittedCount: applicants.length - submitted.length,
    lateCount: submitted.filter((applicant) => applicant.submissionStatus === 'LATE').length,
    documentPassCount: submitted.filter((applicant) => applicant.documentResult === 'PASS').length,
    documentFailCount: submitted.filter((applicant) => applicant.documentResult === 'FAIL').length,
    finalPassCount: submitted.filter((applicant) => applicant.interviewResult === 'PASS').length,
    finalFailCount: submitted.filter((applicant) => applicant.interviewResult === 'FAIL').length,
    dailySubmissions: getDates(applyStartDate, applyEndDate).map((date) => ({
      label: date,
      count: submittedByDate.find((item) => item.label === date)?.count ?? 0,
    })),
    majors: countBy(submitted.map((applicant) => applicant.major)),
    majorsByPart: Object.fromEntries(
      parts.map((part) => [
        part,
        countBy(submitted.filter((applicant) => applicant.part === part).map((applicant) => applicant.major)),
      ]),
    ),
    grades: countBy(submitted.map((applicant) => applicant.grade)),
    enrollmentStatuses: countBy(submitted.map((applicant) => applicant.enrollmentStatus)),
    referrals: countBy(
      submitted.map((applicant) => applicant.referral),
      referralOptions,
    ),
  };
};

// 1.7 : 1 형태 (소수점 아래 0은 뺀다)
export const formatRatio = (ratio: number | null) => (ratio === null ? '-' : `${Number(ratio.toFixed(1))} : 1`);
