import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Toast from '@common/toast/Toast';
import AssignmentCreateForm, { AssignmentDraft } from '@mypage/component/AssignmentCreateForm';
import { getUserProfile } from 'src/apis/account';
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
import useTokenStore from 'src/store/useTokenStore';

const AssignmentEditPage = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();
  const queryClient = useQueryClient();

  const week = Number(router.query.week);
  // 회장이 다른 파트를 보고 넘어온 경우 그 파트로 조회 (없으면 본인 파트)
  const partId = router.query.partId ? Number(router.query.partId) : null;

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  const assignmentsQueryKey = partId != null ? ['presidentAssignments', partId] : ['staffAssignments'];
  const { data: weekGroups } = useQuery<AssignmentWeekGroup[]>({
    queryKey: assignmentsQueryKey,
    queryFn: () => (partId != null ? getPresidentAssignments(tokenState, partId) : getStaffAssignments(tokenState)),
    enabled: !!tokenState.access,
  });
  const assignments = weekGroups?.find((group) => group.week === week)?.assignments ?? [];

  // 목록 API에는 설명/제출형식이 없어 주차의 과제를 단건 조회로 함께 불러온다
  const assignmentIds = assignments.map((assignment) => assignment.assignmentId);
  const { data: fetchedDetails } = useQuery<AssignmentDetail[]>({
    queryKey: ['assignmentDetails', assignmentIds],
    queryFn: () => Promise.all(assignmentIds.map((id) => getAssignment(tokenState, id))),
    enabled: assignmentIds.length > 0,
  });
  // 과제가 없는 주차(또는 마지막 과제를 삭제한 직후)는 조회할 게 없으므로 빈 폼으로 연다
  const details = assignmentIds.length === 0 ? [] : fetchedDetails;

  const [toastMessage, setToastMessage] = useState('');

  const deleteMutation = useMutation({
    mutationFn: (assignmentId: number) => deleteAssignment(tokenState, assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentsQueryKey });
      setToastMessage('과제가 삭제되었습니다.');
    },
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
  });

  // weekGroups가 아직 안 왔을 때만 대기 (주차에 과제가 없어도 폼은 열려야 함)
  if (!userProfile || !weekGroups || !details) return null;

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
        <Toast variant="positive" text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
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
