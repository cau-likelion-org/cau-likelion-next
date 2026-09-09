import { BackgroundColor } from '@utils/constant/color';
import { containerCss } from '@utils/constant/breakpoint';
import NavBar from '@common/header/NavBar';
import Footer from '@common/footer/Footer';
import styled from 'styled-components';
import { ReactElement } from 'react';
import MobileNavBar from '@common/header/MobileNavBar';

const LayoutDefault = ({ children }: { children: ReactElement }) => {
  return (
    <>
      <NavBar />
      <MobileNavBar />
      <main>
        <PageContainer>
          <ContentContainer>{children}</ContentContainer>
        </PageContainer>
      </main>
      <Footer isLandingLayout={false} />
    </>
  );
};

export default LayoutDefault;

const PageContainer = styled.div`
  background-color: ${BackgroundColor};
  min-height: calc(100vh - 184px);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 0;
`;

const ContentContainer = styled.div`
  ${containerCss}
  display: flex;
  flex-direction: column;
  align-items: center;
`;
