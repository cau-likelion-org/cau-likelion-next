import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Toast from '@common/toast/Toast';
import { NarrowBreak, WIDE_TOAST_WIDTH } from '@common/toast/toastLayout';
import AssignmentCreateForm, { AssignmentDraft } from '@mypage/component/AssignmentCreateForm';
import {
  AssignmentDetail,
  AssignmentWeekGroup,
  createAssignments,
  deleteAssignment,
  getAssignment,
  getPresidentAssignments,
  getStaffAssignments,
  updateAssignment,
} from 'src/apis/assignment';
import useStaffOnly from 'src/hooks/useStaffOnly';
import useTokenStore from 'src/store/useTokenStore';

const AssignmentEditPage = () => {
  const tokenState = useTokenStore((state) => state.token);
  const router = useRouter();
  const queryClient = useQueryClient();

  const week = Number(router.query.week);
  // 회장이 다른 파트를 보고 넘어온 경우 그 파트로 조회 (없으면 본인 파트)
  const partId = router.query.partId ? Number(router.query.partId) : null;

  const { userProfile, isStaff } = useStaffOnly();

  const assignmentsQueryKey = partId != null ? ['presidentAssignments', partId] : ['staffAssignments'];
  const { data: weekGroups } = useQuery<AssignmentWeekGroup[]>({
    queryKey: assignmentsQueryKey,
    queryFn: () => (partId != null ? getPresidentAssignments(tokenState, partId) : getStaffAssignments(tokenState)),
    enabled: isStaff,
  });
  const assignments = weekGroups?.find((group) => group.week === week)?.assignments ?? [];

  // 목록 API에는 설명/제출형식이 없어 주차의 과제를 단건 조회로 함께 불러온다
  const assignmentIds = assignments.map((assignment) => assignment.assignmentId);
  const { data: fetchedDetails } = useQuery<AssignmentDetail[]>({
    queryKey: ['assignmentDetails', assignmentIds],
    queryFn: () => Promise.all(assignmentIds.map((id) => getAssignment(tokenState, id))),
    enabled: assignmentIds.length > 0,
  });

  const details = assignmentIds.length === 0 ? [] : fetchedDetails;

  const [toastMessage, setToastMessage] = useState<React.ReactNode>('');
  const [toastVariant, setToastVariant] = useState<'positive' | 'negative'>('positive');

  const showToast = (variant: 'positive' | 'negative', message: React.ReactNode) => {
    setToastVariant(variant);
    setToastMessage(message);
  };

  const failureText = (action: string) => (
    <>
      {action}에 실패했습니다. <NarrowBreak />
      잠시 후 다시 시도해 주세요.
    </>
  );

  const deleteMutation = useMutation({
    mutationFn: (assignmentId: number) => deleteAssignment(tokenState, assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentsQueryKey });
      showToast('positive', '과제가 삭제되었습니다.');
    },
    onError: () => showToast('negative', failureText('과제 삭제')),
  });

  // 기존 과제는 수정(PUT), 새로 추가한 과제는 생성(POST)
  const saveMutation = useMutation({
    mutationFn: async (drafts: AssignmentDraft[]) => {
      const edited = drafts.filter((draft) => draft.assignmentId != null);
      const added = drafts.filter((draft) => draft.assignmentId == null);

      await Promise.all(
        edited.map((draft) =>
          updateAssignment(tokenState, draft.assignmentId as number, {
            title: draft.title,
            detail: draft.detail,
            endDate: draft.endDate,
            type: draft.type,
          }),
        ),
      );
      if (added.length > 0) {
        await createAssignments(tokenState, {
          week,
          assignments: added.map(({ title, detail, endDate, type }) => ({ title, detail, endDate, type })),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentsQueryKey });
      // 제출 현황 페이지에서 토스트로 안내
      sessionStorage.setItem('assignmentEdited', '1');
      router.push({ pathname: `/mypage/assignment/status/${week}`, query: partId != null ? { partId } : undefined });
    },
    onError: () => showToast('negative', failureText('변경사항 저장')),
  });

  // 운영진이 아니면 훅이 리다이렉트하므로 그동안 아무것도 그리지 않는다.
  // weekGroups는 아직 안 왔을 때만 대기 (주차에 과제가 없어도 폼은 열려야 함)
  if (!userProfile || !isStaff || !weekGroups || !details) return null;

  return (
    <>
      <AssignmentCreateForm
        mode="edit"
        partName={userProfile.partName}
        initialWeek={week}
        initialDrafts={details.map((detail) => ({
          assignmentId: detail.id,
          title: detail.title,
          detail: detail.detail,
          endDate: detail.endDate.slice(0, 10),
          type: detail.type,
        }))}
        submitting={saveMutation.isPending}
        onClose={() =>
          router.push({ pathname: `/mypage/assignment/status/${week}`, query: partId != null ? { partId } : undefined })
        }
        onSubmit={(_week, drafts) => saveMutation.mutate(drafts)}
        onDeleteAssignment={(assignmentId) => deleteMutation.mutate(assignmentId)}
      />
      <ToastWrapper>
        <Toast
          variant={toastVariant}
          width={WIDE_TOAST_WIDTH}
          text={toastMessage}
          show={!!toastMessage}
          onHidden={() => setToastMessage('')}
        />
      </ToastWrapper>
    </>
  );
};

AssignmentEditPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default AssignmentEditPage;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
