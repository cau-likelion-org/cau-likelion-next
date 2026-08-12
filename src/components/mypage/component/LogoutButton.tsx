import { useMutation, useQueryClient } from '@tanstack/react-query';

import Button from '@common/button/Button';
import { IcLogout } from '@assets/svg';
import useTokenStore from 'src/store/useTokenStore';
import { logout } from 'src/apis/account';

const LogoutButton = () => {
  const tokenState = useTokenStore((state) => state.token);
  const setToken = useTokenStore((state) => state.setToken);
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: () => logout(tokenState.refresh),
    onSettled: () => {
      setToken({ access: null, refresh: null });
      queryClient.clear();
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
