import { IToken } from 'src/store/useTokenStore';
import { getAuthAxios } from './authAxios';

export interface AssignmentStaffSummary {
  assignmentId: number;
  title: string;
  endDate: string; // 마감 기한 (ISO)
  beforeSubmissionCount: number; // 제출 전 (마감 전, 미제출)
  missedCount: number; // 미제출 (마감+유예 경과)
  pendingReviewCount: number; // 승인 대기
  lateSubmittedCount: number; // 지각 제출 (승인 완료)
  approvedCount: number; // 승인 완료 (정시 제출)
}

export interface AssignmentWeekGroup {
  week: number;
  assignments: AssignmentStaffSummary[];
}

// 운영진: 본인 파트에 생성한 과제 목록을 주차별로 조회
export function getStaffAssignments(token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios.get<AssignmentWeekGroup[]>('/api/assignments/staff').then((res) => res.data);
}

// 회장/관리자: partId로 지정한 파트의 과제 목록을 주차별로 조회 (전체 파트 조회 가능)
export function getPresidentAssignments(token: IToken, partId: number) {
  const authAxios = getAuthAxios(token);
  return authAxios
    .get<AssignmentWeekGroup[]>('/api/assignments/president', { params: { partId } })
    .then((res) => res.data);
}

export type AssignmentSubmitType = 'FILE' | 'URL';

export interface AssignmentCreateItem {
  title: string;
  detail: string;
  endDate: string;
  type: AssignmentSubmitType;
}

export interface AssignmentCreateRequest {
  week: number;
  assignments: AssignmentCreateItem[];
}

// 운영진: 본인 파트에 과제 생성 + 파트는 토큰의 소속 파트로 자동 지정
export function createAssignments(token: IToken, payload: AssignmentCreateRequest) {
  const authAxios = getAuthAxios(token);
  return authAxios.post('/api/assignments', payload).then((res) => res.data);
}

// 제출/화면 표시 상태
export type SubmissionStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AssignmentDisplayStatus =
  'BEFORE_SUBMISSION' | 'MISSED' | 'PENDING_REVIEW' | 'LATE_SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface AssignmentFile {
  id: number;
  fileUrl: string;
  originalFilename: string;
}

export interface AssignmentSubmission {
  id: number; // 제출 ID (submitId)
  assignmentId: number;
  content: string;
  url: string;
  files: AssignmentFile[];
  status: SubmissionStatus;
  submittedAt: string;
  displayStatus: AssignmentDisplayStatus;
  reviewerName: string | null;
  approvalDate: string | null;
  rejectionReason: string | null;
}

export interface AssignmentMemberSubmission {
  memberId: number;
  memberName: string;
  displayStatus: AssignmentDisplayStatus;
  latestSubmission: AssignmentSubmission | null;
}

// 운영진: 특정 과제의 파트원 전체 제출 현황
export function getAssignmentSubmissions(token: IToken, assignmentId: number) {
  const authAxios = getAuthAxios(token);
  return authAxios
    .get<AssignmentMemberSubmission[]>(`/api/assignments/${assignmentId}/submissions/staff`)
    .then((res) => res.data);
}

export interface SubmissionEvaluatePayload {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string; // REJECTED일 때 필수
}

// 운영진: 제출 승인/반려 평가
export function evaluateSubmission(
  token: IToken,
  assignmentId: number,
  submitId: number,
  payload: SubmissionEvaluatePayload,
) {
  const authAxios = getAuthAxios(token);
  return authAxios
    .patch<AssignmentSubmission>(`/api/assignments/${assignmentId}/submissions/staff/${submitId}`, payload)
    .then((res) => res.data);
}
