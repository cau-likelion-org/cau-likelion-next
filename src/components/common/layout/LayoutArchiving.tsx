import Footer from '@common/footer/Footer';
import MobileNavBar from '@common/header/MobileNavBar';
import NavBar from '@common/header/NavBar';
import { BackgroundColor } from '@utils/constant/color';
import { ReactElement } from 'react';
import styled from 'styled-components';

const LayoutArchiving = ({ children }: { children: ReactElement; }) => {
  return (
    <>
      <PageContainer>
        <NavBar />
        <MobileNavBar />
        <main>{children}</main>
      </PageContainer>
      <Footer isLandingLayout={false} />
    </>
  );
};

export default LayoutArchiving;

const PageContainer = styled.div`
  background-color: ${BackgroundColor};
  min-height: calc(100vh - 184px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1440px) {
    padding: 100px 100px 100px 100px;
  }

  @media (max-width: 900px) {
    padding: 70px 20px;
  }
  padding: 100px 160px 100px 160px;
  
`;
