import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { login, LOGIN_UNREGISTERED_FLAG_KEY } from 'src/apis/account';
import { PENDING_SIGNUP_ACCESS_TOKEN_KEY, PENDING_SIGNUP_REFRESH_TOKEN_KEY } from 'src/apis/signUp';
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
        sessionStorage.setItem(PENDING_SIGNUP_ACCESS_TOKEN_KEY, res.token.access ?? '');
        sessionStorage.setItem(PENDING_SIGNUP_REFRESH_TOKEN_KEY, res.token.refresh ?? '');
        router.push('/signup');
        return;
      }
      setToken({ access: res.token.access, refresh: res.token.refresh });
    },
    onError: (error) => {
      track('Login Failed', { login_method: 'google' });
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      // 4xx만 "미가입 이메일" 업무 오류로 간주. 5xx·네트워크 오류는 일반 로그인 화면으로만 보냄
      if (status !== undefined && status >= 400 && status < 500) {
        sessionStorage.setItem(LOGIN_UNREGISTERED_FLAG_KEY, 'true');
      }
      router.push('/login');
    },
  });

  useEffect(() => {
    if (code) loginHandler.mutate({ code });
  }, [code]);

  return <Loading />;
};

export default Google;
