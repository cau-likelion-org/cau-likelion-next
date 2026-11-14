// 지원서 관리 API 연동 전까지 사용하는 목업
import {
  ENROLLMENT_STATUS_OPTIONS,
  GRADE_OPTIONS,
  PART_OPTIONS_MOCK,
  PART_QUESTIONS_MOCK,
  REFERRAL_OPTIONS,
} from '@recruit/apply/mock';

import { RecruitQuestion } from './mock';

export type SubmissionStatus = 'IN_PROGRESS' | 'ON_TIME' | 'LATE' | 'NOT_SUBMITTED';
export type ScreeningResult = 'PASS' | 'FAIL' | 'HOLD';

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  IN_PROGRESS: '작성 중',
  ON_TIME: '정상 제출',
  LATE: '지각 제출',
  NOT_SUBMITTED: '미제출',
};

export const SCREENING_RESULT_LABEL: Record<ScreeningResult, string> = {
  PASS: '합격',
  FAIL: '불합격',
  HOLD: '보류',
};

export interface ApplicantFile {
  name: string;
  size: number;
  url: string;
}

export interface ApplicantAnswer {
  questionId: string;
  text?: string;
  file?: ApplicantFile;
  choiceIds?: string[];
}

export interface ApplicantSummary {
  id: number;
  name: string;
  phone: string;
  email: string;
  // 0단계(본인 확인)만 마친 지원자는 아래 정보가 없다
  studentId?: string;
  major?: string;
  part?: string;
  submissionStatus: SubmissionStatus;
  documentResult?: ScreeningResult;
  interviewResult?: ScreeningResult;
  submittedAt?: string;
}

export interface ApplicantDetail extends ApplicantSummary {
  grade?: string;
  semester?: string;
  enrollmentStatus?: string;
  referral?: string;
  interviewSlots: string[];
  portalCapture?: ApplicantFile;
  answers: ApplicantAnswer[];
}

const CHOICE_QUESTION: RecruitQuestion = {
  id: 'q5',
  type: 'MULTIPLE_CHOICE',
  isRequired: false,
  title: '객관식 문항',
  description: '',
  maxLength: '',
  choices: [1, 2, 3, 4, 5].map((index) => ({ id: `c${index}`, text: `선택지 문항 ${index}` })),
};

// 파트마다 2단계 문항이 다르다고 가정하고, 목업에서는 같은 문항 구성을 파트별로 쓴다
export const SECOND_STEP_QUESTIONS_BY_PART: Record<string, RecruitQuestion[]> = Object.fromEntries(
  PART_OPTIONS_MOCK.map((part) => [part, [...PART_QUESTIONS_MOCK, CHOICE_QUESTION]]),
);

export const APPLICANT_GENERATIONS = [14, 13];

const MOTIVATION =
  '아이디어를 실제 서비스로 구현하는 과정에서 디자인의 역할을 더 깊이 경험하고 싶어 중앙대학교 멋쟁이사자처럼에 지원했습니다. 기획자와 개발자와 함께 하나의 서비스를 완성하는 경험을 통해 문제를 정의하고 해결하는 시야를 넓히고 싶습니다.';
const COLLABORATION =
  'UX/UI 프로젝트와 인턴 경험을 통해 기획자, 개발자, 마케터 등 다양한 직무의 사람들과 협업해왔습니다. 의견이 다를 때는 사용자 관점의 근거를 먼저 정리하고, 결정된 내용은 문서로 남겨 모두가 같은 기준으로 일할 수 있도록 했습니다.';

// public에 목업 파일을 둘 수 없어 다운로드 확인용으로 빈 PDF를 data URL로 둔다
const MOCK_PDF_URL =
  'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iaiA8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4gZW5kb2JqCjIgMCBvYmogPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4gZW5kb2JqCjMgMCBvYmogPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCAyMDAgMTAwXSA+PiBlbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAp0cmFpbGVyIDw8IC9TaXplIDQgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjE4NgolJUVPRgo=';

