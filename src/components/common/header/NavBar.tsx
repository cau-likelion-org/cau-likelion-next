import { useState } from 'react';
import styled from 'styled-components';
import Button from '@common/button/Button';
import RecruitClosedAlert from '@home/main/RecruitClosedAlert';
import RecruitNotifyModal from '@home/main/RecruitNotifyModal';
import { BackgroundColor, Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTokenStore from 'src/store/useTokenStore';
import LikelionCAULogo from 'src/assets/svg/logo/logo-likelion-chungang.svg';

export interface IMenu {
  title: string;
  routing: string;
  target?: string;
}

const RECRUIT_MENU_TITLE = '지원하기';

const MENU_ITEMS: IMenu[] = [
  { title: '소개', routing: '#' },
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
  const [isRecruitClosedAlertOpen, setIsRecruitClosedAlertOpen] = useState(false);
  const [isRecruitModalOpen, setIsRecruitModalOpen] = useState(false);

  return (
    <Wrapper>
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
                <MenuLink key={title} as="button" type="button" onClick={() => setIsRecruitClosedAlertOpen(true)}>
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

      {isRecruitClosedAlertOpen && (
        <RecruitClosedAlert
          onClose={() => setIsRecruitClosedAlertOpen(false)}
          onConfirm={() => {
            setIsRecruitClosedAlertOpen(false);
            setIsRecruitModalOpen(true);
          }}
        />
      )}
      {isRecruitModalOpen && <RecruitNotifyModal onClose={() => setIsRecruitModalOpen(false)} />}
    </Wrapper>
  );
};

export default NavBar;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${BackgroundColor};
  z-index: 9999;
`;

const Content = styled.div`
  width: 100%;
  max-width: 1100px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
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
