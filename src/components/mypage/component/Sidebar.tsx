import Link from 'next/link';
import styled from 'styled-components';

import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export type SidebarActive = 'home' | 'attendance' | 'assignment' | 'admin-landing';

const Sidebar = ({ active, isAdmin = false }: { active: SidebarActive; isAdmin?: boolean }) => {
  return (
    <Wrapper>
      <StyledLink href="/mypage">
        <Item $active={active === 'home'}>홈</Item>
      </StyledLink>
      <StyledLink href="/mypage/attendance">
        <Item $active={active === 'attendance'}>출결관리</Item>
      </StyledLink>
      <StyledLink href="/mypage/assignment">
        <Item $active={active === 'assignment'}>과제관리</Item>
      </StyledLink>
      {isAdmin && (
        <AdminGroup>
          <GroupTitle>관리자</GroupTitle>
          <StyledLink href="/mypage/admin/landing">
            <Item $active={active === 'admin-landing'}>랜딩페이지 관리</Item>
          </StyledLink>
        </AdminGroup>
      )}
    </Wrapper>
  );
};

export default Sidebar;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  gap: 4px;
  width: 160px;
  padding: 0 6px;
`;

const AdminGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const GroupTitle = styled.p`
  margin: 0;
  width: 100%;
  padding: 8px 0;
  text-align: left;
  color: ${Label.strong};
  ${typographyCss(Typography.heading2.bold)}
`;

const StyledLink = styled(Link)`
  display: block;
  width: 100%;
  text-decoration: none;
`;

const Item = styled.p<{ $active?: boolean }>`
  margin: 0;
  width: 100%;
  padding: 8px 0;
  text-align: left;
  color: ${(props) => (props.$active ? Label.strong : Label.assistive)};
  ${typographyCss(Typography.heading2.bold)}
`;
