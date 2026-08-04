import { BackgroundColor } from '@utils/constant/color';
import NavBar from '@common/header/NavBar';
import Footer from '@common/footer/Footer';
import styled from 'styled-components';
import { ReactElement } from 'react';
import MobileNavBar from '@common/header/MobileNavBar';

const LayoutFullWidth = ({ children }: { children: ReactElement }) => {
  return (
    <>
      <NavBar />
      <MobileNavBar />
      <main>
        <PageContainer>{children}</PageContainer>
      </main>
      <Footer isLandingLayout={false} />
    </>
  );
};

export default LayoutFullWidth;

const PageContainer = styled.div`
  background-color: ${BackgroundColor};
  min-height: calc(100vh - 184px);
  width: 100%;
  padding-top: 68px;
  padding-bottom: 93px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
