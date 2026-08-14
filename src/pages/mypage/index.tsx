import { UserProfile } from '@@types/request';
import { AxiosError } from 'axios';
import { ReactElement, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useTokenStore from 'src/store/useTokenStore';
import useProfileChangedStore from 'src/store/useProfileChangedStore';
import { getUserProfile } from 'src/apis/account';
import { canCreateAttendance, isAdminRole, isAttendanceTarget, canManageSitePages } from '@utils/index';
import styled from 'styled-components';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Toast from '@common/toast/Toast';
import MyPageShell from '@mypage/component/MyPageShell';
import ProfileCard from '@mypage/component/ProfileCard';
import AttendanceCheckCard from '@mypage/component/AttendanceCheckCard';
import MakeAttendanceCard from '@mypage/component/MakeAttendanceCard';
import MyScoreSection from '@mypage/MyScoreSection';
import MemberScoreSection from '@mypage/MemberScoreSection';
import { useRouter } from 'next/router';

const MyPage = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const profileChanged = useProfileChangedStore((state) => state.profileChanged);
  const router = useRouter();

  const { data: userProfile } = useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile', profileChanged],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  // 어른사자는 활동 기수가 아니므로 마이페이지에 들어올 때마다 안내
  const [toastMessage, setToastMessage] = useState('');
  useEffect(() => {
    if (userProfile?.role !== 'ADULT_LION') return;
    const frame = requestAnimationFrame(() => setToastMessage('현재 활동 중인 구성원이 아닙니다.'));
    return () => cancelAnimationFrame(frame);
  }, [userProfile?.role]);

  if (!userProfile) return null;

  return (
    <>
      <ToastWrapper>
        <Toast variant="negative" text={toastMessage} show={!!toastMessage} onHidden={() => setToastMessage('')} />
      </ToastWrapper>
      <MyPageShell active="home" isAdmin={canManageSitePages(userProfile.role)}>
        <CardRow>
          <ProfileCard user={userProfile} />
          {canCreateAttendance(userProfile.role) ? (
            <MakeAttendanceCard />
          ) : (
            <AttendanceCheckCard isTarget={isAttendanceTarget(userProfile.role)} />
          )}
        </CardRow>
        {isAdminRole(userProfile.role) ? (
          <MemberScoreSection userProfile={userProfile} />
        ) : (
          <MyScoreSection userProfile={userProfile} />
        )}
      </MyPageShell>
    </>
  );
};

MyPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default MyPage;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;

const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
