import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import Button from '@common/button/Button';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Tab from '@common/tab/Tab';
import Toast from '@common/toast/Toast';
import AssignmentDeadlineModal from '@mypage/component/AssignmentDeadlineModal';
import AssignmentInfoCard from '@mypage/component/AssignmentInfoCard';
import AssignmentRejectModal from '@mypage/component/AssignmentRejectModal';
import AssignmentSubmissionModal from '@mypage/component/AssignmentSubmissionModal';
import AssignmentSubmissionTable from '@mypage/component/AssignmentSubmissionTable';
import {
  AssignmentSubmissionHistory,
  AssignmentSubmission,
  AssignmentWeekGroup,
  IndividualDeadlinePayload,
  SubmissionEvaluatePayload,
  evaluateSubmission,
  getAssignmentSubmissions,
  getPresidentAssignments,
  getStaffAssignments,
  updateIndividualDeadlines,
} from 'src/apis/assignment';
import useStaffOnly from 'src/hooks/useStaffOnly';
import useTokenStore from 'src/store/useTokenStore';
import { IcChevronLeft } from '@assets/svg';
import { Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const MyPageAssignmentDetail = () => {
  const router = useRouter();
  const tokenState = useTokenStore((state) => state.token);
  const queryClient = useQueryClient();

  const week = Number(router.query.week);
  // 회장이 목록에서 다른 파트를 보고 넘어온 경우 그 파트로 조회 (없으면 본인 파트)
  const partId = router.query.partId ? Number(router.query.partId) : null;

  const { isStaff } = useStaffOnly();

  // 해당 주차의 과제 목록 (탭/카드용)
  const { data: staffWeekGroups } = useQuery<AssignmentWeekGroup[]>({
    queryKey: partId != null ? ['presidentAssignments', partId] : ['staffAssignments'],
    queryFn: () => (partId != null ? getPresidentAssignments(tokenState, partId) : getStaffAssignments(tokenState)),
    enabled: isStaff,
  });
  const assignments = staffWeekGroups?.find((group) => group.week === week)?.assignments ?? [];

  const [activeId, setActiveId] = useState<number | null>(null);
  const activeAssignmentId = activeId ?? assignments[0]?.assignmentId ?? null;
  const activeAssignment = assignments.find((assignment) => assignment.assignmentId === activeAssignmentId);

  const { data: submissionHistory } = useQuery<AssignmentSubmissionHistory>({
    queryKey: ['assignmentSubmissions', activeAssignmentId],
    queryFn: () => getAssignmentSubmissions(tokenState, activeAssignmentId as number),
    enabled: isStaff && activeAssignmentId != null,
  });
  const members = submissionHistory?.submissions ?? [];

  const evaluateMutation = useMutation({
    mutationFn: ({ submitId, payload }: { submitId: number; payload: SubmissionEvaluatePayload }) =>
      evaluateSubmission(tokenState, activeAssignmentId as number, submitId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assignmentSubmissions', activeAssignmentId] }),
  });

  const [deadlineOpen, setDeadlineOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 과제 수정 후 넘어오면 토스트 표시
  useEffect(() => {
    if (!sessionStorage.getItem('assignmentEdited')) return;
    sessionStorage.removeItem('assignmentEdited');
    const frame = requestAnimationFrame(() => setToastMessage('변경사항이 저장되었습니다.'));
    return () => cancelAnimationFrame(frame);
  }, []);

  const deadlineMutation = useMutation({
    mutationFn: ({ assignmentId, payload }: { assignmentId: number; payload: IndividualDeadlinePayload }) =>
      updateIndividualDeadlines(tokenState, assignmentId, payload),
    onSuccess: () => {
      setDeadlineOpen(false);
      setToastMessage('개별 마감일이 변경되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['assignmentSubmissions'] });
    },
  });

  const [viewTarget, setViewTarget] = useState<AssignmentSubmission | null>(null);
  const [rejectTarget, setRejectTarget] = useState<number | null>(null);

  const handleApprove = (submitId: number) => evaluateMutation.mutate({ submitId, payload: { status: 'APPROVED' } });
  const confirmReject = (reason: string) => {
    if (rejectTarget == null) return;
    evaluateMutation.mutate(
      { submitId: rejectTarget, payload: { status: 'REJECTED', rejectionReason: reason } },
      // 알림 발송까지 끝난 뒤에만 완료 토스트를 띄운다
      { onSuccess: () => setToastMessage('반려 처리가 완료되었습니다.') },
    );
    setRejectTarget(null);
  };

  const tabs = assignments.map((assignment, index) => ({
    key: String(assignment.assignmentId),
    label: `과제 ${index + 1}`,
  }));

  // 운영진이 아니면 훅이 리다이렉트하므로 그동안 아무것도 그리지 않는다
  if (!isStaff) return null;

  return (
    <Page>
      <TopBar>
        <Button
          variant="outlined"
          color="assistive"
          size="medium"
          leadingIcon={<IcChevronLeft width={18} height={18} />}
          onClick={() => router.push('/mypage/assignment')}
        >
          닫기
        </Button>
        <PageTitle>과제 제출 현황</PageTitle>
      </TopBar>

      <WeekRow>
        <WeekTitle>{week}주차 세션 과제</WeekTitle>
        <Button
          variant="solid"
          color="assistive"
          size="medium"
          onClick={() =>
            router.push({
              pathname: `/mypage/assignment/edit/${week}`,
              query: partId != null ? { partId } : undefined,
            })
          }
        >
          과제 수정
        </Button>
      </WeekRow>

      <TabRow>
        {tabs.length > 0 && (
          <Tab
            items={tabs}
            activeKey={String(activeAssignmentId)}
            onChange={(key) => setActiveId(Number(key))}
            size="large"
          />
        )}
        <Button variant="outlined" color="assistive" size="medium" onClick={() => setDeadlineOpen(true)}>
          개별 마감일 변경
        </Button>
      </TabRow>

      {activeAssignment && (
        <InfoCardSlot>
          {/* 설명은 목록 API에 없어 제출 이력 응답(단건 기준)에서 가져온다 */}
          <AssignmentInfoCard
            title={submissionHistory?.title ?? activeAssignment.title}
            detail={submissionHistory?.detail}
            endDate={submissionHistory?.endDate ?? activeAssignment.endDate}
          />
        </InfoCardSlot>
      )}

      <AssignmentSubmissionTable
        members={members}
        onApprove={handleApprove}
        onReject={setRejectTarget}
        onViewSubmission={setViewTarget}
      />

      {viewTarget && <AssignmentSubmissionModal submission={viewTarget} onClose={() => setViewTarget(null)} />}

      {deadlineOpen && activeAssignmentId != null && (
        <AssignmentDeadlineModal
          assignments={assignments}
          initialAssignmentId={activeAssignmentId}
          members={members}
          submitting={deadlineMutation.isPending}
          onClose={() => setDeadlineOpen(false)}
          onSubmit={(assignmentId, memberIds, deadline) =>
            deadlineMutation.mutate({ assignmentId, payload: { memberIds, deadline } })
          }
        />
      )}

      <ToastWrapper>
        <Toast variant="positive" text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>

      {rejectTarget != null && <AssignmentRejectModal onClose={() => setRejectTarget(null)} onSubmit={confirmReject} />}
    </Page>
  );
};

MyPageAssignmentDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default MyPageAssignmentDetail;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 90px 20px 80px;
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 52px;
`;

const PageTitle = styled.h1`
  margin: 0;
  color: ${Orange.o500};
  ${typographyCss(Typography.display2.bold)}
`;

const WeekRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 42px;
`;

const WeekTitle = styled.p`
  margin: 0;
  color: #121212;
  ${typographyCss(Typography.display3.bold)}
`;

const TabRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  margin-bottom: 42px;
`;

const InfoCardSlot = styled.div`
  width: 100%;
  margin-bottom: 83px;
`;
