import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import Button from '@common/button/Button';
import LogoutButton from '@mypage/component/LogoutButton';
import NotificationSetting from '@mypage/component/NotificationSetting';
import MobileUnsupportedModal from '@common/modal/MobileUnsupportedModal';
import { getUserProfile } from 'src/apis/account';
import useTokenStore from 'src/store/useTokenStore';
import { canManageSitePages } from '@utils/index';
import { BackgroundColor, Black, Line } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

const SITE_MENU = [
  { title: '소개', routing: '/about' },
  { title: '프로젝트', routing: '/project' },
  { title: '갤러리', routing: '/gallery' },
  { title: '블로그', routing: '/blog' },
  { title: '지원하기', routing: '#' },
];

const MY_PAGE_MENU = [
  { title: '홈', routing: '/mypage' },
  { title: '과제관리', routing: '/mypage/assignment' },
  { title: '출결관리', routing: '/mypage/attendance' },
];

const MobileNavModal = ({ isModalOn, onClose }: { isModalOn: boolean; onClose?: () => void }) => {
  const router = useRouter();
  const { access } = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const isLogin = hasHydrated && !!access;

  const [isUnsupportedOpen, setIsUnsupportedOpen] = useState(false);

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile({ access, refresh: null }),
    retry: false,
    enabled: isLogin,
  });

  const handleNavigate = (routing: string) => {
    onClose?.();
    if (routing !== '#') router.push(routing);
  };

  // 관리자 페이지는 데스크톱 전용이라 모바일에서는 이동 대신 안내 모달을 띄운다
  const handleAdminClick = () => {
    onClose?.();
    setIsUnsupportedOpen(true);
  };

  return (
    <Wrapper $open={isModalOn} aria-hidden={!isModalOn}>
      <Inner>
        {isLogin ? (
          <>
            <MenuGroup $gap={26} $fullWidth>
              <GroupTitle>마이페이지</GroupTitle>
              {MY_PAGE_MENU.map((item) => (
                <MenuItem key={item.routing} type="button" onClick={() => handleNavigate(item.routing)}>
                  {item.title}
                </MenuItem>
              ))}
              {/* 관리자 메뉴는 중하하 관리자에게만 노출 */}
              {!!userProfile && canManageSitePages(userProfile.role) && (
                <MenuItem type="button" onClick={handleAdminClick}>
                  관리자
                </MenuItem>
              )}
              {/* 과제 알림 설정 — 아기사자에게만 노출된다 (컴포넌트가 역할을 직접 판별) */}
              <NotificationSetting guideAlign="left" />
            </MenuGroup>
            <LogoutButton />
          </>
        ) : (
          <Button variant="solid" color="primary" size="small" onClick={() => handleNavigate('/login')}>
            로그인
          </Button>
        )}

        <Divider />

        <MenuGroup $gap={40}>
          {SITE_MENU.map((item) =>
            item.routing === '#' ? (
              <MenuItem key={item.title} type="button" onClick={() => handleNavigate(item.routing)}>
                {item.title}
              </MenuItem>
            ) : (
              <MenuLink key={item.title} href={item.routing} onClick={onClose}>
                {item.title}
              </MenuLink>
            ),
          )}
        </MenuGroup>
      </Inner>

      {isUnsupportedOpen && <MobileUnsupportedModal onClose={() => setIsUnsupportedOpen(false)} />}
    </Wrapper>
  );
};

export default MobileNavModal;

const Wrapper = styled.div<{ $open: boolean }>`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  overflow-y: auto;
  background-color: ${BackgroundColor};
  opacity: ${(props) => (props.$open ? 1 : 0)};
  visibility: ${(props) => (props.$open ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;

  @media (min-width: 900px) {
    display: none;
  }
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 40px;
  width: 100%;
  padding: 10px 20px 40px;
`;

const MenuGroup = styled.div<{ $gap: number; $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${(props) => props.$gap}px;
  /* 메뉴 항목은 오른쪽 정렬이지만, 알림 설정 블록은 메뉴 영역 전체 폭을 쓴다 */
  width: ${(props) => (props.$fullWidth ? '100%' : 'auto')};
`;

const GroupTitle = styled.p`
  margin: 0;
  color: ${Black.b80};
  ${typographyCss(Typography.label1Normal.medium)}
`;

const menuItemCss = `
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  text-decoration: none;
`;

const MenuItem = styled.button`
  ${menuItemCss}
  color: ${Black.b900};
  ${typographyCss(Typography.headline1.bold)}
`;

const MenuLink = styled(Link)`
  ${menuItemCss}
  color: ${Black.b900};
  ${typographyCss(Typography.headline1.bold)}
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${Line.normal};
`;
