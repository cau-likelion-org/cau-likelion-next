import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { MemberRole } from '@@types/request';
import useTokenStore from 'src/store/useTokenStore';
import useUserProfile from 'src/apis/useUserProfile';
import useLoginRequired from 'src/hooks/useLoginRequired';

interface RoleGuardOptions {
  loginPath?: string;
  forbiddenPath?: string;
}

const useRoleGuard = (
  canAccess: (role: MemberRole) => boolean,
  { loginPath = '/login', forbiddenPath = '/mypage' }: RoleGuardOptions = {},
) => {
  const tokenState = useTokenStore((state) => state.token);
  const router = useRouter();

  const { data: userProfile, isError: isUserProfileError } = useUserProfile();

  useLoginRequired(loginPath);

  useEffect(() => {
    if (userProfile && !canAccess(userProfile.role)) router.push(forbiddenPath);
  }, [userProfile, canAccess, router, forbiddenPath]);

  const isAuthorized = !!tokenState.access && !!userProfile && canAccess(userProfile.role);

  return { userProfile, isAuthorized, isUserProfileError };
};

export default useRoleGuard;
