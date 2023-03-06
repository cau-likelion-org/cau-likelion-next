import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { login } from 'src/apis/account';
import { useRecoilState, useRecoilValue } from 'recoil';
import cookie from 'react-cookies';
import { useMutation } from 'react-query';
import { token } from '@utils/state';
import Loading from '@common/loading/Loading';

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
    onSuccess: (res) => {
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
      cookie.save('access', res.token.access, { path: '/' });
      cookie.save('refresh', res.token.refresh, { path: '/' });
    },
    onError: (res) => {
      router.push('/login/failed', undefined, { shallow: true });
    },
  });
  return <Loading />;
};


export default Google;
