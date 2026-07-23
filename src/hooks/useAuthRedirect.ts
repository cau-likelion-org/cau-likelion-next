import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { token } from '@utils/state';

const useAuthRedirect = () => {
  const router = useRouter();
  const tokenState = useRecoilValue(token);

  useEffect(() => {
    if (tokenState.access) {
      router.push('/');
    }
  }, [tokenState.access]);
};

export default useAuthRedirect;
