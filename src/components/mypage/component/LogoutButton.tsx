import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import Button from '@common/button/Button';
import { IcLogout } from '@assets/svg';
import useTokenStore from 'src/store/useTokenStore';
import { LOGOUT_SUCCESS_FLAG_KEY, deleteFcmToken, logout } from 'src/apis/account';
import { clearCachedFcmToken, getCachedFcmToken } from 'src/lib/pushNotification';

const LogoutButton = () => {
  const router = useRouter();
  const tokenState = useTokenStore((state) => state.token);
  const setToken = useTokenStore((state) => state.setToken);
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // 이 기기 토큰만 지운다. 실패해도 로그아웃 자체는 진행되어야 한다.
      const fcmToken = getCachedFcmToken();
      if (fcmToken) {
        try {
          await deleteFcmToken(tokenState, fcmToken);
        } catch (error) {
          console.error('[push] FCM 토큰 삭제 실패', error);
        }
        clearCachedFcmToken();
      }
      await logout(tokenState.refresh);
    },
    onSettled: () => {
      setToken({ access: null, refresh: null });
      queryClient.clear();
      sessionStorage.setItem(LOGOUT_SUCCESS_FLAG_KEY, 'true');
      router.push('/');
    },
  });

  return (
    <Button
      variant="outlined"
      color="assistive"
      size="small"
      onClick={() => logoutMutation.mutate()}
      trailingIcon={<IcLogout width={16} height={16} />}
    >
      로그아웃
    </Button>
  );
};

export default LogoutButton;
