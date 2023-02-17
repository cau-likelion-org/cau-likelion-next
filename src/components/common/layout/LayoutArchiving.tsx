import Footer from '@common/footer/Footer';
<<<<<<< HEAD
import MobileNavBar from '@common/header/MobileNavBar';
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
import NavBar from '@common/header/NavBar';
import { BackgroundColor } from '@utils/constant/color';
import { ReactElement } from 'react';
import styled from 'styled-components';

<<<<<<< HEAD
const LayoutArchiving = ({ children }: { children: ReactElement; }) => {
=======
const LayoutArchiving = ({ children }: { children: ReactElement }) => {
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
  return (
    <>
      <PageContainer>
        <NavBar />
<<<<<<< HEAD
        <MobileNavBar />
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
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
  @media (max-width: 1280px) {
    padding: 100px 100px 100px 100px;
  }
  padding: 100px 160px 100px 160px;
`;
