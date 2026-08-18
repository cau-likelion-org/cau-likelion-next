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
export interface AssignmentFileInfo {
  fileUrl: string; // 스토리지에 저장된 파일 URL
  originalFilename: string;
}

export interface AssignmentSubmitRequest {
  content?: string; // 제출물 설명 (최대 300자)
  url?: string; // type이 URL일 때 필수
  files?: AssignmentFileInfo[]; // type이 FILE일 때 1개 이상 필수
}

// 과제 첨부파일은 스토리지에 먼저 올리고 그 URL을 제출 요청에 담는다
export async function uploadAssignmentFile(token: IToken, file: File) {
  const authAxios = getAuthAxios(token);
  const formData = new FormData();
  formData.append('file', file);
  const response = await authAxios.post<{ url: string }>('/api/files/ASSIGNMENT', formData);
  return response.data.url;
}

// 아기사자: 과제 제출/수정/재제출
export function submitAssignment(token: IToken, assignmentId: number, payload: AssignmentSubmitRequest) {
  const authAxios = getAuthAxios(token);
  return authAxios.post(`/api/assignments/me/${assignmentId}/submissions`, payload).then((res) => res.data);
}

export interface AssignmentSummary {
  assignmentId: number;
  title: string;
  endDate: string; // 마감 기한 (ISO)
  status: AssignmentDisplayStatus;
  submittedAt: string | null; // 제출 이력이 없으면 null
}

export interface AssignmentSummaryWeekGroup {
  week: number;
  weeklyStatus: AssignmentDisplayStatus; // 주차 종합 상태
  assignments: AssignmentSummary[];
}

// 아기사자: 본인 파트 과제 목록을 주차별로 조회
export function getMyAssignments(token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios.get<AssignmentSummaryWeekGroup[]>('/api/assignments/me').then((res) => res.data);
}

export interface MyAssignmentSubmissionHistory {
  assignmentId: number;
  title: string;
  detail: string;
  endDate: string; // 개별 마감일이 있으면 그 값, 없으면 과제 공통 마감일
  type: AssignmentSubmitType;
  submissions: AssignmentSubmission[]; // 본인 제출 이력 전체 (최신순, 없으면 빈 배열)
}

export interface MyAssignmentHistoryWeekGroup {
  week: number;
  weeklyStatus: AssignmentDisplayStatus; // 주차 종합 상태
  assignments: MyAssignmentSubmissionHistory[];
}

// 아기사자: 주차별 과제 상세 + 본인 제출 이력 조회 (week 미지정 시 전체 주차)
export function getMyAssignmentHistory(token: IToken, week?: number) {
  const authAxios = getAuthAxios(token);
  return authAxios
    .get<MyAssignmentHistoryWeekGroup[]>('/api/assignments/me/submissions/history', {
      params: week != null ? { week } : undefined,
    })
    .then((res) => res.data);
}

export function getStaffAssignments(token: IToken) {
  const authAxios = getAuthAxios(token);
  return authAxios.get<AssignmentWeekGroup[]>('/api/assignments/staff').then((res) => res.data);
}

export function getPresidentAssignments(token: IToken, partId: number) {
  const authAxios = getAuthAxios(token);
  return authAxios
    .get<AssignmentWeekGroup[]>('/api/assignments/president', { params: { partId } })
    .then((res) => res.data);
}

export type AssignmentSubmitType = 'FILE' | 'URL';

const toDeadlineDateTime = (value: string) => (value.length === 10 ? `${value}T23:59:59` : value);

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
  const body: AssignmentCreateRequest = {
    ...payload,
    assignments: payload.assignments.map((item) => ({ ...item, endDate: toDeadlineDateTime(item.endDate) })),
  };
  return authAxios.post('/api/assignments', body).then((res) => res.data);
}

export interface AssignmentDetail {
  id: number;
  partId: number;
  partName: string;
  week: number;
  title: string;
  detail: string;
  endDate: string;
  type: AssignmentSubmitType;
  createdAt: string;
}

// 운영진: 과제 단건 조회 (수정 화면 초기값용 — 목록 API에는 설명/제출형식이 없음)
export function getAssignment(token: IToken, assignmentId: number) {
  const authAxios = getAuthAxios(token);
  return authAxios.get<AssignmentDetail>(`/api/assignments/${assignmentId}`).then((res) => res.data);
}

export interface AssignmentUpdateRequest {
  title: string;
  detail: string;
  endDate: string;
  type: AssignmentSubmitType;
}

// 운영진: 과제 수정 (파트/주차는 변경 불가)
export function updateAssignment(token: IToken, assignmentId: number, payload: AssignmentUpdateRequest) {
  const authAxios = getAuthAxios(token);
  const body: AssignmentUpdateRequest = { ...payload, endDate: toDeadlineDateTime(payload.endDate) };
  return authAxios.put(`/api/assignments/${assignmentId}`, body).then((res) => res.data);
}

// 운영진: 과제 삭제 (제출 이력도 함께 삭제됨)
export function deleteAssignment(token: IToken, assignmentId: number) {
  const authAxios = getAuthAxios(token);
  return authAxios.delete(`/api/assignments/${assignmentId}`).then((res) => res.data);
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
  deadline: string; // 개별 마감일이 있으면 그 값, 없으면 과제 공통 마감일
  displayStatus: AssignmentDisplayStatus; // 최신 제출 기준
  submissions: AssignmentSubmission[]; // 최신순, 재제출 이력 포함 (없으면 빈 배열)
}

export interface AssignmentSubmissionHistory {
  assignmentId: number;
  title: string;
  detail: string;
  endDate: string;
  submissions: AssignmentMemberSubmission[];
}

// 운영진: 특정 과제의 파트원 전체 제출 이력 (재제출 이력 모두 포함)
export function getAssignmentSubmissions(token: IToken, assignmentId: number) {
  const authAxios = getAuthAxios(token);
  return authAxios
    .get<AssignmentSubmissionHistory>(`/api/assignments/${assignmentId}/submissions/staff`)
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

export interface IndividualDeadlinePayload {
  memberIds: number[]; // 선택한 아기사자 전원에게 동일한 마감일 적용
  deadline: string;
}

export interface IndividualDeadline {
  memberId: number;
  memberName: string;
  deadline: string;
}

// 운영진: 개별 마감일 변경
export function updateIndividualDeadlines(token: IToken, assignmentId: number, payload: IndividualDeadlinePayload) {
  const authAxios = getAuthAxios(token);
  const body: IndividualDeadlinePayload = { ...payload, deadline: toDeadlineDateTime(payload.deadline) };
  return authAxios
    .patch<IndividualDeadline[]>(`/api/assignments/${assignmentId}/deadline`, body)
    .then((res) => res.data);
}
