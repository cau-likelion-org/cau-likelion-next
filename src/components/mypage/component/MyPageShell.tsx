import { ReactNode } from 'react';
import styled from 'styled-components';

import LogoutButton from '@mypage/component/LogoutButton';
import Sidebar, { SidebarActive } from '@mypage/component/Sidebar';
import { IcChevronRight } from '@assets/svg';
import { Black, Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

// 모바일에서는 사이드바 대신 현재 위치를 브레드크럼으로 보여준다
const BREADCRUMB_LABEL: Record<SidebarActive, string> = {
  home: '홈',
  attendance: '출결관리',
  assignment: '과제관리',
  'admin-landing': '랜딩페이지 관리',
  'admin-about': '소개 페이지 관리',
  'admin-blog': '블로그 페이지 관리',
};

const MyPageShell = ({
  active,
  isAdmin = false,
  children,
}: {
  active: SidebarActive;
  isAdmin?: boolean;
  children: ReactNode;
}) => {
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
          <span>{BREADCRUMB_LABEL[active]}</span>
        </Breadcrumb>
      </Header>
      <Content>
        <SidebarSlot>
          <Sidebar active={active} isAdmin={isAdmin} />
        </SidebarSlot>
        <Main>{children}</Main>
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
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px 80px;

  @media (max-width: 900px) {
    gap: 0;
    padding: 0 20px 40px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  @media (max-width: 900px) {
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

  @media (max-width: 900px) {
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
  @media (max-width: 900px) {
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

  @media (max-width: 900px) {
    gap: 32px;
  }
`;
