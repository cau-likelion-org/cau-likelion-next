import { BackgroundColor } from '@utils/constant/color';
import styled from 'styled-components';
import { ReactElement } from 'react';

const LayoutLogin = ({ children }: { children: ReactElement }) => {
  return (
    <>
      <main>
        <PageContainer>{children}</PageContainer>
      </main>
    </>
  );
};

export default LayoutLogin;

const PageContainer = styled.div`
  background-color: ${BackgroundColor};
  min-height: calc(100vh - 184px);
  width: 100%;
  padding: 0 360px;
  @media (max-width: 1200px) {
    width: 100%;
    padding: 0;
  }
`;
