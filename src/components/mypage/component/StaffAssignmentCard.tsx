import { useState } from 'react';
import styled from 'styled-components';

import { AssignmentStaffSummary } from 'src/apis/assignment';
import { IcChevronLeft } from '@assets/svg';
import { Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

interface StaffAssignmentCardProps {
  week: number;
  assignments: AssignmentStaffSummary[];
  onDetail?: () => void;
}

// 마감 기한 → ~YYYY/MM/DD
const formatDeadline = (endDate: string) => {
  const date = new Date(endDate);
  if (Number.isNaN(date.getTime())) return endDate;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `~${y}/${m}/${d}`;
};

// 운영진 과제 목록 카드: 한 주차의 개별 과제별 제출 현황 요약 (Figma 8.4.1)
const StaffAssignmentCard = ({ week, assignments, onDetail }: StaffAssignmentCardProps) => {
  // 마운트 시각 기준으로 마감 경과 여부 판단 (렌더 순수성 유지)
  const [now] = useState(() => Date.now());

  return (
    <Card>
      <CardHeader>
        <WeekTitle>{week}주차 세션 과제</WeekTitle>
        <DetailButton type="button" onClick={onDetail}>
          상세보기
          <ChevronRight>
            <IcChevronLeft width={16} height={16} />
          </ChevronRight>
        </DetailButton>
      </CardHeader>

      <Rows>
        {assignments.map((assignment) => {
          // 마감 전이면 '제출 전', 마감+유예가 지났으면 '미제출'
          const isPastDeadline = new Date(assignment.endDate).getTime() < now;
          const unsubmitted = isPastDeadline
            ? { label: '미제출', count: assignment.missedCount }
            : { label: '제출 전', count: assignment.beforeSubmissionCount };

          return (
            <Row key={assignment.assignmentId}>
              <AssignmentTitle>{assignment.title}</AssignmentTitle>
              <Count $emphasis={assignment.pendingReviewCount > 0 ? 'orange' : 'dark'}>
                승인 대기 {assignment.pendingReviewCount}
              </Count>
              <Count $emphasis="muted">승인 완료 {assignment.approvedCount}</Count>
              <Count $emphasis="muted">지각 제출 {assignment.lateSubmittedCount}</Count>
              <Count $emphasis="muted">
                {unsubmitted.label} {unsubmitted.count}
              </Count>
              <Deadline>{formatDeadline(assignment.endDate)}</Deadline>
            </Row>
          );
        })}
      </Rows>
    </Card>
  );
};

export default StaffAssignmentCard;

const TEXT_DARK = '#121212';
const TEXT_MUTED = '#AAAAAA';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  width: 100%;
  padding: 20px 26px;
  border: 1px solid ${Line.subtle};
  border-radius: 14px;
  background-color: #fcfdfd;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const WeekTitle = styled.p`
  margin: 0;
  color: ${TEXT_DARK};
  ${typographyCss(Typography.heading1.bold)}
`;

const DetailButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 0;
  border: none;
  background: none;
  color: ${Label.strong};
  cursor: pointer;
  ${typographyCss(Typography.body1Normal.bold)}
`;

const ChevronRight = styled.span`
  display: inline-flex;
  transform: rotate(180deg);
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const AssignmentTitle = styled.p`
  flex-shrink: 0;
  width: 220px;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${TEXT_DARK};
  ${typographyCss(Typography.heading2.bold)}
`;

const Count = styled.p<{ $emphasis: 'orange' | 'dark' | 'muted' }>`
  flex-shrink: 0;
  width: 100px;
  margin: 0;
  text-align: center;
  color: ${(props) =>
    props.$emphasis === 'orange' ? Orange.o500 : props.$emphasis === 'dark' ? TEXT_DARK : TEXT_MUTED};
  ${typographyCss(Typography.body1Normal.medium)}
`;

const Deadline = styled.p`
  flex-shrink: 0;
  width: 100px;
  margin: 0;
  text-align: right;
  color: ${Label.alternative};
  ${typographyCss(Typography.body1Reading.regular)}
`;
