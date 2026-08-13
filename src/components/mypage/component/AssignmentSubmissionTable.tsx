import styled from 'styled-components';

import ContentBadge from '@common/badge/ContentBadge';
import Button from '@common/button/Button';
import SegmentedControl from '@common/segmentedControl/SegmentedControl';
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
        {members.map((member) => {
          const submission = member.latestSubmission;
          const hasSubmission = !!submission;
          const badge = STATUS_BADGE[member.displayStatus];

          return (
            <Row key={member.memberId}>
              <Name>{member.memberName}</Name>
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
                value={submission?.status === 'APPROVED' || submission?.status === 'REJECTED' ? submission.status : ''}
                disabled={!hasSubmission}
                onChange={(value) => {
                  if (!submission) return;
                  if (value === 'APPROVED') onApprove(submission.id);
                  else onReject(submission.id);
                }}
              />

              <Reviewer>{submission?.reviewerName || '-'}</Reviewer>
              <StatusCell>
                <ContentBadge text={badge.label} color={badge.color} variant="solid" size="medium" />
              </StatusCell>
            </Row>
          );
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

const Row = styled.div`
  display: grid;
  grid-template-columns: ${GRID};
  gap: 30px;
  align-items: center;
  width: 100%;

  /* Figma: 행(40px) 아래 22px → 구분선 → 22px → 다음 행 */
  & + & {
    margin-top: 22px;
  }

  &:not(:last-child) {
    padding-bottom: 22px;
    border-bottom: 1px solid ${Line.normal};
  }
`;

const Name = styled.span`
  color: ${Black.b900};
  ${typographyCss(Typography.title3.bold)}
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
