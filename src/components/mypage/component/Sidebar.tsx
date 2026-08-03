import Link from 'next/link';
import styled from 'styled-components';

import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export type SidebarActive = 'home' | 'attendance' | 'assignment';

const Sidebar = ({ active }: { active: SidebarActive }) => {
  return (
    <Wrapper>
      <Link href="/mypage">
        <Item as="span" $active={active === 'home'}>
          홈
        </Item>
      </Link>
      <Link href="/mypage/attendance">
        <Item as="span" $active={active === 'attendance'}>
          출결관리
        </Item>
      </Link>
      <Item $active={active === 'assignment'}>과제관리</Item>
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

const Item = styled.p<{ $active?: boolean }>`
  display: block;
  margin: 0;
  width: 100%;
  padding: 8px 0;
  text-align: center;
  text-decoration: none;
  color: ${(props) => (props.$active ? Label.strong : Label.assistive)};
  ${typographyCss(Typography.heading2.bold)}
`;
