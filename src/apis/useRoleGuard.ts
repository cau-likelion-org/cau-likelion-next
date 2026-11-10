import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { MemberRole, UserProfile } from '@@types/request';
import { getUserProfile } from 'src/apis/account';
import useTokenStore from 'src/store/useTokenStore';

const useRoleGuard = (canAccess: (role: MemberRole) => boolean) => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();

  const { data: userProfile, isError: isUserProfileError } = useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push('/login');
  }, [hasHydrated, tokenState, router]);

  useEffect(() => {
    if (userProfile && !canAccess(userProfile.role)) router.push('/mypage');
  }, [userProfile, canAccess, router]);

  const isAuthorized = !!userProfile && canAccess(userProfile.role);

  return { userProfile, isAuthorized, isUserProfileError };
};

export default useRoleGuard;
