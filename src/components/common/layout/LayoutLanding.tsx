import { BackgroundColor } from '@utils/constant/color';
import NavBar from '@common/header/NavBar';
import Footer from '@common/footer/Footer';
import styled from 'styled-components';
import { ReactElement } from 'react';

const LayoutLanding = ({ children }: { children: ReactElement; }) => {
    return (
        <>
            <NavBar />
            <main>
                <PageContainer>{children}</PageContainer>
            </main>
            <Footer isLandingLayout={true} />
        </>
    );
};

export default LayoutLanding;
const PageContainer = styled.div`
  background-color: ${BackgroundColor};
  min-height: calc(100vh - 180.5px);
  width: 100%;

  @media (max-width: 1440px) {
    padding: 100px 250px 100px 250px;
  }
  @media (max-width: 1280px) {
    padding: 100px 150px 100px 150px;
  }
  padding: 100px 360px 100px 360px;
`;
