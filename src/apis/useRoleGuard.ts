import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { MemberRole } from '@@types/request';
import useTokenStore from 'src/store/useTokenStore';
import useUserProfile from 'src/apis/useUserProfile';

const useRoleGuard = (canAccess: (role: MemberRole) => boolean) => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();

  const { data: userProfile, isError: isUserProfileError } = useUserProfile();

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  useEffect(() => {
    if (userProfile && !canAccess(userProfile.role)) router.push('/mypage');
  }, [userProfile, canAccess, router]);

  const isAuthorized = !!tokenState.access && !!userProfile && canAccess(userProfile.role);

  return { userProfile, isAuthorized, isUserProfileError };
};

export default useRoleGuard;
