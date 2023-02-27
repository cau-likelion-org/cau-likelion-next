import { BackgroundColor } from '@utils/constant/color';
import NavBar from '@common/header/NavBar';
import Footer from '@common/footer/Footer';
import styled from 'styled-components';
import { ReactElement } from 'react';
import MobileNavBar from '@common/header/MobileNavBar';

const LayoutNoHeight = ({ children }: { children: ReactElement; }) => {
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

export default LayoutNoHeight;

const PageContainer = styled.div`
  background-color: ${BackgroundColor};
  min-height: calc(100vh - 184px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1440px) {
    padding: 100px 250px 100px 250px;
  }
  @media (max-width: 1280px) {
    padding: 100px 150px 100px 150px;
  }

  @media(max-width: 900px) {
    padding: 100px 30px;
  }
  padding: 100px 360px 100px 360px;
`;
