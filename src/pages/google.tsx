import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { login } from 'src/apis/account';
import { useRecoilValue } from 'recoil';
import { accessToken } from '@utils/state';
import cookie from 'react-cookies';
import { useMutation } from 'react-query';

const Google = () => {
  const router = useRouter();
  const { code: code } = router.query;
  const tokenState = useRecoilValue(accessToken);

  const loginHandler = useMutation({
    mutationFn: ({ code }: { code: string | string[] }) => login(code),
    onSuccess: (res) => {
      if (!res.is_active) {
        router.push(
          {
            pathname: '/signup',
            query: { accessToken: res.accessToken },
          },
          '/signup',
        );
      } else if (res.is_active) {
        router.push('/');
      }
    },
    onError: (res) => {
      router.push('/login/failed', undefined, { shallow: true });
    },
  });

  useEffect(() => {
    if (code) loginHandler.mutate({ code });
    router.push('/', undefined, { shallow: true });
  }, [router, loginHandler, code, tokenState]);

  return <div>로딩중</div>;
};

export default Google;
