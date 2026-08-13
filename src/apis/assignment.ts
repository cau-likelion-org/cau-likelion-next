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
