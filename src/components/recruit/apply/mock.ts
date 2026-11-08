// 지원서 작성 API 연동 전까지 사용하는 목업
export type ApplicantStatus = 'NEW' | 'IN_PROGRESS' | 'SUBMITTED';

export interface ApplicantAccount {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export const VERIFICATION_CODE_LENGTH = 6;
export const VERIFICATION_EXPIRE_SECONDS = 10 * 60;

// 예외 화면 확인용: 아래 이메일로 인증번호를 요청하면 기존 지원 상태로 응답한다
const MOCK_APPLICANT_STATUS: Record<string, ApplicantStatus> = {
  'writing@example.com': 'IN_PROGRESS',
  'submitted@example.com': 'SUBMITTED',
};
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

export class ApplyClosedError extends Error {}

export const createApplicantAccount = async (account: ApplicantAccount) => {
  await delay();
  if (Date.now() > new Date(MOCK_APPLY_END_AT).getTime()) throw new ApplyClosedError();
  return { email: account.email };
};
