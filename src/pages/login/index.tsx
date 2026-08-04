import { ReactElement } from 'react';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import PageHeader from '@common/pageHeader/PageHeader';
import LoginButton from 'src/components/login/contents/component/LoginButton';
import useAuthRedirect from 'src/hooks/useAuthRedirect';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const Login = () => {
  useAuthRedirect();

  return (
    <Wrapper>
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
      <LoginButton />
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

  @media (max-width: 900px) {
    padding-top: 40px;
  }
`;

const GuideText = styled.div`
  color: ${Label.assistive};
  text-align: center;
  ${typographyCss(Typography.body2Normal.medium)}

  p {
    margin: 0;
  }
`;
