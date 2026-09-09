import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import { UserProfile } from '@@types/request';
import { getUserProfile } from 'src/apis/account';
import useTokenStore from 'src/store/useTokenStore';
import { isAdminRole } from '@utils/index';

// 운영진(STAFF/PRESIDENT/ADMIN) 전용 화면 가드.
// 아기사자·어른사자가 URL로 직접 들어오면 과제 목록으로 돌려보낸다.
// 실제 권한 통제는 서버 몫이고, 이건 권한 없는 화면이 뜨는 것을 막는 용도다.
const useStaffOnly = () => {
  const router = useRouter();
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.replace('/login');
  }, [hasHydrated, tokenState.access, router]);

  useEffect(() => {
    if (!userProfile || isAdminRole(userProfile.role)) return;
    router.replace('/mypage/assignment');
  }, [userProfile, router]);

  return { userProfile, isStaff: !!userProfile && isAdminRole(userProfile.role) };
};

export default useStaffOnly;
