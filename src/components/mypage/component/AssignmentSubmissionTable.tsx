import styled from 'styled-components';

import ContentBadge from '@common/badge/ContentBadge';
import Button from '@common/button/Button';
import SegmentedControl from '@common/segmentedControl/SegmentedControl';
import Tooltip from '@common/tooltip/Tooltip';
import { AssignmentDisplayStatus, AssignmentMemberSubmission, AssignmentSubmission } from 'src/apis/assignment';
import { Black, Label, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const STATUS_BADGE: Record<AssignmentDisplayStatus, { label: string; color: 'neutral' | 'accent' }> = {
  BEFORE_SUBMISSION: { label: '제출 전', color: 'neutral' },
  MISSED: { label: '미제출', color: 'neutral' },
  PENDING_REVIEW: { label: '승인 대기', color: 'accent' },
  LATE_SUBMITTED: { label: '지각 제출', color: 'neutral' },
  APPROVED: { label: '승인 완료', color: 'neutral' },
  REJECTED: { label: '승인 반려', color: 'neutral' },
};

const formatDateTime = (value: string) => value.replace('T', ' ').slice(0, 16).replace(/-/g, '/');
const formatDate = (value: string) => value.slice(0, 10).replace(/-/g, '/');

const APPROVAL_OPTIONS = [
  { label: '승인', value: 'APPROVED' },
  { label: '반려', value: 'REJECTED' },
];

interface AssignmentSubmissionTableProps {
  members: AssignmentMemberSubmission[];
  onApprove: (submitId: number) => void;
  onReject: (submitId: number) => void;
  onViewSubmission: (submission: AssignmentSubmission) => void;
}

const AssignmentSubmissionTable = ({
  members,
  onApprove,
  onReject,
  onViewSubmission,
}: AssignmentSubmissionTableProps) => {
  return (
    <Wrapper>
      <HeaderRow>
        <HeadCell>아기사자</HeadCell>
        <HeadCell>최종 제출일시</HeadCell>
        <HeadCell>제출물</HeadCell>
        <HeadCell>승인 반려 알림 발송</HeadCell>
        <HeadCell>확인자</HeadCell>
        <HeadCell>상태</HeadCell>
      </HeaderRow>

      <Body>
        {members.map((member, memberIndex) => {
          const badge = STATUS_BADGE[member.displayStatus];
          const isLastMember = memberIndex === members.length - 1;
          // 재제출 이력이 있으면 제출 건마다 한 줄. 제출이 없으면 빈 줄 하나.
          const rows: (AssignmentSubmission | null)[] = member.submissions.length > 0 ? member.submissions : [null];

          return rows.map((submission, rowIndex) => {
            const hasSubmission = !!submission;
            const isFirstRow = rowIndex === 0;
            const isLastRow = rowIndex === rows.length - 1;

            return (
              <Row
                key={submission ? submission.id : `member-${member.memberId}`}
                // 같은 아기사자의 제출 이력끼리는 구분선 없이 묶고, 마지막 그룹 아래에도 선을 두지 않는다
                $divider={isLastRow && !isLastMember}
              >
                {isFirstRow ? (
                  <NameCell>
                    <Name tabIndex={0}>{member.memberName}</Name>
                    <TooltipSlot>
                      <Tooltip position="bottom" align="start" text={`마감일 ㅣ ${formatDate(member.deadline)}`} />
                    </TooltipSlot>
                  </NameCell>
                ) : (
                  <span />
                )}
                <SubmittedAt>{submission ? formatDateTime(submission.submittedAt) : '-'}</SubmittedAt>

                <Button
                  variant="outlined"
                  color="assistive"
                  size="medium"
                  disabled={!hasSubmission}
                  onClick={() => submission && onViewSubmission(submission)}
                >
                  제출물 보기
                </Button>

                <SegmentedControl
                  variant="outlined"
                  size="medium"
                  aria-label="승인 반려"
                  options={APPROVAL_OPTIONS}
                  value={
                    submission?.status === 'APPROVED' || submission?.status === 'REJECTED' ? submission.status : ''
                  }
                  disabled={!hasSubmission}
                  onChange={(value) => {
                    if (!submission) return;
                    if (value === 'APPROVED') onApprove(submission.id);
                    else onReject(submission.id);
                  }}
                />

                <Reviewer>{submission?.reviewerName || '-'}</Reviewer>
                <StatusCell>
                  {/* 상태 뱃지는 최신 제출 기준이라 그룹의 첫 줄에만 표시 */}
                  {isFirstRow && <ContentBadge text={badge.label} color={badge.color} variant="solid" size="medium" />}
                </StatusCell>
              </Row>
            );
          });
        })}
      </Body>
    </Wrapper>
  );
};

export default AssignmentSubmissionTable;

const GRID = '90px 180px 247px 247px 80px 66px';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: ${GRID};
  gap: 30px;
  align-items: center;
  width: 100%;
  padding-bottom: 33px;
`;

const HeadCell = styled.span`
  color: ${Label.assistive};
  ${typographyCss(Typography.body1Reading.regular)}
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div<{ $divider: boolean }>`
  display: grid;
  grid-template-columns: ${GRID};
  gap: 30px;
  align-items: center;
  width: 100%;

  /* Figma: 행(40px) 아래 22px → 구분선 → 22px → 다음 행 */
  & + & {
    margin-top: 22px;
  }

  ${(props) =>
    props.$divider &&
    `
    padding-bottom: 22px;
    border-bottom: 1px solid ${Line.normal};
  `}
`;

const NameCell = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

// 개별 마감일 툴팁: 이름에 hover/focus 했을 때만 노출
const TooltipSlot = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.15s ease;
`;

const Name = styled.span`
  color: ${Black.b900};
  cursor: default;
  ${typographyCss(Typography.title3.bold)}

  &:hover + ${TooltipSlot}, &:focus-visible + ${TooltipSlot} {
    opacity: 1;
    visibility: visible;
  }
`;

const SubmittedAt = styled.span`
  color: ${Black.b900};
  ${typographyCss(Typography.heading2.medium)}
`;

const Reviewer = styled.span`
  color: ${Black.b900};
  ${typographyCss(Typography.heading2.medium)}
`;

const StatusCell = styled.div`
  display: flex;
  justify-content: flex-start;
`;
