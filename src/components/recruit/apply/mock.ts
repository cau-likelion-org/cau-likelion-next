// 지원서 작성 API 연동 전까지 사용하는 목업
export type ApplicantStatus = 'NEW' | 'IN_PROGRESS' | 'SUBMITTED';

export interface ApplicantProfile {
  name: string;
  phone: string;
  email: string;
}

export interface ApplicantAccount extends ApplicantProfile {
  password: string;
}

export const VERIFICATION_CODE_LENGTH = 6;
export const VERIFICATION_EXPIRE_SECONDS = 10 * 60;

// 예외 화면 확인용: 아래 이메일로 인증번호를 요청하면 기존 지원 상태로 응답한다
const MOCK_APPLICANT_STATUS: Record<string, ApplicantStatus> = {
  'writing@example.com': 'IN_PROGRESS',
  'submitted@example.com': 'SUBMITTED',
};
// 학번 중복 확인용: 이 학번으로 [다음]을 누르면 이미 지원 내역이 있다고 응답한다
const MOCK_DUPLICATE_STUDENT_ID = '20240000';
const MOCK_VERIFICATION_CODE = '123456';
const MOCK_APPLY_END_AT = '2027-03-09T23:59:59+09:00';

const delay = () => new Promise((resolve) => setTimeout(resolve, 300));

export const requestVerificationCode = async (email: string) => {
  await delay();
  return MOCK_APPLICANT_STATUS[email] ?? 'NEW';
};

export const verifyCode = async (code: string) => {
  await delay();
  return code === MOCK_VERIFICATION_CODE;
};

export const checkStudentIdDuplicate = async (studentId: string) => {
  await delay();
  return studentId === MOCK_DUPLICATE_STUDENT_ID;
};

export class ApplyClosedError extends Error {}

export const createApplicantAccount = async (account: ApplicantAccount) => {
  await delay();
  if (Date.now() > new Date(MOCK_APPLY_END_AT).getTime()) throw new ApplyClosedError();
  return { email: account.email };
};

export const GRADE_OPTIONS = ['1학년', '2학년', '3학년', '4학년', '5학년 이상'];
export const ENROLLMENT_STATUS_OPTIONS = ['재학', '휴학', '졸업 유예'];
export const REFERRAL_OPTIONS = ['멋사 중앙대 홈페이지', '인스타그램', '에브리타임', '지인 추천', '기타'];
export const PART_OPTIONS_MOCK = ['기획·디자인', '프론트엔드', '백엔드'];
export const MIN_INTERVIEW_SLOTS = 1;
