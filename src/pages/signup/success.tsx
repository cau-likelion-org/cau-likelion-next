import { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Button from '@common/button/Button';
import PageHeader from '@common/pageHeader/PageHeader';
import { IllustSignupComplete } from '@assets/svg';
import confettiAnimation from 'src/assets/lottie/confetti-success.json';
import useSessionFlagToast from 'src/hooks/useSessionFlagToast';
import { SIGNUP_SUCCESS_FLAG_KEY } from 'src/apis/signUp';
import useTokenStore from 'src/store/useTokenStore';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const SignUpSuccess = () => {
  const tokenAccess = useTokenStore((state) => state.token.access);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();

  const { isOpen: isJustSignedUp } = useSessionFlagToast(SIGNUP_SUCCESS_FLAG_KEY);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!tokenAccess) {
      router.push('/login');
      return;
    }
    if (!isJustSignedUp) {
      router.push('/');
    }
  }, [hasHydrated, tokenAccess, isJustSignedUp, router]);

  return (
    <Wrapper>
      <ConfettiLayer>
        <Lottie animationData={confettiAnimation} loop={false} />
      </ConfettiLayer>
      <ContentGroup>
        <Header
          align="center"
          title="가입이 완료되었어요!"
          subtitle={
            <>
              멋쟁이사자처럼 중앙대학교 커뮤니티
              <br />
              CAU LION 회원이 되신 것을 환영합니다.
            </>
          }
        />
        <IllustSignupComplete width={206} height={239} />
        <Button variant="solid" color="primary" size="large" onClick={() => router.push('/project')}>
          다른 아기사자들 프로젝트 둘러보기
        </Button>
      </ContentGroup>
    </Wrapper>
  );
};

SignUpSuccess.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default SignUpSuccess;

const Wrapper = styled.div`
  position: relative;
  width: 520px;
  max-width: 100%;
`;

const ConfettiLayer = styled.div`
  position: absolute;
  z-index: 0;
  top: -80px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  max-width: 180%;
  aspect-ratio: 546 / 727;
  pointer-events: none;
`;

const ContentGroup = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 65px;
`;

const Header = styled(PageHeader)`
  gap: 24px;
`;
