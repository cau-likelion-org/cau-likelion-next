import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import PageHeader from '@common/pageHeader/PageHeader';
import Toast from '@common/toast/Toast';
import LoginButton from 'src/components/login/component/LoginButton';
import useAuthRedirect from 'src/hooks/useAuthRedirect';
import useTokenStore from 'src/store/useTokenStore';
import { googleLogin } from 'src/apis/account';
import { SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY, PENDING_SIGNUP_TOKEN_KEY } from 'src/apis/signUp';
import { consumeGoogleLoginRedirect, redirectToGoogleLogin } from '@utils/googleOAuth';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';

interface ToastConfig {
  variant: 'positive' | 'negative';
  message: ReactNode;
}

const TOAST_CONFIG_BY_FLAG: Record<string, ToastConfig> = {
  [SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY]: {
    variant: 'negative',
    message: (
      <>
        사전 등록된 이메일로만 회원가입이 가능합니다.
        <br />
        운영진에게 문의해주세요.
      </>
    ),
  },
};
const TOAST_FLAG_KEYS = Object.keys(TOAST_CONFIG_BY_FLAG);

const GOOGLE_LOGIN_FAILED_MESSAGE = '로그인에 실패했어요. 새로고침 후 다시 시도해주세요.';

const Login = () => {
  useAuthRedirect();
  const router = useRouter();
  const setToken = useTokenStore((state) => state.setToken);

  const [redirectResult] = useState(() => (typeof window === 'undefined' ? null : consumeGoogleLoginRedirect()));

  const [toast, setToast] = useState<ToastConfig | null>(() => {
    if (typeof window === 'undefined') return null;
    if (redirectResult && 'error' in redirectResult) {
      return { variant: 'negative', message: GOOGLE_LOGIN_FAILED_MESSAGE };
    }
    const activeKey = TOAST_FLAG_KEYS.find((key) => sessionStorage.getItem(key) === 'true');
    return activeKey ? TOAST_CONFIG_BY_FLAG[activeKey] : null;
  });

  useEffect(() => {
    if (!toast) return;
    TOAST_FLAG_KEYS.forEach((key) => sessionStorage.removeItem(key));
  }, [toast]);

  const loginMutation = useMutation({
    mutationFn: (idToken: string) => googleLogin(idToken),
    onSuccess: (res) => {
      if (res.status === 'SIGNUP_REQUIRED') {
        sessionStorage.setItem(PENDING_SIGNUP_TOKEN_KEY, res.signupToken);
        router.push('/signup');
        return;
      }
      setToken({ access: res.tokens.accessToken, refresh: res.tokens.refreshToken });
    },
    onError: (error) => {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      // 4xx(EMAIL_NOT_ALLOWED)만 "미가입 이메일" 업무 오류로 간주. 5xx·네트워크 오류는 조용히 무시
      if (status !== undefined && status >= 400 && status < 500) {
        setToast(TOAST_CONFIG_BY_FLAG[SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY]);
      }
    },
  });

  useEffect(() => {
    if (redirectResult && 'idToken' in redirectResult) {
      loginMutation.mutate(redirectResult.idToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <ToastWrapper>
        <Toast
          variant={toast?.variant ?? 'negative'}
          text={toast?.message ?? ''}
          show={!!toast}
          width={348}
          onHidden={() => setToast(null)}
        />
      </ToastWrapper>
      <TextGroup
        align="center"
        title="로그인"
        subtitle={
          <>
            멋쟁이사자처럼 중앙대학교 커뮤니티
            <br />
            CAU LION에 오신 것을 환영합니다.
          </>
        }
      />
      <LoginButton onClick={redirectToGoogleLogin} loading={loginMutation.isPending} />
      <GuideText>
        <p>처음 이용하는 아기사자의 경우</p>
        <p>‘구글로 로그인하기’를 눌러 회원가입을 진행해 주세요.</p>
      </GuideText>
    </Wrapper>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default Login;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  width: 1060px;
  max-width: 100%;
`;

const TextGroup = styled(PageHeader)`
  gap: 24px;
  padding-bottom: 52px;

  p:first-of-type {
    ${typographyCss(Typography.title2.bold)}
  }

  ${media.xs} {
    padding-top: 40px;
  }
`;

const ToastWrapper = styled.div`
  position: fixed;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10001;
  pointer-events: none;
`;

const GuideText = styled.div`
  color: ${Label.assistive};
  text-align: center;
  ${typographyCss(Typography.body2Normal.medium)}

  p {
    margin: 0;
  }
`;
