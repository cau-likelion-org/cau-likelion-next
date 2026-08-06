import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import Button from '@common/button/Button';
import SignUpFormSection from '@signup/SignUpFormSection';
import { IcChevronDown } from '@assets/svg';

const SignUp = () => {
  const router = useRouter();

  return (
    <Wrapper>
      <CloseButton
        variant="outlined"
        color="assistive"
        size="medium"
        leadingIcon={<CloseIcon width={16} height={16} />}
        onClick={() => router.push('/login')}
      >
        닫기
      </CloseButton>
      <SignUpFormSection />
    </Wrapper>
  );
};

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default SignUp;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1060px;
  max-width: 100%;
`;

const CloseButton = styled(Button)`
  position: absolute;
  left: 0;
  top: 0;
`;

const CloseIcon = styled(IcChevronDown)`
  transform: rotate(90deg);
`;
