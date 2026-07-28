import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import CAULogo from '@image/cau사자.png';
import NavButton from './NavButton';
import { BackgroundColor } from '@utils/constant/color';
import Link from 'next/link';
import useTokenStore from 'src/store/useTokenStore';
import HoverButton from './HoverButton';

export interface IHoverButton {
  hover: {
    title: string;
  };
  dropdown: IMenu[];
}

export interface IMenu {
  title: string;
  routing: string;
  target?: string;
}

const NavBar = () => {
  const { access: tokenState } = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const isLogin = hasHydrated && !!tokenState;

  const hover: IHoverButton['hover'] = { title: '아카이빙' };
  const dropdown: IHoverButton['dropdown'] = [
    { title: '세션', routing: '/session' },
    { title: '추억', routing: '/gallery' },
  ];

  const menuDataSelector = (): IMenu[] => {
    const resultArray = [
      { title: '프로젝트', routing: '/project' },
      { title: '위키', routing: 'https://wiki.cau-likelion.org', target: '_blank' },
      { title: '피드', routing: 'https://blog.cau-likelion.org', target: '_blank' },
      { title: isLogin ? 'MY' : 'Log in', routing: isLogin ? '/mypage' : '/login' },
    ];
    if (isLogin) {
      const [project, wiki, feed, login] = resultArray;
      return [project, wiki, feed, { title: '출석체크', routing: '/attendance' }, login];
    }
    return resultArray;
  };

  return (
    <Wrapper>
      <LogoWrapper>
        <Link href={'/'}>
          <LogoImage>
            <Image src={CAULogo} width={50} height={50} alt="로고 이미지" />
          </LogoImage>
        </Link>
        <Link href={'/'}>
          <Title>LIKELION</Title>
        </Link>
      </LogoWrapper>
      <ButtonWrapper>
        <HoverButton hover={hover} dropdown={dropdown} />
        {menuDataSelector().map(({ title, routing, target }, index) => (
          <NavButton key={index + routing} title={title} routing={routing} target={target} isLogin={isLogin} />
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
  @media (max-width: 1440px) {
    padding: 0 100px;
  }
  @media (max-width: 1280px) {
    padding: 0 90px;
  }
  padding: 0 130px;
  align-items: center;
  justify-content: space-between;
  background-color: ${BackgroundColor};
  z-index: 9999;

  @media (max-width: 899px) {
    display: none;
  }
`;

const LogoImage = styled.div`
  min-width: 50px;
  min-height: 50px;
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
  font-size: 2.3rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
`;
