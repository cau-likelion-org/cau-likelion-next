import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import NotificationSetting from '@mypage/component/NotificationSetting';
import { Label } from '@utils/constant/color';
import { Typography, typographyCss } from '@utils/constant/typography';

export type SidebarActive =
  | 'home'
  | 'attendance'
  | 'assignment'
  | 'admin-landing'
  | 'admin-about'
  | 'admin-blog'
  | 'admin-members'
  | 'recruit-notification'
  | 'recruit-settings'
  | 'recruit-applicants'
  | 'recruit-results';

// 라우팅 시작 시점(routeChangeStart)에 목적지 url만으로 활성 탭을 미리 계산하기 위한 매핑
export const PATHNAME_TO_ACTIVE: Record<string, SidebarActive> = {
  '/mypage': 'home',
  '/mypage/attendance': 'attendance',
  '/mypage/assignment': 'assignment',
  '/mypage/admin/landing': 'admin-landing',
  '/mypage/admin/about': 'admin-about',
  '/mypage/admin/blog': 'admin-blog',
  '/mypage/admin/members': 'admin-members',
  '/mypage/recruit/notification': 'recruit-notification',
  '/mypage/recruit/settings': 'recruit-settings',
  '/mypage/recruit/applicants': 'recruit-applicants',
  '/mypage/recruit/results': 'recruit-results',
};

interface MenuGroupItem {
  key: SidebarActive;
  href: string;
  label: string;
}

const ADMIN_MENU_ITEMS: MenuGroupItem[] = [
  { key: 'admin-landing', href: '/mypage/admin/landing', label: '랜딩페이지 관리' },
  { key: 'admin-about', href: '/mypage/admin/about', label: '소개 페이지 관리' },
  { key: 'admin-blog', href: '/mypage/admin/blog', label: '블로그 페이지 관리' },
  { key: 'admin-members', href: '/mypage/admin/members', label: '전체 회원/파트 관리' },
];

const RECRUIT_MENU_ITEMS: MenuGroupItem[] = [
  { key: 'recruit-notification', href: '/mypage/recruit/notification', label: '사전 알림 발송' },
  { key: 'recruit-settings', href: '/mypage/recruit/settings', label: '기수/문항 관리' },
  { key: 'recruit-applicants', href: '/mypage/recruit/applicants', label: '지원서 관리' },
  { key: 'recruit-results', href: '/mypage/recruit/results', label: '전형 결과 관리' },
];

const MenuGroup = ({ title, items, active }: { title: string; items: MenuGroupItem[]; active: SidebarActive }) => {
  const router = useRouter();
  const isInSection = items.some((item) => item.key === active);

  const [isOpen, setIsOpen] = useState(isInSection);

  const [wasInSection, setWasInSection] = useState(isInSection);
  if (wasInSection !== isInSection) {
    setWasInSection(isInSection);
    setIsOpen(isInSection);
  }

  const handleToggle = () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);
    if (willOpen && !isInSection) router.push(items[0].href);
  };

  return (
    <Group>
      <GroupToggle type="button" aria-expanded={isOpen} $active={isInSection} onClick={handleToggle}>
        {title}
      </GroupToggle>
      {isOpen &&
        items.map((item) => (
          <StyledLink key={item.key} href={item.href}>
            <SubItem $active={active === item.key} $inSection={isInSection}>
              {item.label}
            </SubItem>
          </StyledLink>
        ))}
    </Group>
  );
};

const Sidebar = ({
  active,
  isAdmin = false,
  canManageRecruit = false,
}: {
  active: SidebarActive;
  isAdmin?: boolean;
  canManageRecruit?: boolean;
}) => {
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
      <NotificationSetting />
      {isAdmin && <MenuGroup title="관리자" items={ADMIN_MENU_ITEMS} active={active} />}
      {canManageRecruit && <MenuGroup title="리크루팅" items={RECRUIT_MENU_ITEMS} active={active} />}
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

const Group = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
`;

// 그룹 하위 메뉴에 들어와 있으면 상위 항목들과 동일하게 선택된 색으로 표시한다
const GroupToggle = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 8px 0;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: ${(props) => (props.$active ? Label.strong : Label.assistive)};
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

// 그룹 화면에 들어와 있을 때만 하위 항목도 선택 색으로 보여주고, 그 전에는 전부 미선택 색
const SubItem = styled.p<{ $active?: boolean; $inSection?: boolean }>`
  position: relative;
  margin: 0;
  width: 100%;
  padding: 8px 0;
  text-align: left;
  color: ${(props) => (props.$inSection ? Label.strong : Label.assistive)};
  ${(props) => typographyCss(props.$active ? Typography.label1Normal.bold : Typography.label1Normal.medium)}

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -6px;
    right: -6px;
    height: 28px;
    border-radius: 6px;
    background-color: ${(props) => (props.$active ? 'rgba(0, 0, 0, 0.04)' : 'transparent')};
    transform: translateY(-50%);
    pointer-events: none;
  }
`;
