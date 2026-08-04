import { useQueryClient } from '@tanstack/react-query';

import Button from '@common/button/Button';
import { IcLogout } from '@assets/svg';
import useTokenStore from 'src/store/useTokenStore';

const LogoutButton = () => {
  const setToken = useTokenStore((state) => state.setToken);
  const queryClient = useQueryClient();

  const handleLogout = () => {
    setToken({ access: null, refresh: null });
    queryClient.clear();
  };

  return (
    <Button
      variant="outlined"
      color="assistive"
      size="small"
      onClick={handleLogout}
      trailingIcon={<IcLogout width={16} height={16} />}
    >
      로그아웃
    </Button>
  );
};

export default LogoutButton;
