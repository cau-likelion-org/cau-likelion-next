import { ReactElement } from 'react';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import SignUpFormSection from '@signup/SignUpFormSection';

const SignUp = () => {
  return (
    <Wrapper>
      <SignUpFormSection />
    </Wrapper>
  );
};

SignUp.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default SignUp;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1060px;
  max-width: 100%;
`;
