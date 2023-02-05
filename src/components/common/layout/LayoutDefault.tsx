import { BackgroundColor } from '@utils/constant/color';
import NavBar from '@common/header/NavBar';
import Footer from '@common/footer/Footer';
import styled from 'styled-components';
import { ReactElement } from 'react';

const LayoutDefault = ({ children }: { children: ReactElement }) => {
  return (
    <>
      <NavBar />
      <main>
        <PageContainer>{children}</PageContainer>
      </main>
      <Footer isDefaultLayout={true} />
    </>
  );
};

export default LayoutDefault;
const PageContainer = styled.div`
  background-color: ${BackgroundColor};
  min-height: calc(100vh - 270px);
  width: 100%;

  @media (max-width: 1440px) {
    padding: 100px 250px 100px 250px;
  }
  @media (max-width: 1280px) {
    padding: 100px 150px 100px 150px;
  }
  padding: 100px 360px 100px 360px;
`;