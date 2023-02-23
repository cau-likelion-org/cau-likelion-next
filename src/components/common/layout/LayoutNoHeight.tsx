import { BackgroundColor } from '@utils/constant/color';
import NavBar from '@common/header/NavBar';
import Footer from '@common/footer/Footer';
import styled from 'styled-components';
import { ReactElement } from 'react';
<<<<<<< HEAD
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
=======

const LayoutNoHeight = ({ children }: { children: ReactElement; }) => {
    return (
        <>
            <NavBar />
            <main>
                <PageContainer>{children}</PageContainer>
            </main>
            <Footer isLandingLayout={false} />
        </>
    );
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
};

export default LayoutNoHeight;

const PageContainer = styled.div`
  background-color: ${BackgroundColor};
  min-height: calc(100vh - 184px);
  width: 100%;
  display: flex;
  flex-direction: column;
<<<<<<< HEAD
  align-items: center;
=======
  justify-content: center;
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9

  @media (max-width: 1440px) {
    padding: 100px 250px 100px 250px;
  }
  @media (max-width: 1280px) {
    padding: 100px 150px 100px 150px;
  }
<<<<<<< HEAD

  @media(max-width: 900px) {
    padding: 100px 30px;
  }
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
  padding: 100px 360px 100px 360px;
`;
