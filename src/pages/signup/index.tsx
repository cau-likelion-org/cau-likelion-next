import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SignUpFormSection from '@signup/SignUpFormSection';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { token } from '@utils/state';

const SignUp = () => {
  const router = useRouter();
  const tokenState = useRecoilValue(token);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (tokenState.access) {
      setIsLogin(true);
      router.push('/');
    }
  }, [tokenState]);

  return (
    <Wrapper>
      <TitleText>회원정보 입력</TitleText>
      <SmallText>CAU LIKELION 에 방문하신 것을 환영합니다!</SmallText>
      <SmallText>회원정보 입력 후 활동을 시작해보세요.</SmallText>
      <SignUpFormSection />
    </Wrapper>
  );
};

export default SignUp;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleText = styled.div`
  font-family: 'Gmarket Sans';
  font-style: normal;
  font-weight: 900;
  font-size: 2.5rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`;

const SmallText = styled(TitleText)`
  font-size: 1.4rem;
  font-weight: 500;
  margin-bottom: 5px;
`;
