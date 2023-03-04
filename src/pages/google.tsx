import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { login } from 'src/apis/account';
import { useRecoilState, useRecoilValue } from 'recoil';
import cookie from 'react-cookies';
import { useMutation } from 'react-query';
import { token } from '@utils/state';

const Google = () => {
  const router = useRouter();
  const { code: code } = router.query;
  const [{ access, refresh }, setToken] = useRecoilState(token);
  useEffect(() => {
    if (access) {
      router.push('/');
    }
  }, []);
  const loginHandler = useMutation({
    mutationFn: ({ code }: { code: string | string[]; }) => login(code),
    onSuccess: (res) => {
      console.log(res);
      if (!res.is_active) {
        router.push(
          {
            pathname: '/signup',
            query: { accessToken: res.token.access, refreshToken: res.token.refresh },
          },
          '/signup',
        );
      } else if (res.is_active) {
        setToken((prev) => {
          const obj = { ...prev };
          obj.access = res.token.access;
          obj.refresh = res.token.refresh;
          return obj;
        });
        cookie.save('access', res.token.access, { path: '/' });
        cookie.save('refresh', res.token.refresh, { path: '/' });
        //회원가입 안된사람 vs 된 사람
        //리코일 아톰에다가 api쳐서 설정하는거어떰

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
  }, [code]);

  return <div>로딩중</div>;
};

export default Google;