const NAMES = ['홍길동', '김멋사', '이사자', '박중앙', '최디자', '정프론', '강백엔', '조기획', '윤개발', '장협업'];
const MAJORS = ['소프트웨어학부', '경영학부', '디자인학부', '전자전기공학부'];
const STATUSES: SubmissionStatus[] = ['ON_TIME', 'LATE', 'ON_TIME', 'ON_TIME', 'IN_PROGRESS', 'NOT_SUBMITTED'];
// 대시보드 분포 확인용으로 값이 고르지 않게 섞는다
const SUBMIT_DAYS = [2, 3, 3, 5, 6, 6, 6, 7, 8, 8, 9, 9, 9, 4, 9, 7, 8];
const MAJOR_ORDER = [0, 0, 1, 0, 2, 1, 3, 0, 1, 2];
const GRADE_ORDER = [2, 1, 2, 3, 0, 2, 1, 2, 3];
const ENROLLMENT_ORDER = [0, 0, 0, 0, 1, 1, 2];
const REFERRAL_ORDER = [1, 1, 0, 1, 2, 0, 1, 3, 4, 0, 1];
const DOCUMENT_RESULTS: (ScreeningResult | undefined)[] = ['PASS', 'PASS', 'HOLD', 'FAIL', undefined];

const createApplicant = (index: number): ApplicantDetail => {
  const submissionStatus = STATUSES[index % STATUSES.length];
  const base = {
    id: index + 1,
    name: NAMES[index % NAMES.length],
    phone: `010-1234-${String(5600 + index).padStart(4, '0')}`,
    email: `user${index + 1}@gmail.com`,
    submissionStatus,
    interviewSlots: [],
    answers: [],
  };
  if (submissionStatus === 'IN_PROGRESS' || submissionStatus === 'NOT_SUBMITTED') return base;

  const part = PART_OPTIONS_MOCK[index % PART_OPTIONS_MOCK.length];
  const documentResult = DOCUMENT_RESULTS[index % DOCUMENT_RESULTS.length];
  return {
    ...base,
    studentId: String(20231234 + index),
    major: MAJORS[MAJOR_ORDER[index % MAJOR_ORDER.length]],
    part,
    documentResult,
    interviewResult: documentResult === 'PASS' && index % 3 === 0 ? 'PASS' : undefined,
    submittedAt: `2027-03-0${SUBMIT_DAYS[index % SUBMIT_DAYS.length]}T21:34:00+09:00`,
    grade: GRADE_OPTIONS[GRADE_ORDER[index % GRADE_ORDER.length]],
    semester: '4',
    enrollmentStatus: ENROLLMENT_STATUS_OPTIONS[ENROLLMENT_ORDER[index % ENROLLMENT_ORDER.length]],
    referral: REFERRAL_OPTIONS[REFERRAL_ORDER[index % REFERRAL_ORDER.length]],
    interviewSlots: ['2027-03-16T12:00', '2027-03-17T14:00', '2027-03-17T16:00', '2027-03-18T16:00'],
    portalCapture: { name: 'IMG20260715.jpeg', size: 820_000, url: '/image/og-image.png' },
    answers: [
      { questionId: 'q1', text: MOTIVATION },
      { questionId: 'q2', text: COLLABORATION },
      { questionId: 'q3', text: 'https://example.com' },
      { questionId: 'q4', file: { name: 'portfolio.pdf', size: 12_900_000, url: MOCK_PDF_URL } },
      { questionId: 'q5', choiceIds: ['c2', 'c3'] },
    ],
  };
};

const APPLICANTS_BY_GENERATION: Record<number, ApplicantDetail[]> = {
  14: Array.from({ length: 23 }, (_, index) => createApplicant(index)),
  13: [],
};

const delay = () => new Promise((resolve) => setTimeout(resolve, 300));

export const getApplicants = async (generation: number): Promise<ApplicantDetail[]> => {
  await delay();
  return APPLICANTS_BY_GENERATION[generation] ?? [];
};

export const getApplicant = async (id: number): Promise<ApplicantDetail | undefined> => {
  await delay();
  return Object.values(APPLICANTS_BY_GENERATION)
    .flat()
    .find((applicant) => applicant.id === id);
};

export const updateApplicantContact = async ({
  id,
  ...contact
}: Pick<ApplicantSummary, 'id' | 'name' | 'phone' | 'email'>) => {
  await delay();
  const applicant = Object.values(APPLICANTS_BY_GENERATION)
    .flat()
    .find((item) => item.id === id);
  if (applicant) Object.assign(applicant, contact);
};

export const deleteApplicant = async (id: number) => {
  await delay();
  Object.values(APPLICANTS_BY_GENERATION).forEach((applicants) => {
    const index = applicants.findIndex((applicant) => applicant.id === id);
    if (index >= 0) applicants.splice(index, 1);
  });
};
