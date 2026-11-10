import { ReactElement } from 'react';
import styled from 'styled-components';

import LayoutFullWidth from '@common/layout/LayoutFullWidth';
import PasswordResetForm from '@recruit/history/PasswordResetForm';

const RecruitResetPassword = () => (
  <Wrapper>
    <PasswordResetForm />
  </Wrapper>
);

RecruitResetPassword.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFullWidth>{page}</LayoutFullWidth>;
};

export default RecruitResetPassword;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 20px 68px;
`;
