import { ReactElement, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Toast from '@common/toast/Toast';
import AssignmentCreateForm from '@mypage/component/AssignmentCreateForm';
import { AssignmentCreateRequest, createAssignments } from 'src/apis/assignment';
import useStaffOnly from 'src/hooks/useStaffOnly';
import useTokenStore from 'src/store/useTokenStore';

const AssignmentCreatePage = () => {
  const tokenState = useTokenStore((state) => state.token);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [toastFailed, setToastFailed] = useState(false);

  const { userProfile, isStaff } = useStaffOnly();

  const createMutation = useMutation({
    mutationFn: (payload: AssignmentCreateRequest) => createAssignments(tokenState, payload),
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({ queryKey: ['staffAssignments'] });
      // 목록 페이지에서 토스트로 안내 (N주차 과제가 생성되었습니다.)
      sessionStorage.setItem('assignmentCreatedWeek', String(payload.week));
      router.push('/mypage/assignment');
    },
    onError: () => setToastFailed(true),
  });

  // 운영진이 아니면 훅이 리다이렉트하므로 그동안 아무것도 그리지 않는다
  if (!userProfile || !isStaff) return null;

  return (
    <>
      <ToastWrapper>
        <Toast
          variant="negative"
          width={TOAST_WIDTH}
          text={
            <>
              과제 생성에 실패했습니다. <NarrowBreak />
              잠시 후 다시 시도해 주세요.
            </>
          }
          show={toastFailed}
          onHidden={() => setToastFailed(false)}
        />
      </ToastWrapper>
      <AssignmentCreateForm
        partName={userProfile.partName}
        submitting={createMutation.isPending}
        onClose={() => router.push('/mypage/assignment')}
        onSubmit={(week, drafts) =>
          createMutation.mutate({
            week,
            assignments: drafts.map(({ title, detail, endDate, type }) => ({ title, detail, endDate, type })),
          })
        }
      />
    </>
  );
};

AssignmentCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default AssignmentCreatePage;

const TOAST_WIDTH = 460;

const NarrowBreak = styled.br`
  @media (min-width: ${TOAST_WIDTH + 40}px) {
    display: none;
  }
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;
