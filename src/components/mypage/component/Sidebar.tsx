import Link from 'next/link';
import styled from 'styled-components';

import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export type SidebarActive = 'home' | 'attendance' | 'assignment';

const Sidebar = ({ active }: { active: SidebarActive }) => {
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
