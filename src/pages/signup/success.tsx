import { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Button from '@common/button/Button';
import PageHeader from '@common/pageHeader/PageHeader';
import { SIGNUP_SUCCESS_FLAG_KEY } from 'src/apis/signUp';
import useTokenStore from 'src/store/useTokenStore';

const SignUpSuccess = () => {
  const tokenState = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!tokenState.access) {
      router.push('/login');
      return;
    }
    const isJustSignedUp = sessionStorage.getItem(SIGNUP_SUCCESS_FLAG_KEY);
    if (!isJustSignedUp) {
      router.push('/');
      return;
    }
    sessionStorage.removeItem(SIGNUP_SUCCESS_FLAG_KEY);
  }, [hasHydrated, tokenState, router]);

  return (
    <Wrapper>
      <Header
        align="center"
        title="가입이 완료되었어요!"
        subtitle={
          <>
            멋쟁이사자처럼 중앙대학교 커뮤니티
            <br />
            CAU LION 회원이 되신 것을 환영합니다
          </>
        }
      />
      <ImagePlaceholder />
      <Button variant="solid" color="primary" size="large" onClick={() => router.push('/project')}>
        다른 아기사자들 프로젝트 둘러보기
      </Button>
    </Wrapper>
  );
};

SignUpSuccess.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default SignUpSuccess;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 65px;
  width: 520px;
  max-width: 100%;
`;

const Header = styled(PageHeader)`
  gap: 24px;
`;

const ImagePlaceholder = styled.div`
  width: 252px;
  height: 252px;
  background-color: rgba(112, 115, 124, 0.05);
`;
