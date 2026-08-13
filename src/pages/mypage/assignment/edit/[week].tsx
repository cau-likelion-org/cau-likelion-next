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
  AssignmentWeekGroup,
  createAssignments,
  deleteAssignment,
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

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  const { data: weekGroups } = useQuery<AssignmentWeekGroup[]>({
    queryKey: ['staffAssignments'],
    queryFn: () => getStaffAssignments(tokenState),
    enabled: !!tokenState.access,
  });
  const assignments = weekGroups?.find((group) => group.week === week)?.assignments;

  const [toastMessage, setToastMessage] = useState('');

  const deleteMutation = useMutation({
    mutationFn: (assignmentId: number) => deleteAssignment(tokenState, assignmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staffAssignments'] });
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
      queryClient.invalidateQueries({ queryKey: ['staffAssignments'] });
      // 제출 현황 페이지에서 토스트로 안내
      sessionStorage.setItem('assignmentEdited', '1');
      router.push(`/mypage/assignment/${week}`);
    },
  });

  if (!userProfile || !assignments) return null;

  return (
    <>
      <AssignmentCreateForm
        mode="edit"
        partName={userProfile.partName}
        initialWeek={week}
        initialDrafts={assignments.map((assignment) => ({
          assignmentId: assignment.assignmentId,
          title: assignment.title,
          endDate: assignment.endDate.slice(0, 10),
          // ⚠️ 과제 목록 API(GET /api/assignments/staff)가 detail/type을 내려주지 않아 기존 값을 채울 수 없음.
          // 단건 조회 API도 없어서, 응답에 두 필드가 추가되기 전까지 수정 화면은 사용할 수 없습니다.
          detail: '',
          type: 'FILE' as const,
        }))}
        submitting={saveMutation.isPending}
        onClose={() => router.push(`/mypage/assignment/${week}`)}
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
