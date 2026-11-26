import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useTokenStore from 'src/store/useTokenStore';

const useLoginRequired = (redirectPath = '/login') => {
  const router = useRouter();
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && !tokenState.access) router.push(redirectPath);
  }, [hasHydrated, tokenState, router, redirectPath]);
};

export default useLoginRequired;
