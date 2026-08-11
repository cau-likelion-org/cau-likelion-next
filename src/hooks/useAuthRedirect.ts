import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useTokenStore from 'src/store/useTokenStore';

const useAuthRedirect = () => {
  const router = useRouter();
  const tokenState = useTokenStore((state) => state.token);

  useEffect(() => {
    if (tokenState.access) {
      router.replace('/mypage');
    }
  }, [tokenState.access]);
};

export default useAuthRedirect;
