import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { login } from 'src/apis/account';
import { useMutation } from '@tanstack/react-query';
import useTokenStore from 'src/store/useTokenStore';
import Loading from '@common/loading/Loading';
import useAuthRedirect from 'src/hooks/useAuthRedirect';
import { track } from 'src/lib/amplitude';

const Google = () => {
  const router = useRouter();
  const { code: code } = router.query;
  const setToken = useTokenStore((state) => state.setToken);

  useAuthRedirect();

  const loginHandler = useMutation({
    mutationFn: ({ code }: { code: string | string[] }) => login(code),
    retry: false,
    onSuccess: (res) => {
      track('Login Completed', { login_method: 'google', is_new_signup: !res.is_active });
      if (!res.is_active) {
        router.push(
          {
            pathname: '/signup',
            query: { accessToken: res.token.access, refreshToken: res.token.refresh },
          },
          '/signup',
        );
        return;
      }
      setToken({ access: res.token.access, refresh: res.token.refresh });
    },
    onError: (res) => {
      track('Login Failed', { login_method: 'google' });
      router.push('/login/failed', undefined, { shallow: true });
    },
  });

  useEffect(() => {
    if (code) loginHandler.mutate({ code });
  }, [code]);

  return <Loading />;
};

export default Google;
