import { UserProfile } from '@@types/request';
import { AxiosError } from 'axios';
import { ReactElement, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useTokenStore from 'src/store/useTokenStore';
import useProfileChangedStore from 'src/store/useProfileChangedStore';
import { getUserProfile } from 'src/apis/account';
import { canCreateAttendance, isAdminRole } from '@utils/index';
import styled from 'styled-components';
import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import MyPageShell from '@mypage/component/MyPageShell';
import ProfileCard from '@mypage/component/ProfileCard';
import AttendanceCheckCard from '@mypage/component/AttendanceCheckCard';
import MakeAttendanceCard from '@mypage/component/MakeAttendanceCard';
import MyScoreSection from '@mypage/MyScoreSection';
import TotalScoreSection from '@mypage/TotalScoreSection';
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

  if (!userProfile) return null;

  return (
    <MyPageShell active="home" isAdmin={isAdminRole(userProfile.role)}>
      <CardRow>
        <ProfileCard user={userProfile} />
        {canCreateAttendance(userProfile.role) ? <MakeAttendanceCard /> : <AttendanceCheckCard />}
      </CardRow>
      {isAdminRole(userProfile.role) ? (
        <TotalScoreSection myName={userProfile.name} />
      ) : (
        <MyScoreSection userProfile={userProfile} />
      )}
    </MyPageShell>
  );
};

MyPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default MyPage;

const CardRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
`;
