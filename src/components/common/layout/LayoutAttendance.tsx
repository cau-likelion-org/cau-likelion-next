import { ReactElement } from 'react';
import styled from 'styled-components';

import NavBar from '@common/header/NavBar';
import Footer from '@common/footer/Footer';

import Lion from '@image/cau사자background.png';

export default function LayoutAttendance({ children }: { children: ReactElement }) {
  return (
    <>
      <PageContainer>
        <NavBar />
        <main>{children}</main>
        <Footer isDefaultLayout={false} />
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
    background-repeat: repeat;
    background-size: 250px 250px;
    opacity: 0.2;
  }
`;
