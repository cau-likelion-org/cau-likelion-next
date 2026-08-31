import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import Button from '@common/button/Button';
import LogoutButton from '@mypage/component/LogoutButton';
import NotificationSetting from '@mypage/component/NotificationSetting';
import { getUserProfile } from 'src/apis/account';
import useTokenStore from 'src/store/useTokenStore';
import useRecruitModalStore from 'src/store/useRecruitModalStore';
import useScrollLock from 'src/hooks/useScrollLock';
import { canManageSitePages } from '@utils/index';
import { BackgroundColor, Black, Line } from '@utils/constant/color';
import { media } from '@utils/constant/breakpoint';
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
  { title: '출결관리', routing: '/mypage/attendance' },
  { title: '과제관리', routing: '/mypage/assignment' },
];

const MobileNavModal = ({ isModalOn, onClose }: { isModalOn: boolean; onClose?: () => void }) => {
  useScrollLock(isModalOn);

  const router = useRouter();
  const { access } = useTokenStore((state) => state.token);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const isLogin = hasHydrated && !!access;

  const openRecruitClosedAlert = useRecruitModalStore((state) => state.openClosedAlert);

  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile({ access, refresh: null }),
    retry: false,
    enabled: isLogin,
  });

  const handleNavigate = (routing: string) => {
    onClose?.();
    if (routing === '#') {
      openRecruitClosedAlert();
      return;
    }
    router.push(routing);
  };

  return (
    <Wrapper $open={isModalOn} aria-hidden={!isModalOn}>
      <Inner $isLogin={isLogin}>
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
                <AdminMenuItem type="button" onClick={() => handleNavigate('/mypage/admin/landing')}>
                  관리자
                </AdminMenuItem>
              )}
              {/* 과제 알림 설정 — 아기사자에게만 노출된다 (컴포넌트가 역할을 직접 판별) */}
              <NotificationSetting guideAlign="left" />
            </MenuGroup>
            <LogoutButton />
          </>
        ) : (
          <LoginAction>
            <Button variant="solid" color="primary" size="medium" onClick={() => handleNavigate('/login')}>
              로그인
            </Button>
          </LoginAction>
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
    </Wrapper>
  );
};

export default MobileNavModal;

const Wrapper = styled.div<{ $open: boolean }>`
  position: fixed;
  top: calc(60px + env(safe-area-inset-top, 0px));
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10001;
  overflow-y: auto;
  background-color: ${BackgroundColor};
  opacity: ${(props) => (props.$open ? 1 : 0)};
  visibility: ${(props) => (props.$open ? 'visible' : 'hidden')};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;

  ${media.sm} {
    display: none;
  }
`;

const Inner = styled.div<{ $isLogin: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: 100%;
  padding: ${(props) => (props.$isLogin ? 10 : 20)}px 20px 40px;
`;

const LoginAction = styled.div`
  align-self: flex-end;
`;

const MenuGroup = styled.div<{ $gap: number; $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${(props) => props.$gap}px;
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

const AdminMenuItem = styled(MenuItem)`
  ${media.mobileDevice} {
    display: none;
  }
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
