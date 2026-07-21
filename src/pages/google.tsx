import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { login } from 'src/apis/account';
import { useRecoilState } from 'recoil';
import { useMutation } from 'react-query';
import { token } from '@utils/state';
import Loading from '@common/loading/Loading';
import LocalStorage from '@utils/localStorage';
import { track } from 'src/lib/amplitude';

const Google = () => {
  const router = useRouter();
  const { code: code } = router.query;
  const [{ access, refresh }, setToken] = useRecoilState(token);

  useEffect(() => {
    if (access) {
      router.push('/');
    }
  }, [access]);

  useEffect(() => {
    if (code) loginHandler.mutate({ code });
  }, [code]);

  const loginHandler = useMutation({
    mutationFn: ({ code }: { code: string | string[]; }) => login(code),
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
      setToken((prev) => {
        const obj = { ...prev };
        obj.access = res.token.access;
        obj.refresh = res.token.refresh;
        return obj;
      });
      LocalStorage.setItem('access', res.token.access);
      LocalStorage.setItem('refresh', res.token.refresh);
    },
    onError: (res) => {
      track('Login Failed', { login_method: 'google' });
      router.push('/login/failed', undefined, { shallow: true });
    },
  });
  return <Loading />;
};

export default Google;
