import { BackgroundColor } from '@utils/constant/color';
import NavBar from '@common/header/NavBar';
import Footer from '@common/footer/Footer';
import styled from 'styled-components';
import { ReactElement } from 'react';
<<<<<<< HEAD
import MobileNavBar from '@common/header/MobileNavBar';
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9

const LayoutLanding = ({ children }: { children: ReactElement; }) => {
  return (
    <>
      <NavBar />
<<<<<<< HEAD
      <MobileNavBar />
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
      <main>
        <PageContainer>{children}</PageContainer>
      </main>
      <Footer isLandingLayout={true} />
    </>
  );
};

export default LayoutLanding;
<<<<<<< HEAD

=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
const PageContainer = styled.div`
  background-color: ${BackgroundColor};
  min-height: calc(100vh - 184px);
  width: 100%;
<<<<<<< HEAD
  display: flex;
  flex-direction: column;
  align-items: center;
=======
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
  padding: 100px 360px 100px 360px;
`;

=======
  padding: 100px 360px 100px 360px;
`;
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
