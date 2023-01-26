import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import CAULogo from '@image/cau사자.png';
import NavBarButton from './NavBarButton';
import { BackgroundColor } from '@utils/constant/color';
import Link from 'next/link';

const NavBar = () => {

  const NavBarData = [
    {
      title: '아카이빙',
      routing: '/gallery',
    },
    {
      title: '커뮤니티',
      routing: '/freeboard/list/1',
    },
    {
      title: '출석체크',
      routing: '/attendance',
    },
    {
      title: '로그인',
      routing: '/login',
    },
  ];

  return (
    <Wrapper>
      <LogoWrapper>
        <Link href={'/'}>
          <Image src={CAULogo} width={'50px'} height={'50px'} alt="로고 이미지" />
        </Link>
        <Link href={'/'}>
          <Title>LIKELION</Title>
        </Link>
      </LogoWrapper>
      <ButtonWrapper>
        {NavBarData.map((navbarButton, index) => (
          <NavBarButton
            key={index}
            title={navbarButton.title}
            routing={navbarButton.routing}
          />
        ))}
      </ButtonWrapper>
    </Wrapper>
  );
};

export default NavBar;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  @media(max-width: 1440px) {
    padding: 0 250px;
  }
  @media(max-width: 1280px) {
    padding: 0 150px;
  }
  padding: 0 360px;
  align-items: center;
  justify-content: space-between;
  background-color: ${BackgroundColor};
  z-index: 9999;
  /* border-bottom: 1px solid #000000; */
`;

const LogoWrapper = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const Title = styled.p`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-size: 23px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 500px;
  justify-content: space-between;
`;