import { ReactElement } from 'react';
import styled from 'styled-components';

import NavBar from '@common/header/NavBar';
import Footer from '@common/footer/Footer';

import Lion from '@image/background.png';
<<<<<<< HEAD
import MobileNavBar from '@common/header/MobileNavBar';

export default function LayoutAttendance({ children }: { children: ReactElement }) {
=======

export default function LayoutAttendance({ children }: { children: ReactElement; }) {
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
        <Footer isLandingLayout={false} />
      </PageContainer>
    </>
  );
}
const PageContainer = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-image: url(${Lion.src});
<<<<<<< HEAD
    @media (max-width: 900px) {
      background-size: 900px;
    }
=======
>>>>>>> c11c1f16dc937071ef92f3bdfdbae3896e83dcc9
  }
`;
