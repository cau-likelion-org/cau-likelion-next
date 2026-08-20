import { ReactNode, useEffect, useState } from 'react';
import { Router } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import { UserProfile } from '@@types/request';
import LogoutButton from '@mypage/component/LogoutButton';
import Sidebar, { PATHNAME_TO_ACTIVE, SidebarActive } from '@mypage/component/Sidebar';
import PageLoadingGate from '@common/pageGate/PageLoadingGate';
import { IcChevronRight } from '@assets/svg';
import { getUserProfile } from 'src/apis/account';
import useTokenStore from 'src/store/useTokenStore';
import { canManageSitePages } from '@utils/index';
import { Black, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';
import { containerCss, media } from '@utils/constant/breakpoint';

const BREADCRUMB_LABEL: Record<SidebarActive, string> = {
  home: '홈',
  attendance: '출결관리',
  assignment: '과제관리',
  'admin-landing': '랜딩페이지 관리',
  'admin-about': '소개 페이지 관리',
  'admin-blog': '블로그 페이지 관리',
  'admin-members': '전체 회원/파트 관리',
  'admin-recruit': '리크루팅 사전 알림 발송',
};

// 페이지 바깥(getLayout)에서 렌더되어 마이페이지 안에서 이동해도 유지되므로,
// 사이드바 노출에 필요한 역할은 페이지에서 받지 않고 셸이 직접 조회한다 (react-query 캐시 공유)
// isAdmin은 목 데이터로 역할을 바꿔보는 _debug 프리뷰 전용 override
const MyPageShell = ({
  active,
  isAdmin,
  children,
}: {
  active: SidebarActive;
  isAdmin?: boolean;
  children: ReactNode;
}) => {
  const tokenState = useTokenStore((state) => state.token);
  const { data: userProfile } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => getUserProfile(tokenState),
    retry: false,
    enabled: !!tokenState.access,
  });
  const showAdminMenu = isAdmin ?? (!!userProfile && canManageSitePages(userProfile.role));

  const [isRouting, setIsRouting] = useState(false);
  // 목적지 페이지 컴포넌트가 완전히 교체되기 전에도, 클릭한 목적지 기준으로 사이드바 활성탭을 바로 반영하기 위한 값
  const [pendingActive, setPendingActive] = useState<SidebarActive | null>(null);
  useEffect(() => {
    const start = (url: string) => {
      setIsRouting(url.startsWith('/mypage'));
      const pathname = url.split('?')[0].split('#')[0];
      setPendingActive(PATHNAME_TO_ACTIVE[pathname] ?? null);
    };
    const end = () => {
      setIsRouting(false);
      setPendingActive(null);
    };

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  const displayedActive = pendingActive ?? active;

  return (
    <Wrapper>
      <Header>
        <TitleRow>
          <Title>마이페이지</Title>
          <LogoutButton />
        </TitleRow>
        <Breadcrumb aria-label="현재 위치">
          <span>마이페이지</span>
          <IcChevronRight width={16} height={16} aria-hidden />
          <span>{BREADCRUMB_LABEL[displayedActive]}</span>
        </Breadcrumb>
      </Header>
      <Content>
        <SidebarSlot>
          <Sidebar active={displayedActive} isAdmin={showAdminMenu} />
        </SidebarSlot>
        <Main>{isRouting ? <PageLoadingGate /> : children}</Main>
      </Content>
    </Wrapper>
  );
};

export default MyPageShell;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 52px;
  ${containerCss}
  padding-top: 40px;
  padding-bottom: 80px;

  ${media.xs} {
    gap: 0;
    padding: 0 20px 40px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${media.xs} {
    gap: 24px;
    padding: 52px 0;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.h1`
  margin: 0;
  color: ${Orange.o500};
  ${typographyCss(Typography.display2.bold)}
`;

const Breadcrumb = styled.nav`
  display: none;

  ${media.xs} {
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${Black.b900};
    ${typographyCss(Typography.body1Normal.medium)}
  }
`;

const Content = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
`;

const SidebarSlot = styled.div`
  ${media.xs} {
    display: none;
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  flex: 1;
  min-width: 0;

  ${media.xs} {
    gap: 32px;
  }
`;
