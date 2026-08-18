import { ReactElement, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import PageHeader from '@common/pageHeader/PageHeader';
import Toast from '@common/toast/Toast';
import LoginButton from 'src/components/login/contents/component/LoginButton';
import useAuthRedirect from 'src/hooks/useAuthRedirect';
import { SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY } from 'src/apis/signUp';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { media } from '@utils/constant/breakpoint';

const TOAST_MESSAGE_BY_FLAG: Record<string, ReactNode> = {
  [SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY]: (
    <>
      사전 등록된 이메일로만 회원가입이 가능합니다.
      <br />
      운영진에게 문의해주세요.
    </>
  ),
};
const TOAST_FLAG_KEYS = Object.keys(TOAST_MESSAGE_BY_FLAG);

const GOOGLE_LOGIN_FAILED_MESSAGE = '로그인에 실패했어요. 새로고침 후 다시 시도해주세요.';

const Login = () => {
  useAuthRedirect();

  const [toastMessage, setToastMessage] = useState<ReactNode>(() => {
    if (typeof window === 'undefined') return '';
    const activeKey = TOAST_FLAG_KEYS.find((key) => sessionStorage.getItem(key) === 'true');
    return activeKey ? TOAST_MESSAGE_BY_FLAG[activeKey] : '';
  });

  useEffect(() => {
    if (!toastMessage) return;
    TOAST_FLAG_KEYS.forEach((key) => sessionStorage.removeItem(key));
  }, [toastMessage]);

  return (
    <Wrapper>
      <ToastWrapper>
        <Toast
          variant="negative"
          text={toastMessage}
          show={!!toastMessage}
          width={348}
          onHidden={() => setToastMessage('')}
        />
      </ToastWrapper>
      <TextGroup
        align="center"
        title="로그인"
        subtitle={
          <>
            멋쟁이사자처럼 중앙대학교 커뮤니티
            <br />
            CAU LION에 오신것을 환영합니다!
          </>
        }
      />
      <LoginButton
        onUnregistered={() => setToastMessage(TOAST_MESSAGE_BY_FLAG[SIGNUP_UNAPPROVED_EMAIL_FLAG_KEY])}
        onGoogleUnavailable={() => setToastMessage(GOOGLE_LOGIN_FAILED_MESSAGE)}
      />
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
