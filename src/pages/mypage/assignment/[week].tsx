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
import AssignmentSubmissionModal from '@mypage/component/AssignmentSubmissionModal';
import AssignmentSubmissionTable from '@mypage/component/AssignmentSubmissionTable';
import {
  AssignmentMemberSubmission,
  AssignmentSubmission,
  AssignmentWeekGroup,
  IndividualDeadlinePayload,
  SubmissionEvaluatePayload,
  evaluateSubmission,
  getAssignmentSubmissions,
  getStaffAssignments,
  updateIndividualDeadlines,
} from 'src/apis/assignment';
import useTokenStore from 'src/store/useTokenStore';
import { IcChevronLeft } from '@assets/svg';
import { BackgroundWhite, Label, Line, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const MyPageAssignmentDetail = () => {
  const router = useRouter();
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const queryClient = useQueryClient();

  const week = Number(router.query.week);

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  // 해당 주차의 과제 목록 (탭/카드용)
  const { data: staffWeekGroups } = useQuery<AssignmentWeekGroup[]>({
    queryKey: ['staffAssignments'],
    queryFn: () => getStaffAssignments(tokenState),
    enabled: !!tokenState.access,
  });
  const assignments = staffWeekGroups?.find((group) => group.week === week)?.assignments ?? [];

  const [activeId, setActiveId] = useState<number | null>(null);
  const activeAssignmentId = activeId ?? assignments[0]?.assignmentId ?? null;
  const activeAssignment = assignments.find((assignment) => assignment.assignmentId === activeAssignmentId);

  const { data: members } = useQuery<AssignmentMemberSubmission[]>({
    queryKey: ['assignmentSubmissions', activeAssignmentId],
    queryFn: () => getAssignmentSubmissions(tokenState, activeAssignmentId as number),
    enabled: activeAssignmentId != null,
  });

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
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (submitId: number) => evaluateMutation.mutate({ submitId, payload: { status: 'APPROVED' } });
  const handleReject = (submitId: number) => {
    setRejectReason('');
    setRejectTarget(submitId);
  };
  const confirmReject = () => {
    if (rejectTarget == null || !rejectReason.trim()) return;
    evaluateMutation.mutate({
      submitId: rejectTarget,
      payload: { status: 'REJECTED', rejectionReason: rejectReason.trim() },
    });
    setRejectTarget(null);
  };

  const tabs = assignments.map((assignment, index) => ({
    key: String(assignment.assignmentId),
    label: `과제 ${index + 1}`,
  }));

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
          onClick={() => router.push(`/mypage/assignment/edit/${week}`)}
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
          <AssignmentInfoCard title={activeAssignment.title} endDate={activeAssignment.endDate} />
        </InfoCardSlot>
      )}

      <AssignmentSubmissionTable
        members={members ?? []}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewSubmission={setViewTarget}
      />

      {viewTarget && <AssignmentSubmissionModal submission={viewTarget} onClose={() => setViewTarget(null)} />}

      {deadlineOpen && activeAssignmentId != null && (
        <AssignmentDeadlineModal
          assignments={assignments}
          initialAssignmentId={activeAssignmentId}
          members={members ?? []}
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

      {rejectTarget != null && (
        <Overlay role="dialog" aria-modal="true">
          <Dimmer onClick={() => setRejectTarget(null)} />
          <Modal>
            <ModalTitle>반려 사유</ModalTitle>
            <ModalDescription>반려 사유를 입력해 주세요.</ModalDescription>
            <ReasonInput
              autoFocus
              value={rejectReason}
              placeholder="텍스트를 입력해 주세요."
              onChange={(event) => setRejectReason(event.target.value)}
            />
            <ModalActions>
              <ModalButton type="button" onClick={() => setRejectTarget(null)}>
                취소
              </ModalButton>
              <ModalButton type="button" $primary disabled={!rejectReason.trim()} onClick={confirmReject}>
                반려
              </ModalButton>
            </ModalActions>
          </Modal>
        </Overlay>
      )}
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

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  z-index: 1000;
`;

const Dimmer = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(23, 23, 25, 0.52);
  opacity: 0.43;
`;

const Modal = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 400px;
  padding: 28px;
  border-radius: 16px;
  background-color: ${BackgroundWhite.primary};
`;

const ModalTitle = styled.p`
  margin: 0;
  color: ${Label.normal};
  ${typographyCss(Typography.heading2.bold)}
`;

const ModalDescription = styled.p`
  margin: 0;
  color: ${Label.alternative};
  ${typographyCss(Typography.body2Normal.regular)}
`;

const ReasonInput = styled.textarea`
  height: 80px;
  padding: 12px;
  border: 1px solid ${Line.normal};
  border-radius: 12px;
  resize: none;
  color: ${Label.normal};
  ${typographyCss(Typography.body1Normal.regular)}

  &::placeholder {
    color: ${Label.assistive};
  }

  &:focus {
    outline: none;
    border-color: ${Label.normal};
  }
`;

const ModalActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
`;

const ModalButton = styled.button<{ $primary?: boolean }>`
  padding: 4px;
  border: none;
  background: none;
  cursor: pointer;
  color: ${(props) => (props.$primary ? Orange.o500 : Label.alternative)};
  ${typographyCss(Typography.body1Normal.bold)}

  &:disabled {
    color: ${Label.assistive};
    cursor: not-allowed;
  }
`;
