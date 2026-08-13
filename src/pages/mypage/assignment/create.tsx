import { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { UserProfile } from '@@types/request';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import AssignmentCreateForm from '@mypage/component/AssignmentCreateForm';
import { getUserProfile } from 'src/apis/account';
import { AssignmentCreateRequest, createAssignments } from 'src/apis/assignment';
import useTokenStore from 'src/store/useTokenStore';

const AssignmentCreatePage = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  const createMutation = useMutation({
    mutationFn: (payload: AssignmentCreateRequest) => createAssignments(tokenState, payload),
    onSuccess: (_data, payload) => {
      queryClient.invalidateQueries({ queryKey: ['staffAssignments'] });
      // 목록 페이지에서 토스트로 안내 (N주차 과제가 생성되었습니다.)
      sessionStorage.setItem('assignmentCreatedWeek', String(payload.week));
      router.push('/mypage/assignment');
    },
  });

  if (!userProfile) return null;

  return (
    <AssignmentCreateForm
      partName={userProfile.partName}
      submitting={createMutation.isPending}
      onClose={() => router.push('/mypage/assignment')}
      onSubmit={(payload) => createMutation.mutate(payload)}
    />
  );
};

AssignmentCreatePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default AssignmentCreatePage;
