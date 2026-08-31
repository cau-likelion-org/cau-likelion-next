import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '@common/button/Button';
import { Label, Line } from '@utils/constant/color';
import { ContainerMaxWidth, ContainerPaddingXl, media } from '@utils/constant/breakpoint';
import { Typography, typographyCss } from '@utils/constant/typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTokenStore from 'src/store/useTokenStore';
import useRecruitModalStore from 'src/store/useRecruitModalStore';
import LikelionCAULogo from 'src/assets/svg/logo/logo-likelion-chungang.svg';

export interface IMenu {
  title: string;
  routing: string;
  target?: string;
}

const RECRUIT_MENU_TITLE = '지원하기';

const MENU_ITEMS: IMenu[] = [
  { title: '소개', routing: '/about' },
  { title: '프로젝트', routing: '/project' },
  { title: '갤러리', routing: '/gallery' },
  { title: '블로그', routing: '/blog' },
  { title: '지원하기', routing: '#' },
];

const NavBar = () => {
  const router = useRouter();
  const { access: tokenState } = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const isLogin = hasHydrated && !!tokenState;
  const openRecruitClosedAlert = useRecruitModalStore((state) => state.openClosedAlert);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleRecruitClick = () => {
    openRecruitClosedAlert();
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Wrapper $isScrolled={isScrolled}>
      <Content>
        <LogoWrapper>
          <Link href={'/'}>
            <LogoImage>
              <LikelionCAULogo width={220} height={20} aria-label="로고 이미지" />
            </LogoImage>
          </Link>
        </LogoWrapper>

        <RightSection>
          <MenuList>
            {MENU_ITEMS.map(({ title, routing, target }) =>
              title === RECRUIT_MENU_TITLE ? (
                <MenuLink key={title} as="button" type="button" onClick={handleRecruitClick}>
                  {title}
                </MenuLink>
              ) : target ? (
                <MenuLink key={title} href={routing} target={target} rel="noopener noreferrer">
                  {title}
                </MenuLink>
              ) : (
                <Link key={title} href={routing}>
                  <MenuLink as="span">{title}</MenuLink>
                </Link>
              ),
            )}
          </MenuList>
          <Button size="medium" onClick={() => router.push(isLogin ? '/mypage' : '/login')}>
            {isLogin ? '마이페이지' : '로그인'}
          </Button>
        </RightSection>
      </Content>
    </Wrapper>
  );
};

export default NavBar;

const Wrapper = styled.div<{ $isScrolled: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding-top: env(safe-area-inset-top, 0px);
  z-index: 9999;
  background-color: ${(props) => (props.$isScrolled ? 'rgba(255, 255, 255, 0.88)' : 'transparent')};
  backdrop-filter: ${(props) => (props.$isScrolled ? 'blur(32px)' : 'none')};
  border-bottom: 1px solid ${(props) => (props.$isScrolled ? Line.normal : 'transparent')};

  ${media.xs} {
    display: none;
  }
`;

const Content = styled.div`
  width: 100%;
  max-width: ${ContainerMaxWidth.lg}px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;

  ${media.xl} {
    max-width: none;
    padding: 14px ${ContainerPaddingXl}px;
  }
`;

const LogoImage = styled.div`
  min-width: 220px;
  min-height: 20px;
`;

const LogoWrapper = styled.div`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const MenuList = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;

const MenuLink = styled.a`
  ${typographyCss(Typography.body2Normal.bold)}
  padding: 0;
  border: none;
  background: none;
  color: ${Label.normal};
  cursor: pointer;
  white-space: nowrap;
  text-decoration: none;
`;
