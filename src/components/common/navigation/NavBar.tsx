import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import CAULogo from '@image/cau사자.png';
import NavBarButton from './NavBarButton';

const NavBar = () => {

  const NavBarData = [
    {
      title: '프로젝트',
      routing: '/project',
    },
    {
      title: '아카이빙',
      routing: '/gallery',
    },
    {
      title: '커뮤니티',
      routing: '/freeboard',
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
        <Image src={CAULogo} width={'50px'} height={'50px'} alt="이미지임" />
        <Ptag>LIKELION</Ptag>
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
  height: 100px;
  padding: 0 15%;
  width: 100%;
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #000000;
`;

const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Ptag = styled.p`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 900;
  font-size: 27px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 500px;
`;