import { ReactNode } from 'react';
import styled from 'styled-components';

import LogoutButton from '@mypage/component/LogoutButton';
import Sidebar, { SidebarActive } from '@mypage/component/Sidebar';
import { Orange } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

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
      <TitleRow>
        <Title>마이페이지</Title>
        <LogoutButton />
      </TitleRow>
      <Content>
        <Sidebar active={active} isAdmin={isAdmin} />
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

const Content = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  flex: 1;
  min-width: 0;
`;
