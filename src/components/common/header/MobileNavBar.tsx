import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import CAULogo from '@image/cau사자.png';
import { BackgroundColor } from '@utils/constant/color';
import Link from 'next/link';
import { HiMenu } from 'react-icons/hi';
import { HiXMark } from 'react-icons/hi2';
import MobileNavModal from './MobileNavModal';

export interface IHoverButton {
    'hover': {
        title: string;
    };
    'dropdown': IMenu[];
}

interface IMenu {
    title: string;
    routing: string;
}

const MobileNavBar = () => {
    const [isModalOn, setIsModalOn] = useState(false);
    const handleMenuModalOn = () => {
        setIsModalOn(!isModalOn);
    };

    return (
        <>
            <Wrapper>
                <LogoWrapper>
                    <Link href={'/'}>
                        <LogoImage>
                            <Image src={CAULogo} width={'30px'} height={'30px'} alt="로고 이미지" />
                        </LogoImage>
                    </Link>
                    <Link href={'/'}>
                        <Title>LIKELION</Title>
                    </Link>
                </LogoWrapper>
                <MenuButton onClick={handleMenuModalOn}>
                    {isModalOn ? <HiXMark size={20} /> : <HiMenu size={20} />}
                </MenuButton>
            </Wrapper>
            <MobileNavModal isModalOn={isModalOn} />
        </>
    );
};

export default MobileNavBar;

const Wrapper = styled.div`
  max-width: 100vw;
  width: 100%;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0 5rem;
  align-items: center;
  justify-content: space-between;
  background-color: ${BackgroundColor};
  z-index: 9999;

  @media(min-width: 900px) {
    display: none;
  }
`;

const LogoImage = styled.div`
min-width: 30px;
min-height: 30px;
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
  font-size: 2rem;
`;

const MenuButton = styled.div`
    cursor: pointer;
`;
